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

module.exports = router;