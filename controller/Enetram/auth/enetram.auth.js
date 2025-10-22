import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import patient from "../../../model/Enetram/patient/patient.model.js";
import hospital from "../../../model/Enetram/hospital/hospital.model.js";
import optical from "../../../model/Enetram/optical/optical.model.js";


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Utility: check if identifier is email or mobile
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const loginUser = async (req, res) => {
  try {
    const { identifier, password, login_type } = req.body;

    if (!identifier || !password || !login_type) {
      return res.status(400).json({
        success: false,
        message:
          "Identifier (email or mobile), password, and login_type are required",
      });
    }

    let user = null;
    let userType = "";

    // Decide which model to use
    let model =
      login_type === "patient"
        ? patient
        : login_type === "hospital"
        ? hospital
        : login_type === "optical"
        ? optical
        : null;

    if (!model) {
      return res.status(400).json({
        success: false,
        message: "Invalid login_type. Must be 'patient' or 'hospital'",
      });
    }

    const isIdentifierEmail = isEmail(identifier);

    const whereCondition = isIdentifierEmail
      ? {
          [login_type === "patient"
            ? "ptn_email"
            : "hospital"
            ? "hosp_email"
            : "opt_email"]: identifier,
        }
      : {
          [login_type === "patient"
            ? "ptn_mobile"
            : "hospital"
            ? "hosp_mobile"
            : "opt_mobile"]: identifier,
        };

    // Find user
    user = await model.findOne({ where: whereCondition });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `No ${login_type} found with that ${
          isIdentifierEmail ? "email" : "mobile number"
        }`,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // All good – prepare token payload
    const userPayload = {
      user,
      login_type,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: "7d" });

    // Exclude password from response
    const { password: pw, ...safeUser } = user.toJSON();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
