// model/optical/optical.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";

const Optical = sequelize.define("optical", {
  opt_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  opt_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  opt_owner_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  opt_mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  opt_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  opt_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opt_username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  opt_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  opt_status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1, // 1 = active, 0 = inactive
  },
  opt_logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opt_city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opt_state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opt_pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opt_latitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opt_longitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opt_specialities: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  opt_remark: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  opt_slug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  opt_about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true, 
  deletedAt: "deleted_at"
});

export default Optical;
