import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "AS2565";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({status:false , message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({status : false , message: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(400).json({status : false ,message: "Invalid token." , err });
  }
};
