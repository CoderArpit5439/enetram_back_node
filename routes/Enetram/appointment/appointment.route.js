import express from "express";
import {
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
  getAllAppointments
} from "../../../controller/Enetram/appointment/appointment.controller.js";

const appointmentRouter = express.Router();
import { authenticate } from '../../../middleware/auth.js';

// Create new appointment
appointmentRouter.post("/add-appointment", authenticate, addAppointment);

// Update appointment by ID
appointmentRouter.put("update-appointment/:id",authenticate, updateAppointment);

// Soft delete appointment by ID
appointmentRouter.delete("delete-appointment/:id",authenticate, deleteAppointment);

// Get single appointment by ID
appointmentRouter.get("/get-single-appointment/:id", authenticate,getAppointment);


appointmentRouter.get("/get-all-appointment", authenticate,getAllAppointments);

export default appointmentRouter;
