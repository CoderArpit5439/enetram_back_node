import express from "express";
import { authenticate } from "../../../middleware/auth.js";

import {
  createBankDetails,
  updateBankDetails,
  deleteBankDetails,
  getBankDetailsByUser,
} from "../../../controller/MyFarm/MyFarmUser/BankDetailController.js";

const bankdetailRoutes = express.Router();

bankdetailRoutes.post("/add-details", authenticate, createBankDetails);

bankdetailRoutes.post("/update", authenticate, updateBankDetails);
 
bankdetailRoutes.delete("/delete", authenticate, deleteBankDetails);

bankdetailRoutes.get("/get-detail", authenticate, getBankDetailsByUser);

export default bankdetailRoutes;
