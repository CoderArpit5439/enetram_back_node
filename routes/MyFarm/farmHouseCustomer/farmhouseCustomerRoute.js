import express from "express";
import {
  farmCustomerLogin,
  farmCustomerRegister,
  fetchSingleCustomer,
  verifyOtpForCustomer,
} from "../../../controller/MyFarm/FarmHouseCustomer/farmHouseCustomerController.js";

const farmCustomerRoutes = express.Router();

farmCustomerRoutes.post("/register-customer", farmCustomerRegister);
farmCustomerRoutes.post("/otp-verify-for-customer", verifyOtpForCustomer);
farmCustomerRoutes.get("/single-customer/:id", fetchSingleCustomer);
farmCustomerRoutes.post("/login-for-customer", farmCustomerLogin);
export default farmCustomerRoutes;
