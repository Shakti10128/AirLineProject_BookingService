const express = require('express');

const router = express.Router();

const {bookingRoutes} = require('./v1/index');

router.use("/v1",bookingRoutes);

module.exports = router;