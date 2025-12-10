import bankDetailModel from "../../../model/MyFarm/User/bankDetailModel.js";
import jwt from "jsonwebtoken";

export const createBankDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const otpToken = authHeader.split(" ")[1].trim(); 

    const { bankName, accountNumber, IFSCCode, upiId } = req.body;

    if (!bankName) {
      return res.status(400).json({
        success: false,
        message: "Please provide bank name",
      });
    } else if (!accountNumber) {
      return res.status(400).json({
        success: false,
        message: "Account number is required",
      });
    } else if (!IFSCCode) {
      return res.status(400).json({
        success: false,
        message: "IFSC code is required",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    const user_id = decoded.user.id;
    const newData = await bankDetailModel.create({
      user_id,
      bankName,
      accountNumber,
      IFSCCode,
      upiId,
    });

    return res.status(201).json({
      success: true,
      message: "Bank details added successfully",
      data: newData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while processing your request.",
      error:error.message
    });
  }
};

export const updateBankDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const otpToken = authHeader.split(" ")[1].trim(); 

    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET); 
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user_id = decoded.user.id;


    const { bankName, accountNumber, IFSCCode, upiId } = req.body;

    if (!bankName && !accountNumber && !IFSCCode && !upiId) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (bankName, accountNumber, IFSCCode, upiId) is required to update.",
      });
    }


    const details = await bankDetailModel.findOne({ where: { user_id } });

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found for this user",
      });
    }


    await details.update(req.body);


    return res.json({
      success: true,
      message: "Bank details updated successfully",
      data: details,
    });
  } catch (error) {
    console.error("Error updating bank details:", error); 
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating bank details.",
    });
  }
};

export const deleteBankDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }
    const otpToken = authHeader.split(" ")[1].trim();
    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user_id = decoded.user.id;
    const details = await bankDetailModel.findOne({ where: { user_id } });

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found",
      });
    }

    await details.destroy();

    res.json({
      success: true,
      message: "Bank details deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export const getBankDetailsByUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }
    const otpToken = authHeader.split(" ")[1].trim();
    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user_id = decoded.user.id;
    const details = await bankDetailModel.findOne({ where: { user_id } });

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found",
      });
    }

    res.json({
      success: true,
      data: details,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
