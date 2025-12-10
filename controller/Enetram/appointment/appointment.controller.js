import appointment from "../../../model/Enetram/Appointment/appointment.model.js";
import { Op } from "sequelize";

// Validation function returning per-field status and message
const validateAppointmentData = (data) => {
  const validation = {
    ap_name: { status: true, message: "" },
    ap_number: { status: true, message: "" },
    ap_address: { status: true, message: "" },
    ap_hospital: { status: true, message: "" },
    ap_date: { status: true, message: "" },
    ap_slot: { status: true, message: "" },
  };

  if (!data.ap_name || data.ap_name.trim() === "") {
    validation.ap_name = { status: false, message: "Appointment name is required." };
  }

  if (!data.ap_number || !/^\d{10}$/.test(data.ap_number)) {
    validation.ap_number = { status: false, message: "Valid 10-digit appointment number is required." };
  }

  if (!data.ap_address || data.ap_address.trim() === "") {
    validation.ap_address = { status: false, message: "Appointment address is required." };
  }

  if (!data.ap_hospital || data.ap_hospital.trim() === "") {
    validation.ap_hospital = { status: false, message: "Hospital name is required." };
  }

  if (!data.ap_date || isNaN(Date.parse(data.ap_date))) {
    validation.ap_date = { status: false, message: "Valid appointment date is required." };
  }

  if (!data.ap_slot || data.ap_slot.trim() === "") {
    validation.ap_slot = { status: false, message: "Appointment slot is required." };
  }

  return validation;
};

// Add Appointment
export const addAppointment = async (req, res) => {
  try {
    const validationResult = validateAppointmentData(req.body);
    const hasErrors = Object.values(validationResult).some(field => field.status === false);

    if (hasErrors) {
      return res.status(400).json({ success: false, validation: validationResult });
    }

    const { ap_number } = req.body;

    const existingAppointment = await appointment.findOne({ where: { ap_number } });

    if (existingAppointment) {
      if (existingAppointment.status == "active") {
        return res.status(409).json({ success: false, message: "Appointment already exists" });
      }
   
    }

    const newAppointment = await appointment.create(req.body);

    res.status(201).json({
      success: true,
      message: "Appointment added successfully",
      data: newAppointment,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add appointment",
      error: error.message,
    });
  }
};


// Update Appointment
export const updateAppointment = async (req, res) => {
  try {
    const validationResult = validateAppointmentData(req.body);
    const hasErrors = Object.values(validationResult).some(field => field.status === false);

    if (hasErrors) {
      return res.status(400).json({ success: false, validation: validationResult });
    }

    const { id } = req.params;
    const updated = await appointment.update(req.body, { where: { ap_id: id } });

    if (updated[0] === 0) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: "Appointment updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update appointment", error: error.message });
  }
};

// Delete Appointment (Soft Delete)
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await appointment.destroy({ where: { ap_id: id } });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete appointment", error: error.message });
  }
};

// Get Single Appointment
export const getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await appointment.findOne({ where: { ap_id: id } });

    if (!data) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch appointment", error: error.message });
  }
};

// Get All Appointments 
export const getAllAppointments = async (req, res) => {
  try {
    let { page, limit, search } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    

    const whereClause = search
      ? {
          ap_name: {
            [Op.like]: `%${search}%`,
          },
        }
      : {};

    const { rows, count } = await appointment.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['ap_date', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch appointments", error: error.message });
  }
};
