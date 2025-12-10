import jwt from "jsonwebtoken";
import bookingModel from "../../../model/MyFarm/User/bookingModel.js";

export const createBooking = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const otpToken = authHeader.split(" ")[1].trim();

    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user_id = decoded.user.id;

    const { customer, stay_date, status, action, booked_on } = req.body;

    if (!customer || !stay_date || !status || !action || !booked_on) {
      return res.status(400).json({
        success: false,
        message: "customer, stay_date, status & action are required ",
      });
    }

    const newBooking = await bookingModel.create({
      user_id,
      customer,
      stay_date,
      booked_on,
      status,
      action,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating booking.",
      error: error.message,
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const otpToken = authHeader.split(" ")[1].trim();
    n;
    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user_id = decoded.user.id;

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID required",
      });
    }

    const booking = await bookingModel.findOne({ where: { id, user_id } });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or unauthorized",
      });
    }

    const { customer, stay_date, status, action, booked_on } = req.body;

    if (!customer && !stay_date && !status && !action) {
      return res.status(400).json({
        success: false,
        message: "At least one field required to update",
      });
    }

    // Update
    await booking.update({
      ...(customer && { customer }),
      ...(stay_date && { stay_date }),
      ...(status && { status }),
      ...(action && { action }),
      ...(booked_on && { booked_on }),
    });

    return res.json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating booking.",
      error: error.message,
    });
  }
};

export const getSingleBooking = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const otpToken = authHeader.split(" ")[1].trim();

    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user_id = decoded.user.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID required.",
      });
    }

    const booking = await bookingModel.findOne({
      where: { id, id },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or unauthorized",
      });
    }

    return res.json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching booking.",
      error: error.message,
    });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const otpToken = authHeader.split(" ")[1].trim();

    let decoded;
    try {
      decoded = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user_id = decoded.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const { search, status } = req.query;

    const whereCondition = { user_id };

    if (search) {
      whereCondition.Customer = { [Op.like]: `%${search}%` };
    }

    
    if (status) {
      whereCondition.status = status;  
    }

    const { count, rows } = await bookingModel.findAndCountAll({
      where: whereCondition,
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return res.json({
      success: true,
      message: "Bookings fetched successfully",
      page,
      totalPages: Math.ceil(count / limit),
      totalBookings: count,
      data: rows,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching bookings.",
      error: error.message,
    });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookingModel.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await booking.destroy(); 

    return res.json({
      success: true,
      message: "Booking deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting booking",
      error: error.message,
    });
  }
};
