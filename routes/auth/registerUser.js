import express from 'express';
import {userRegister ,userRegisterOtpVerify} from '../../controller/auth/user_register.js';
import registerNewAdmin from '../../controller/admin/admin_controller.js';

const route = express.Router();

route.post("/user-register",userRegister);
route.post("/user-otp-verify",userRegisterOtpVerify)
route.post("/admin-register",registerNewAdmin)

export default route