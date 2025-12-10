import express from 'express';
import { 
  registerPatient, 
  getAllPatient, 
  getSinglePatient, 
  updatePatient, 
  deletePatient 
} from '../../../controller/Enetram/patient/patient.controller.js';

import { authenticate } from '../../../middleware/auth.js';

const router = express.Router();

// Register patient — no token needed
router.post("/register", registerPatient);


router.get("/get-all-patient", authenticate, getAllPatient);

router.get("/get-single-patient/:id", authenticate, getSinglePatient);

router.put("/update-patient/:id", authenticate, updatePatient);

router.delete("/delete-patient/:id", authenticate, deletePatient);

export default router;
