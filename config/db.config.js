// import mongoose from "mongoose";
// import envconfig from "./enviormentconfig.js";

// export const conectDB = async () => {
//   try {
//     await mongoose.connect(envconfig.mongoURL, {
//       dbName: "myProject",
//     });
//     console.log("Data base Conection sussfully");
//   } catch (error) {
//     console.log("Somthing went wrong", error);
//   }
// };
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import envconfig from "./enviormentconfig.js"; 

dotenv.config(); // load .env


export const sequelize = new Sequelize(
  envconfig.db.name,
  envconfig.db.user,
  envconfig.db.password,
  {
    host: envconfig.db.host,
    dialect: "mysql",
    logging: false,
  }
);
