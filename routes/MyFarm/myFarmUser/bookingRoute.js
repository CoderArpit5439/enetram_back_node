import express from "express";

import { deleteBooking } from "../../../controller/MyFarm/MyFarmUser/BookingController.js";
import { getSingleBooking } from "../../../controller/MyFarm/MyFarmUser/BookingController.js";
import { getAllBookings } from "../../../controller/MyFarm/MyFarmUser/BookingController.js";
import { updateBooking } from "../../../controller/MyFarm/MyFarmUser/BookingController.js";
import { createBooking } from "../../../controller/MyFarm/MyFarmUser/BookingController.js";

const bookingRoute = express.Router();


bookingRoute.post("/add-new-booking", createBooking);

bookingRoute.post("/edit-booking-detail", updateBooking);

bookingRoute.get("/bookings", getAllBookings);

bookingRoute.get("/booking/:id", getSingleBooking);

bookingRoute.get("/booking/:id", deleteBooking);

export default bookingRoute;
