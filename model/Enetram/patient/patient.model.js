import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";

const Patient = sequelize.define(
  "patient",
  {
    ptn_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ptn_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ptn_type: {
      type: DataTypes.ENUM("hospital", "optical"),
      allowNull: false,
    },
    ptn_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ptn_gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },
    ptn_age: {
      type: DataTypes.INTEGER,
    },
    ptn_mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    ptn_email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    ptn_address: {
      type: DataTypes.TEXT,
    },
    ptn_right_eye: {
      type: DataTypes.TEXT,
    },
    ptn_left_eye: {
      type: DataTypes.TEXT,
    },
    ptn_frame: {
      type: DataTypes.STRING,
    },
    ptn_lens: {
      type: DataTypes.STRING,
    },
    ptn_remark: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "patient",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  }
);

export default Patient