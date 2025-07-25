const express = require('express');
const {BookingController} = require("../../controllers/index");
const {BookingMiddleware,AuthenticateUser} = require("../../middlewares/index")

const router = express.Router();

router.post("/bookings",
    BookingMiddleware.validateBookingCreateReq,
    AuthenticateUser,
    BookingController.create);

router.get('/bookings/:id',AuthenticateUser,BookingController.getBookingById);
router.patch('/bookings/cancelbooking/:id',AuthenticateUser,BookingController.cancelBooking);


// GET /bookings?status=all      // → Show all bookings
// GET /bookings?status=active   // → Show only confirmed bookings
// GET /bookings?status=cancelled // → Only cancelled
router.get('/bookings',AuthenticateUser,BookingController.getAllBookings);


module.exports = router;