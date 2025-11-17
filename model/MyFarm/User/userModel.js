import { DataTypes } from "sequelize";
import { myFarmDBConection } from "../../../config/myFarm/mydb.js";

const myFarmUser = myFarmDBConection.define(
  "myFarmUser",
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
    tableName: "myFarmUser",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    paranoid: true,
    deletedAt: "deleted_at",
  }
);

export default myFarmUser;
