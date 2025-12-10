import adminModel from "../../model/admin/admin.js";
import bcrypt from "bcryptjs";

const registerNewAdmin = async (req, res) => {
  try {
    const { fullName, phoneNumber, userIDEmployers, email, password } = req.body;


    const requiredFields = { fullName, phoneNumber, userIDEmployers, email, password };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "You already have admin access. Please proceed to log in.",
        data: [],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new adminModel({
      fullName,
      phoneNumber,
      userIDEmployers,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const userToReturn = {
      _id: savedUser._id,
      fullName: savedUser.fullName,
      phoneNumber: savedUser.phoneNumber,
      userIDEmployers: savedUser.userIDEmployers,
      email: savedUser.email,
    };

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
      admin: userToReturn,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering admin.",
    });
  }
};

export default registerNewAdmin;
