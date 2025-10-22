// controllers/patientController.jsimport jwt from "jsonwebtoken";
import { Op, UniqueConstraintError, ValidationError } from "sequelize";
import Joi from "joi";
import Patient from "../../../model/Enetram/patient/patient.model.js";
import jwt from "jsonwebtoken";

const SECRET_KEY =  process.env.JWT_SECRET || "AS2565";


const patientSchema = Joi.object({
  ptn_name: Joi.string().required(),
  ptn_type: Joi.string().valid("hospital", "optical").required(),
  ptn_type_id: Joi.number().integer().required(),
  ptn_gender: Joi.string().valid("Male", "Female", "Other").required(),
  ptn_age: Joi.number().integer().optional(),
  ptn_mobile: Joi.string().pattern(/^\d+$/).required(),
  ptn_email: Joi.string().email().required(),
  ptn_address: Joi.string().optional(),
  ptn_right_eye: Joi.string().optional(),
  ptn_left_eye: Joi.string().optional(),
  ptn_frame: Joi.string().optional(),
  ptn_lens: Joi.string().optional(),
  ptn_remark: Joi.string().optional(),
});

export const registerPatient = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = patientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    const {
      ptn_name,
      ptn_type,
      ptn_type_id,
      ptn_gender,
      ptn_age,
      ptn_mobile,
      ptn_email,
      ptn_address,
      ptn_right_eye,
      ptn_left_eye,
      ptn_frame,
      ptn_lens,
      ptn_remark,
    } = value;

    const existingPatient = await Patient.findOne({
      where: {
        [Op.or]: [{ ptn_mobile }, { ptn_email }],
      },
    });

    if (existingPatient) {
      return res.status(400).json({
        status: false,
        message: "Patient with this mobile or email already exists",
      });
    }

    // Create new patient
    const newPatient = await Patient.create({
      ptn_name,
      ptn_type,
      ptn_type_id,
      ptn_gender,
      ptn_age,
      ptn_mobile,
      ptn_email,
      ptn_address,
      ptn_right_eye,
      ptn_left_eye,
      ptn_frame,
      ptn_lens,
      ptn_remark,
      role : "patient"
    });
    const patient = newPatient.toJSON();
 
    const token = jwt.sign({ patient,role: "patient"  }, SECRET_KEY, { expiresIn: "1d" });

    return res.status(201).json({
      message: "Patient registered successfully",
      token,
      patient: newPatient,
    });
  } catch (error) {
    if (
      error instanceof UniqueConstraintError ||
      error instanceof ValidationError
    ) {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }

    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get All paitent

export const getAllPatient = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const findAllPatient = await Patient.findAll({
      offset: offset,
      limit: limit,
    });

    const totalCount = await Patient.count();
    return res.status(200).json({
      status: true,
      message: "Patient fetched successfully",
      count: findAllPatient.length,
      totalCount: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      data: findAllPatient,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error,
      data: [],
    });
  }
};

// Get Single Patient 

export const getSinglePatient = async (req,res) => {
  try {

    const {id} = req.params ;
  const findSinglePatient = await Patient.findByPk(id);
  if(!findSinglePatient) {
   return res
        .status(404)
        .json({ status: false, message: "Patient not found", data: [] });
    }
 
       return res
        .status(404)
        .json({ status: true, message: "Patient found successfully", data: findSinglePatient});
    
  } catch (error) {
    return  res.status(500).json({status : false , message: "Internal Server Error" , error : error});

  }
}

// Update Patient

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;


    const schemaForUpdate = patientSchema.fork(Object.keys(patientSchema.describe().keys), field => field.optional());

    const { error, value } = schemaForUpdate.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        status: false,
        message: "Patient not found",
      });
    }

    // Update patient with provided fields
    await patient.update(value);

    return res.status(200).json({
      status: true,
      message: "Patient updated successfully",
      data: patient,
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


// Delete Patient

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        status: false,
        message: "Patient not found",
      });
    }

    await patient.destroy();

    return res.status(200).json({
      status: true,
      message: "Patient deleted successfully",
    });

  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
