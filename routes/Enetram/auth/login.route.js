import express from 'express';
import { loginUser } from '../../../controller/Enetram/auth/enetram.auth.js'; 

const enetramLogin = express.Router();

// POST route to add a new appointment
enetramLogin.post('/', loginUser);

export default enetramLogin;
