const {BookingRepository} = require("../repository/index");
const axios = require("axios");
const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");
const {flightRequestUrl,userServiceUrls} = require('../utils/servicesUrls');

class BookingService{
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        try {
            // we are already checking either user authencitate or not along with user exist or not
            // in the middleware via calling auth service

            // STEP:1
            // now get the flight details
            let flightId = data.flightId;
            let getFlightRequestUrl = flightRequestUrl.getFlightRequestUrl(flightId)
            
            // if flight exist with givenId, it won't throw any error, else it will throw an error
            // if flight not exist in DB, and catch block will catch the error
            const flight = await axios.get(getFlightRequestUrl);

            // STEP:2
            // axios has data as key in response, also flight sends the data as key in response
            const flightData = flight?.data?.data;
            const priceOfTheFlight = flightData.price;
            // if the noOfSeats not available in the flight 
            if(data.noOfSeats > flightData.totalSeats) {
                throw new AppError("Can not process the request",StatusCodes.INTERNAL_SERVER_ERROR,`Seats ${data.noOfSeats} not available`);
            }


            // STEP:3
            // calculate the total cost 
            const totalCost = priceOfTheFlight * data.noOfSeats;
            // create new payload with existing data
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);

            
            // STEP:4
            // flight payload for updating the flight
            const flightPayload = {
                totalSeats: flightData.totalSeats - booking.noOfSeats
            };
            const updateFlightRequestUrl = flightRequestUrl.updateFlightRequestUrl(flightId);
            await axios.patch(updateFlightRequestUrl,{flightPayload});

            return booking;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}

module.exports = BookingService;