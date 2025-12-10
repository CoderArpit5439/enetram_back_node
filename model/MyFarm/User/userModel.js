
import { DataTypes } from "sequelize";
import { myFarmDBConection } from "../../../config/myFarm/mydb.js";
import myFarmHouseModel from "../FarmHouse/FarmHouseModel.js";
import bankDetails from "./bankDetailModel.js";
import bankDetailModel from "./bankDetailModel.js";
import Booking from "./bookingModel.js";

const myFarmUser = myFarmDBConection.define(
  "myfarmuser",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    mobileNumber: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    adhar_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    agrement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    tableName: "myfarmuser",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    paranoid: true,
    deletedAt: "deleted_at",
  }
);
myFarmUser.hasMany(myFarmHouseModel, {
  foreignKey: "user_id",
  as: "farmHouse",
  onDelete: "CASCADE",
});

myFarmUser.hasMany(bankDetailModel, {
  foreignKey: "user_id",
  as: "bankdetails",
  onDelete: "CASCADE",
});

myFarmUser.hasMany(Booking, {
  foreignKey: "user_id",
  as: "booking",
  onDelete: "CASCADE",
});

bankDetailModel.belongsTo(myFarmUser, {
  foreignKey: "user_id",
});

myFarmHouseModel.belongsTo(myFarmUser, {
  foreignKey: "user_id",
});

Booking.belongsTo(myFarmUser, {
  foreignKey: "user_id",
});
export default myFarmUser;

