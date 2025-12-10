import { DataTypes } from "sequelize";
import { myFarmDBConection } from "../../../config/myFarm/mydb.js";

const bankDetailModel = myFarmDBConection.define(
  "bankDetailModel",
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

    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    accountNumber: {
      type: DataTypes.STRING,
    },

    IFSCCode: {
      type: DataTypes.STRING,
    },

    upiId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    tableName: "bankDetails",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",
  }
);

export default bankDetailModel;
