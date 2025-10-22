import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username should be at least 3 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
  
    phoneNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"],
      unique: true,
    },
    userIDEmployers: {
      type: [String],
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;
