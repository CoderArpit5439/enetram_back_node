import UserModel from "../../model/auth/user.register.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { json } from "express";
import envconfig from "../../config/enviormentconfig.js";

const JWT_SECRET = envconfig.JWT_token;

export const userRegister = async (req, res) => {
  const { userName, email, password, state, city, mobile } = req.body;

  try {
    if (!userName || !email || !password || !state || !city || !mobile) {
      return res.status(400).json({
        status: false,
        message: "User name is required",
        data: [],
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        status: false,
        message: "User are  already exists",
        data: [],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
      mobile,
      state,
      city,
    });

    await newUser.save();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        random: randomNum,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      token,
      data: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        mobile: newUser.mobile,
        state: newUser.state,
        city: newUser.city,
      },
    });
  } catch (error) {
    console.error("Something went wrong:", error);

    if (error.validationError) {
      return res.status(400).json({
        status: false,
        message: "Validation failed",
        errors: error.errors || [],
        data: [],
      });
    }
    res.status(500).json({
      status: false,
      message: "Internal server error =>" ,error,
      data: [],
    });
  }
};

export const userRegisterOtpVerify = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        status: false,
        message: "Otp is required",
        data: [],
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Authorization token missing or malformed",
        data: [],
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: "Invalid or expired token",
        data: [],
      });
    }

    const userId = decoded.id;
    if (decoded?.random !== otp) {
      return res.status(404).json({
        status: false,
        message: "Wrong otp",
        data: [],
      });
    }
    console.log("User ID from token:", userId);

    return res.status(200).json({
      status: true,
      message: "OTP verified successfully",
      data: { userId },
    });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
      data: [],
    });
  }
};
