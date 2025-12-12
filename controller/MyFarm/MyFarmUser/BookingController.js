import jwt from "jsonwebtoken";
import Booking from "../../../model/MyFarm/User/bookingModel.js";


export const createBooking = async (req, res) => {
  try {
   
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1].trim();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user_id = decoded.user.id;

    // --------------------------
    // 📌 Extract Fields
    // --------------------------
    const {
      // Essential
      customer_name,
      customer_mobile,
      stay_date,
      booked_on,
      status,
      action,

      // CRM Recommended
      booking_type,
      payment_status,
      payment_mode,
      guest_count,
      package_name,
      price,
      advance_amount,
      booking_source,
      special_request,

      // Rooms / Villas
      room_type,
      room_number,
      extra_services,

      // Optional customer details
      customer_email,
      customer_address,
      remarks,
    } = req.body;

    // --------------------------
    // ✔ Validate Required Fields
    // --------------------------
    if (!customer_name || !customer_mobile || !stay_date || !booking_type) {
      return res.status(400).json({
        success: false,
        message: "customer_name, customer_mobile, stay_date & booking_type are required",
      });
    }

    // --------------------------
    // 🛠 Create Booking
    // --------------------------
    const newBooking = await Booking.create({
      user_id,

      // Essential
      customer_name,
      customer_mobile,
      stay_date,
      booked_on: booked_on || new Date(),
      status,
      action,

      // CRM fields
      booking_type,
      payment_status,
      payment_mode,
      guest_count,
      package_name,
      price,
      advance_amount,
      booking_source,
      special_request,

      // Rooms
      room_type,
      room_number,
      extra_services,

      // Optional
      customer_email,
      customer_address,
      remarks,
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

    const booking = await Booking.findOne({
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

    const token = authHeader.split(" ")[1].trim();

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
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

    // Search by customer name
    if (search) {
      whereCondition.customer_name = { [Op.like]: `%${search}%` };
    }

    // Filter by status
    if (status) {
      whereCondition.status = status;
    }

    const { count, rows } = await Booking.findAndCountAll({
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
