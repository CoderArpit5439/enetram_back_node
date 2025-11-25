import express from 'express';
import { farmUserLogin, farmUserRegister, fetchSingleUser, verifyOtp } from '../../../controller/MyFarm/MyFarmUser/MyFarmUserController.js';

const myFarmUserRoutes = express.Router();

myFarmUserRoutes.post("/register-user", farmUserRegister);
myFarmUserRoutes.post("/otp-verify",verifyOtp);
myFarmUserRoutes.get('/single-user/:id', fetchSingleUser);
myFarmUserRoutes.post('/login', farmUserLogin)
export default myFarmUserRoutes;
