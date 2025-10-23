// import { configDotenv } from "dotenv";
// configDotenv();
// const Enviorment = process.env.Node_Enviorment;

// const envconfig = {
//   mongoURL:
//     Enviorment === "production"
//       ? process.env.Mongo_Url_Prd
//       : process.env.Mongo_Url_Dev,
//   port:
//     Enviorment === "production" ? process.env.PORT_Prd : process.env.PORT_Dev,
//   JWT_token:
//     Enviorment === "production"
//       ? process.env.Prd_jwt_secret_key
//       : process.env.Dev_jwt_secret_key,
// };

// export default envconfig;

// config/enviormentconfig.js
import dotenv from 'dotenv';
dotenv.config(); 

const isProd = process.env.NODE_ENV === 'production';

const envconfig = {
  env: process.env.NODE_ENV || 'development',
  port: isProd ? process.env.PORT_PROD : process.env.PORT_DEV,

  db: {
   // host: isProd ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV,
   // user: isProd ? process.env.DB_USER_PROD : process.env.DB_USER_DEV,
   // password: isProd ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_DEV,
   // name: isProd ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV

    host: process.env.DB_HOST_PROD,
    user: process.env.DB_USER_PROD,
    password: process.env.DB_PASSWORD_PROD,
    name: process.env.DB_NAME_PROD
  }
};

export default envconfig;

