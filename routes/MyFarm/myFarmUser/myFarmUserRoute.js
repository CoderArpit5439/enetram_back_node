import express from 'express';
import { farmUserRegister, verifyOtp } from '../../../controller/MyFarm/MyFarmUser/MyFarmUserController.js';

const myFarmUserRoutes = express.Router();

myFarmUserRoutes.post("/register-user", farmUserRegister);
myFarmUserRoutes.post("/otp-verify",verifyOtp);

export default myFarmUserRoutes;
