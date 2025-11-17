import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import envconfig from "../enviormentconfig.js"; 

dotenv.config(); // load .env


export const myFarmDBConection = new Sequelize(
  envconfig.db.secName,
  envconfig.db.user,
  envconfig.db.password,
  {
    host: envconfig.db.host,
    dialect: "mysql",
    logging: false,
  }
);
