import { DataTypes } from "sequelize";
import { myFarmDBConection } from "../../../config/myFarm/mydb.js";

const myFarmHouseModel = myFarmDBConection.define(
  "myfarmhouse",
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

    farm_house_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    map_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    whatsapp_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contact_person_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    contact_person_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    upload_media: {
      type: DataTypes.JSON, 
      allowNull: true,
    },

    details_about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    home_rules: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    policy: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    total_rooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    area_size: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    price_day_weekdays: {
      type: DataTypes.FLOAT, // Mon - Thurs
      allowNull: true,
    },

    price_day_weekend: {
      type: DataTypes.FLOAT, // Fri - Sun
      allowNull: true,
    },

    same_day_booking_weekdays: {
      type: DataTypes.FLOAT, // 6 hrs, Mon - Thurs
      allowNull: true,
    },

    same_day_booking_weekend: {
      type: DataTypes.FLOAT, // 6 hrs, Fri - Sun
      allowNull: true,
    },

    no_of_guest_allowed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    extra_person_charge: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    number_of_extra_person: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    advance_payment_percentage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    with_stay_in: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    with_stay_out: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    without_stay_in: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    without_stay_out: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    room_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    law_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    pool_details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    facebook_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    instagram_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    twitter_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },

  {
    tableName: "myfarmhouse",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  }
);

export default myFarmHouseModel;
