import express from "express";
import {
  registerHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} from "../../../controller/Enetram/hospital/hospital.controller.js";

import upload from "../../../config/multerConfig.js"; 
import { authenticate } from "../../../middleware/auth.js"; 

const hospitalRouter = express.Router();

hospitalRouter.post("/register", upload.single("hos_logo"), registerHospital);

hospitalRouter.get("/getAllHospital", getAllHospitals);


hospitalRouter.get("/getSingleHospital/:id", getHospitalById);


hospitalRouter.put("/:id", authenticate, upload.single("hos_logo"), updateHospital);

hospitalRouter.delete("/:id", authenticate, deleteHospital);

export default hospitalRouter;
