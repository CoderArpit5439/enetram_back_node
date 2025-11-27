import { DataTypes } from "sequelize";
import { myFarmDBConection } from "../../../config/myFarm/mydb.js";
import myFarmHouseModel from "../FarmHouse/FarmHouseModel.js";

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
  onDelete: "CASCADE",
});

myFarmHouseModel.belongsTo(myFarmUser, {
  foreignKey: "user_id",
});

export default myFarmUser;
