import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";

const Hospital = sequelize.define("hospital", {
  hos_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  hos_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hos_slug: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  hos_contact_person: {
    type: DataTypes.STRING,
  },
  hos_mobile: {
    type: DataTypes.STRING,
  },
  hos_email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  hos_logo: {
    type: DataTypes.STRING,
  },
  hos_website: {
    type: DataTypes.STRING,
  },
  hos_address: {
    type: DataTypes.TEXT,
  },
  hos_city: {
    type: DataTypes.STRING,
  },
  hos_state: {
    type: DataTypes.STRING,
  },
  hos_pincode: {
    type: DataTypes.STRING,
  },
  hos_latitude: {
    type: DataTypes.STRING,
  },
  hos_longitude: {
    type: DataTypes.STRING,
  },
  hos_specialities: {
    type: DataTypes.TEXT,
  },
  hos_status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active",
  },
  hos_username: {
    type: DataTypes.STRING,
    allowNull: false,

  },
  hos_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hos_about: {
    type: DataTypes.TEXT,
  },
  hos_opening_hours: {
    type: DataTypes.STRING,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: "hospital",      
  timestamps: true,            
  createdAt: 'created_at',     
  updatedAt: 'updated_at',     
  paranoid: true,              
  deletedAt: 'deleted_at',     
});

export default Hospital;
