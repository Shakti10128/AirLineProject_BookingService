const {BookingService} = require("../services/index");
const {StatusCodes} = require('http-status-codes');
const successResponse = require("../utils/successResponse");

const bookingService = new BookingService();

const create = async(req,res,next)=>{
    try {
        const response = await bookingService.createBooking(req.body);   
        return successResponse(res,StatusCodes.CREATED,response,"Flight booked successfully");
    } catch (error) {
        next(error);
    }
}

const getBookingById = async(req,res,next)=>{
    try {
        const id = req.params.id;
        const response = await bookingService.getBookingById(id);
        return successResponse(res,StatusCodes.OK,response,"Booking fetched successfully");
    } catch (error) {
        next(error);
    }
}

const cancelBooking = async(req,res,next)=>{
    try {
        const id = req.params.id;
        const response = await bookingService.cancelBooking(id);
        console.log(response);
        return successResponse(res,StatusCodes.OK,response,"Booking cancelled successfully");
    } catch (error) {
        next(error);
    }
}


module.exports = {
    create,
    getBookingById,
    cancelBooking
}