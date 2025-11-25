import express from "express";
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} from "../../../controller/Enetram/inquiry/inquiry.controller.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/create-inquiry", createInquiry);
inquiryRouter.get("/get-all-inquiry", getAllInquiries);
inquiryRouter.get("/get-single-inquiry/:id", getInquiryById);
inquiryRouter.put("/update-inquiry/:id", updateInquiry);
inquiryRouter.delete("/delete-inquiry/:id", deleteInquiry);

export default inquiryRouter;
