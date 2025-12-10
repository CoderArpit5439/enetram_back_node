import express from "express";
import {
  farmUserLogin,
  farmUserRegister,
  fetchSingleUser,
  sendResetPasswordRequest,
  updateUserDetails,
  verifyOtp,
  verifyOtpforResetPasword,
} from "../../../controller/MyFarm/MyFarmUser/MyFarmUserController.js";

const myFarmUserRoutes = express.Router();

myFarmUserRoutes.post("/register-user", farmUserRegister);
myFarmUserRoutes.post("/otp-verify", verifyOtp);
myFarmUserRoutes.get("/single-user/:id", fetchSingleUser);
myFarmUserRoutes.post("/login", farmUserLogin);
myFarmUserRoutes.post("/reset-password-request", sendResetPasswordRequest);
myFarmUserRoutes.post("/reset-password-with-otp", verifyOtpforResetPasword);
myFarmUserRoutes.post("/edit-user",updateUserDetails)
export default myFarmUserRoutes;
