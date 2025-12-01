import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";

const appointment = sequelize.define('appointment', {
  ap_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ap_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ap_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ap_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ap_hospital: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ap_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  ap_slot: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   status: {
    type: DataTypes.STRING,
    defaultValue: "active",
  },
}, {
  tableName: "appointment",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true,
  deletedAt: "deleted_at",
});

export default appointment;
