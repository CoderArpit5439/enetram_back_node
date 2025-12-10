
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import myFarmUser from "../../../model/MyFarm/User/userModel.js";
import myFarmHouseModel from "../../../model/MyFarm/FarmHouse/FarmHouseModel.js";
import { model } from "mongoose";
import bankDetailModel from "../../../model/MyFarm/User/bankDetailModel.js";
import Booking from "../../../model/MyFarm/User/bookingModel.js";

dotenv.config();

export const farmUserRegister = async (req, res) => {
  try {
    const { name, mobileNumber, email, adhar_no, password, agrement } =
      req.body;

    if (
      !name ||
      !mobileNumber ||
      !adhar_no ||
      !password ||
      !agrement ||
      !email
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });
    }

    const user = await myFarmUser.findOne({
      where: { mobileNumber },
      raw: true,
      paranoid: false,
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with this number already exists",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    const otpToken = jwt.sign(
      { name, mobileNumber, email, adhar_no, password, agrement, otp },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"MyFarm App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP for MyFarm Registration",
      html: `<p>Hello ${name},</p>
             <p>Your OTP for registration is: <strong>${otp}</strong></p>
             <p>OTP is valid for 10 minutes.</p>`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
      otpToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const { name, mobileNumber, email, adhar_no, password, agrement } =
      req.body;

    if (
      !name ||
      !mobileNumber ||
      !email ||
      !adhar_no ||
      !password ||
      !agrement
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const otpToken = authHeader.split(" ")[1].trim();

    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const id = decoded.user.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [updated] = await myFarmUser.update(
      {
        name,
        mobileNumber,
        email,
        adhar_no,
        password: hashedPassword,
        agrement,
      },
      {
        where: { id },
      }
    );

    if (updated === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or no changes made",
      });
    }

    const updatedUser = await myFarmUser.findOne({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const sendResetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required to send password reset OTP.",
      });
    }

    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Find user
    const findUser = await myFarmUser.findOne({
      where: { email },
      raw: true,
      paranoid: false,
    });

    if (!findUser) {
      return res.status(200).json({
        success: true,
        message:
          "If the email exists in our system, a password reset OTP has been sent.",
      });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Create JWT token with OTP
    const otpToken = jwt.sign(
      {
        email,
        otp,
        findUser,
        purpose: "password_reset",
        timestamp: Date.now(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const userName = findUser.name || findUser.username || "User";

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - MyFarm</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .otp-container {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed #4CAF50;
        }
        .otp-code {
            font-size: 42px;
            font-weight: bold;
            color: #2E7D32;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .instructions {
            background-color: #E8F5E9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #eee;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
        .warning {
            color: #d32f2f;
            font-size: 14px;
            font-weight: bold;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2E7D32;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>MyFarm Account Security</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            
            <p>We received a request to reset your password for your MyFarm account. If you didn't make this request, you can safely ignore this email.</p>
            
            <div class="otp-container">
                <p style="margin-bottom: 15px; color: #555;">Use this One-Time Password (OTP) to reset your password:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin-top: 15px; color: #888; font-size: 14px;">OTP is valid for 10 minutes only</p>
            </div>
            
            <div class="instructions">
                <h3 style="margin-top: 0; color: #2E7D32;">📝 Instructions:</h3>
                <ol>
                    <li>Enter the OTP above in the password reset page</li>
                    <li>Create a new strong password</li>
                    <li>Confirm your new password</li>
                    <li>Login with your new credentials</li>
                </ol>
            </div>
            
            <p class="warning">⚠️ IMPORTANT: Never share this OTP with anyone. MyFarm team will never ask for your OTP or password.</p>
            
            <p>Having trouble? Contact our support team at <a href="mailto:support@myfarm.com">support@myfarm.com</a></p>
        </div>
        
        <div class="footer">
            <div class="logo">🌱 MyFarm</div>
            <p>Growing Together, Farming Better</p>
            <p>This is an automated message, please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} MyFarm App. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"MyFarm Security" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🔐 Password Reset OTP - MyFarm Account",
      html: htmlTemplate,
      text: `Password Reset Request\n\nHello ${userName},\n\nWe received a request to reset your password for your MyFarm account.\n\nYour OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nMyFarm Team`,
    });

    // Log the OTP sent (for development/debugging only - remove in production)
    if (process.env.NODE_ENV === "development") {
      console.log(`OTP sent to ${email}: ${otp}`);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset OTP has been sent to your email.",
      otpToken,
      // Don't send OTP in response for security
    });
  } catch (error) {
    console.error("Password reset error:", error);

    // Don't expose specific error details in production
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Unable to process password reset request. Please try again later."
        : error.message;

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: errorMessage,
    });
  }
};

export const verifyOtpforResetPasword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const otpToken = authHeader.split(" ")[1];

    const { otp, password } = req.body;

    if (!otp || !password) {
      return res.status(400).json({
        success: false,
        message: "OTP and new password are required",
      });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (parseInt(otp) !== decoded.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const userId = decoded.findUser?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await myFarmUser.update(
      { password: hashedPassword },
      {
        where: { id: userId },
        paranoid: false,
      }
    );

    if (updated[0] === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found or update failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otpToken, otp } = req.body;

    if (!otpToken || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP or token missing" });
    }

    // Decode JWT
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (parseInt(otp) !== decoded.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(decoded.password, 10);

    const newUser = await myFarmUser.create({
      name: decoded.name,
      mobileNumber: decoded.mobileNumber,
      email: decoded.email,
      adhar_no: decoded.adhar_no,
      password: hashedPassword,
      agrement: decoded.agrement,
    });
    const authToken = jwt.sign(
      { id: newUser.id, number: newUser.number },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: authToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        number: newUser.mobileNumber,
        email: newUser.email,
        adhar_no: newUser.adhar_no,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const farmUserLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    if (!mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and password are required",
      });
    }

    const user = await myFarmUser.findOne({
      where: { mobileNumber },
      paranoid: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        user,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const fetchSingleUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const otpToken = authHeader.split(" ")[1].trim();

    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const id = decoded.user.id;

    const user = await myFarmUser.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: myFarmHouseModel,
          as: "farmHouse",
          required: false,
        },
        {
          model: bankDetailModel,
          as: "bankdetails",
          required: false,
        },
      ],
      paranoid: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const farmHouseCount = await myFarmHouseModel.count({
      where: { user_id: id },
      paranoid: false,
    });

    const bankDetailCount = await bankDetailModel.count({
      where: { user_id: id },
      paranoid: false,
    });

    const bookingCount = await Booking.count({
      where: { user_id, id },
      paranoid: false,
    });

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: user.toJSON(),
      count: {
        farmHouseCount,
        bankDetailCount,
        bookingCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
