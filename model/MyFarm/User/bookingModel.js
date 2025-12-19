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

    // Who created the booking (admin/user)
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // -------------------------------
    // ✅ Essential Booking Fields
    // -------------------------------

    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    customer_mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    stay_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    booked_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },

    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // -------------------------------
    // ⭐ Highly Recommended CRM Fields
    // -------------------------------

    booking_type: {
      type: DataTypes.ENUM("stay", "day_picnic", "event", "party", "corporate"),
      allowNull: false,
    },

    payment_status: {
      type: DataTypes.ENUM("not_paid", "advance_paid", "paid", "refunded"),
      defaultValue: "not_paid",
      allowNull: false,
    },

    payment_mode: {
      type: DataTypes.ENUM("cash", "upi", "bank", "card"),
      allowNull: true,
    },

    guest_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    package_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    advance_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    booking_source: {
      type: DataTypes.ENUM("website", "phone_call", "whatsapp", "walkin", "instagram", "facebook"),
      allowNull: true,
    },

    special_request: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // -------------------------------
    // 🏡 Rooms / Villas / Cottages Fields
    // -------------------------------

    room_type: {
      type: DataTypes.ENUM("room", "villa", "cottage", "poolside"),
      allowNull: true,
    },

    room_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    extra_services: {
      // List of services in JSON: ["DJ", "Decoration", "BBQ"]
      type: DataTypes.JSON,
      allowNull: true,
    },

    // -------------------------------
    // Optional Customer Details
    // -------------------------------

    customer_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    customer_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
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
