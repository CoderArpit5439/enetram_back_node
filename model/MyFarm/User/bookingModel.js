import { DataTypes } from "sequelize";
import { myFarmDBConection } from "../../../config/myFarm/mydb.js";

const Booking = myFarmDBConection.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,

    },

    customer: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    booked_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    stay_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },

    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "booking",
    timestamps: true,             
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,           
    deletedAt: "deleted_at",
  }
);

export default Booking;
