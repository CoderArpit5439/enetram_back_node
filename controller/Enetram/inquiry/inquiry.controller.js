import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UniqueConstraintError, ValidationError } from "sequelize";
import Inquiry from "../../../model/Enetram/inquiry/inquiry.model.js";


// Create Inquiry
export const createInquiry = async (req, res) => {
  try {
    const {
      inq_name,
      inq_number,
      inq_type,
      inq_age,
      inq_gender,
      inq_location,
      inq_remark,
      inq_source,
    } = req.body;

    if (!inq_name || !inq_number) {
      return res.status(400).json({ message: "Name and Number are required" });
    }

    const newInquiry = await Inquiry.create({
      inq_name,
      inq_number,
      inq_type,
      inq_age,
      inq_gender,
      inq_location,
      inq_remark,
      inq_source,
      
    });

    return res.status(201).json({
      status: true,
      message: "Inquiry created successfully",
      data: newInquiry,
    });
  } catch (err) {
    console.error("❌ Error in createInquiry:", err);

    if (err instanceof UniqueConstraintError || err instanceof ValidationError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({ message: "Validation error", errors: messages });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All Inquiries (Paginated)
export const getAllInquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const inquiries = await Inquiry.findAll({ offset, limit });
    const totalCount = await Inquiry.count();

    return res.status(200).json({
      status: true,
      message: "Inquiries fetched successfully",
      count: inquiries.length,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      data: inquiries,
    });
  } catch (err) {
    console.error("❌ Error in getAllInquiries:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Inquiry By ID
export const getInquiryById = async (req, res) => {
  try {
    const id = Number(req.params.id); // string से number में convert किया
    console.log("Requested ID:", id);

    const inquiry = await Inquiry.findOne({ where: { inq_id: id } });

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found", data: [] });
    }

    return res.status(200).json({
      status: true,
      message: "Inquiry found successfully",
      data: inquiry,
    });
  } catch (err) {
    console.error("❌ Error in getInquiryById:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Update Inquiry
export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      inq_name,
      inq_number,
      inq_type,
      inq_age,
      inq_gender,
      inq_location,
      inq_remark,
      inq_source,
    } = req.body;

    const inquiry = await Inquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    await inquiry.update({
      inq_name,
      inq_number,
      inq_type,
      inq_age,
      inq_gender,
      inq_location,
      inq_remark,
      inq_source,
      updated_at: new Date(),
    });

    return res.status(200).json({
      status: true,
      message: "Inquiry updated successfully",
      data: inquiry,
    });
  } catch (err) {
    console.error("❌ Error in updateInquiry:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    await inquiry.destroy();

    return res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteInquiry:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
