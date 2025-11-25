import express from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/db.config.js";
import hospitalRoutes from "./routes/Enetram/hospital/hospital.routes.js";
import patientRoutes from "./routes/Enetram/patient/patient.route.js";
import inquiryRouter from "./routes/Enetram/inquiry/inquiry.route.js";
import appointment from "./routes/Enetram/appointment/appointment.route.js";
import enetramLogin from "./routes/Enetram/auth/login.route.js";
import https from "https";
import cors from "cors";
import fs from "fs";
import path from "path";
import {dirname} from "path";
import {fileURLToPath} from "url";
import myFarmUserRoutes from "./routes/MyFarm/myFarmUser/myFarmUserRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


var options = {
 //  key: fs.readFileSync('/etc/letsencrypt/live/nodeapi.enetram.com/privkey.pem'),
 //  cert: fs.readFileSync('/etc/letsencrypt/live/nodeapi.enetram.com/fullchain.pe>
  key: fs.readFileSync(path.join(__dirname, '/ssl/privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '/ssl/fullchain.pem')),
  //  requestCert: false,
  rejectUnauthorized: false
};


const server = https.createServer(options,app);

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("✅ All models synced with the database");
//   })
//   .catch((err) => {
//     console.error("❌ Error syncing models:", err);
//   });

//  hospital routes
app.use("/api/hospitals", hospitalRoutes);

//  patient routes
app.use("/api/patients", patientRoutes);

//  inquiry routes
app.use("/api/inquiry",inquiryRouter);

// appointment routes

app.use("/api/appointment",appointment)

// login

app.use("/api/enetram-login",enetramLogin)

app.use("/api",myFarmUserRoutes)

const PORT = process.env.PORT_DEV || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
