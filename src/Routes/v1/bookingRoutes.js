const express = require('express');
const {BookingController} = require("../../controllers/index");
const {BookingMiddleware,AuthenticateUser} = require("../../middlewares/index")

const router = express.Router();

router.post("/bookings",
    BookingMiddleware.validateBookingCreateReq,
    AuthenticateUser,
    BookingController.create);

module.exports = router;