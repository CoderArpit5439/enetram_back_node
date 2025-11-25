import express from "express";
import {
  registerOptical,
  getAllOptical,
  getSingleOptical,
  updateOptical,
  deleteOptical,
} from "../../controller/optical/optical.controller.js";

import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

router.post("/register", registerOptical);

// All routes below require token
router.use(authenticate);

router.get("/get-all", getAllOptical);
router.get("/get/:id", getSingleOptical);
router.put("/update/:id", updateOptical);
router.delete("/delete/:id", deleteOptical);

export default router;
