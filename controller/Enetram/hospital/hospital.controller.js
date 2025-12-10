import Hospital from "../../../model/Enetram/hospital/hospital.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UniqueConstraintError, ValidationError } from "sequelize";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "AS2565";

// Add New Hospital

export const registerHospital = async (req, res) => {
  try {
    const {
      hos_name,
      hos_slug,
      hos_contact_person,
      hos_mobile,
      hos_email,
      hos_website,
      hos_address,
      hos_city,
      hos_state,
      hos_pincode,
      hos_latitude,
      hos_longitude,
      hos_specialities,
      hos_username,
      hos_password,
      hos_about,
      hos_opening_hours,
    } = req.body;

    const hos_logo = req.file ? req.file.filename : null;

    if (!hos_logo) {
      return res.status(400).json({ message: "Hospital logo is required" });
    }

    const existingUsername = await Hospital.findOne({
      where: { hos_username },
    });
    if (existingUsername) {
      return res.status(400).json({status :false , message: "User already taken" });
    }

    const existingEmail = await Hospital.findOne({ where: { hos_email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingMobile = await Hospital.findOne({ where: { hos_mobile } });
    if (existingMobile) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }

    const hashedPassword = await bcrypt.hash(hos_password, 10);

    const newHospital = await Hospital.create({
      hos_name,
      hos_slug,
      hos_contact_person,
      hos_mobile,
      hos_email,
      hos_logo,
      hos_website,
      hos_address,
      hos_city,
      hos_state,
      hos_pincode,
      hos_latitude,
      hos_longitude,
      hos_specialities,
      hos_username,
      hos_password: hashedPassword,
      hos_about,
      hos_opening_hours,
    });

    const { hos_password: _, ...hospitalData } = newHospital.toJSON();

    const token = jwt.sign(hospitalData, SECRET_KEY, { expiresIn: "1d" });

    return res.status(201).json({
      message: "Hospital registered successfully",
      token,
      hospital: hospitalData,
    });
  } catch (err) {
    console.error("❌ Error in registerHospital:", err);
    if (err instanceof UniqueConstraintError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    if (err instanceof ValidationError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login New Hospital

export const loginHospital = async (req, res) => {
  try {
    const { identifier, hos_password } = req.body;

    if (!identifier || !hos_password) {
      return res
        .status(400)
        .json({ message: "Email/Mobile/Username and password required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const mobileRegex = /^\d{10}$/;

    let whereCondition = {};

    if (emailRegex.test(identifier)) {
      whereCondition = { hos_email: identifier };
    } else if (mobileRegex.test(identifier)) {
      whereCondition = { hos_mobile: identifier };
    } else {
      whereCondition = { hos_username: identifier };
    }

    const hospital = await Hospital.findOne({ where: whereCondition });

    if (!hospital) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(hos_password, hospital.hos_password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { hos_password: _, ...hospitalData } = hospital.toJSON();

    const token = jwt.sign(
      {
        id: hospital.id,
        hos_username: hospital.hos_username,
        role: "hospital",
      },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      hospital: hospitalData,
    });
  } catch (err) {
    console.error("❌ Error in loginHospital:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Get All Hospital

export const getAllHospitals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const hospitals = await Hospital.findAll({
      attributes: { exclude: ["hos_password"] },
      offset: offset,
      limit: limit,
    });

    const totalCount = await Hospital.count();

    return res.status(200).json({
      status: true,
      message: "Hospitals fetched successfully",
      count: hospitals.length,
      totalCount: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      data: hospitals,
    });
  } catch (err) {
    console.error("❌ Error in getAllHospitals:", err);
    if (
      err instanceof UniqueConstraintError ||
      err instanceof ValidationError
    ) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Single Hospital

export const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findByPk(id, {
      attributes: { exclude: ["hos_password"] },
    });

    if (!hospital) {
      return res
        .status(404)
        .json({ status: false, message: "Hospital not found", data: [] });
    }

    return res
      .status(200)
      .json({
        status: true,
        message: "Hospital found successfully",
        data: hospital,
      });
  } catch (err) {
    console.error("❌ Error in registerHospital:", err);

    if (err instanceof UniqueConstraintError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    if (err instanceof ValidationError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Hospital Details

export const updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      hos_name,
      hos_contact_person,
      hos_mobile,
      hos_email,
      hos_website,
      hos_address,
      hos_city,
      hos_state,
      hos_pincode,
      hos_latitude,
      hos_longitude,
      hos_specialities,
      hos_about,
      hos_opening_hours,
    } = req.body;

    const hospital = await Hospital.findByPk(id);

    if (!hospital) {
      return res
        .status(404)
        .json({ status: false, message: "Hospital not found" });
    }

    const hos_logo = req.file ? req.file.filename : hospital.hos_logo;

    await hospital.update({
      hos_name,
      hos_contact_person,
      hos_mobile,
      hos_email,
      hos_logo,
      hos_website,
      hos_address,
      hos_city,
      hos_state,
      hos_pincode,
      hos_latitude,
      hos_longitude,
      hos_specialities,
      hos_about,
      hos_opening_hours,
    });

    const { hos_password, ...updatedData } = hospital.toJSON();

    return res.status(200).json({
      status: true,
      message: "Hospital updated successfully",
      hospital: updatedData,
    });
  } catch (err) {
    console.error("❌ Error in updateHospital:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete hospital

export const deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await Hospital.findByPk(id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    await hospital.destroy();

    return res.status(200).json({ message: "Hospital deleted successfully" });
  } catch (err) {
    console.error("❌ Error in registerHospital:", err);

    if (err instanceof UniqueConstraintError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    if (err instanceof ValidationError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
