import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";

const inquirymodel = sequelize.define(
  "inquiry",
  {
    inq_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
    },
    inq_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inq_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inq_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inq_age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    inq_gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inq_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inq_remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    inq_source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  
  },
  {
    tableName: "inquiry",
     timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  }
);

export default inquirymodel;
