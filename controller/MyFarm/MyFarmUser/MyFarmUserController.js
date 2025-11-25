import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import myFarmUser from "../../../model/MyFarm/User/userModel.js";

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
        user
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
    const { id } = req.params;
    console.log(`object`);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await myFarmUser.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
      paranoid: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
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
