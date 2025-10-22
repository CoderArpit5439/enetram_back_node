import Optical from "../../../model/Enetram/optical/optical.model.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { Op, UniqueConstraintError, ValidationError } from "sequelize";

const SECRET_KEY = process.env.JWT_SECRET || "AS2565";

// Joi Schema
const opticalSchema = Joi.object({
  opt_name: Joi.string().required(),
  opt_owner_name: Joi.string().required(),
  opt_mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
  opt_email: Joi.string().email().required(),
  opt_address: Joi.string().optional(),
  opt_username: Joi.string().required(),
  opt_password: Joi.string().required(),
  opt_status: Joi.number().valid(0, 1).default(1),
  opt_logo: Joi.string().optional(),
  opt_city: Joi.string().optional(),
  opt_state: Joi.string().optional(),
  opt_pincode: Joi.string().optional(),
  opt_latitude: Joi.string().optional(),
  opt_longitude: Joi.string().optional(),
  opt_specialities: Joi.string().optional(),
  opt_remark: Joi.string().optional(),
  opt_slug: Joi.string().optional(),
  opt_about: Joi.string().optional(),
});

// ✅ Register Optical
export const registerOptical = async (req, res) => {
  try {
    const { error, value } = opticalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        errors: error.details.map((e) => e.message),
      });
    }

    const { opt_email, opt_mobile, opt_username } = value;

    const existing = await Optical.findOne({
      where: {
        [Op.or]: [{ opt_email }, { opt_mobile }, { opt_username }],
      },
    });

    if (existing) {
      return res.status(400).json({
        status: false,
        message: "Email, mobile, or username already exists",
      });
    }

    const newOptical = await Optical.create({ ...value, role: "optical" });

    const payload = { optical: newOptical.toJSON(), role: "optical" };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });

    return res.status(201).json({
      status: true,
      message: "Optical registered successfully",
      token,
      optical: newOptical,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
      });
    }

    console.error("Registration error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// ✅ Get All Optical
export const getAllOptical = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Optical.findAndCountAll({ offset, limit });

    return res.status(200).json({
      status: true,
      message: "Opticals fetched successfully",
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Get Single Optical
export const getSingleOptical = async (req, res) => {
  try {
    const { id } = req.params;
    const optical = await Optical.findByPk(id);

    if (!optical) {
      return res.status(404).json({
        status: false,
        message: "Optical not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Optical found successfully",
      data: optical,
    });
  } catch (error) {
    console.error("Get single error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Update Optical
export const updateOptical = async (req, res) => {
  try {
    const { id } = req.params;

    const schemaForUpdate = opticalSchema.fork(Object.keys(opticalSchema.describe().keys), (field) =>
      field.optional()
    );
    const { error, value } = schemaForUpdate.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        errors: error.details.map((e) => e.message),
      });
    }

    const optical = await Optical.findByPk(id);

    if (!optical) {
      return res.status(404).json({
        status: false,
        message: "Optical not found",
      });
    }

    await optical.update(value);

    return res.status(200).json({
      status: true,
      message: "Optical updated successfully",
      data: optical,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        errors: error.errors.map((e) => e.message),
      });
    }

    console.error("Update error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ✅ Delete Optical
export const deleteOptical = async (req, res) => {
  try {
    const { id } = req.params;

    const optical = await Optical.findByPk(id);
    if (!optical) {
      return res.status(404).json({
        status: false,
        message: "Optical not found",
      });
    }

    await optical.destroy();

    return res.status(200).json({
      status: true,
      message: "Optical deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
