const {BookingRepository} = require("../repository/index");
const axios = require("axios");
const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");
const {flightRequestUrl} = require('../utils/servicesUrls');
const { sequelize} = require('../models');

class BookingService{
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async #getFlight(flightId){
        try {
            // if flight exist with givenId, it won't throw any error, else it will throw an error
            // if flight not exist in DB, and catch block will catch the error
            let getFlightRequestUrl = flightRequestUrl.getFlightRequestUrl(flightId);
            const flight = await axios.get(getFlightRequestUrl);
            return flight;
        } catch (error) {
            throw error;
        }
    }

    async #updateFlight(flightId,flightPayload){
        try {
            const updateFlightRequestUrl = flightRequestUrl.updateFlightRequestUrl(flightId);
            await axios.patch(updateFlightRequestUrl,{flightPayload});
        } catch (error) {
            throw error;
        }
    }

    async createBooking(data){
        const t = await sequelize.transaction();
        let flightUpdated = false;
        try {
            // STEP:1
            // now get the flight details
            let flightId = data.flightId;
            const flight = await this.#getFlight(flightId);

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
            let status = "Booked";
            const bookingPayload = {...data, totalCost,status};
            const booking = await this.bookingRepository.create(bookingPayload,{ transaction: t });

            
            // STEP:4
            // flight payload for updating the flight
            const flightPayload = {
                totalSeats:flightData.totalSeats - booking.noOfSeats
            }
            await this.#updateFlight(flightId,flightPayload);
            flightUpdated = true;

            // Step 5: Commit transaction
            await t.commit();
            return booking;
        } catch (error) {
            // Step 6: Rollback DB transaction
            await t.rollback(); // ❌ Rollback if anything fails
            
            // Step 7: Manual (rollback seats in flight service)
            if (flightUpdated) {
                try {
                    const flight = await this.#getFlight(data.flightId);
                    const rolledBackSeats = flight.data.data.totalSeats + data.noOfSeats;
                    await this.#updateFlight(data.flightId, { totalSeats: rolledBackSeats });
                    console.log("Rolled back seats in flight service");
                } catch (rollbackErr) {
                    console.error("Failed to rollback flight seat count:", rollbackErr);
                }
            }
            throw error;
        }
    }

    async getBookingById(bookingId){
        try {
            let booking = await this.bookingRepository.get(bookingId);
            // if booking Id is wrong
            if(!booking) {
                throw new AppError(`No booking found with id: ${bookingId}`,StatusCodes.BAD_REQUEST,"BookingId is wrong");
            }
            // else booking found return
            return booking;
        } catch (error) {
            throw error;
        }
    }

    async cancelBooking(bookingId){
        const t = await sequelize.transaction();
        let flightUpdated = false;
        let flightId = null;
        let bookedSeats = null;
        try {
            
            // STEP: 1
            // get the booking first
            let booking = await this.getBookingById(bookingId,{transaction:t});

            if(booking.status === 'Cancelled') {
                throw new AppError("Booking already cancelled",StatusCodes.BAD_REQUEST,"The booking is already cancelled by you");
            }
            flightId = booking.flightId; // store for rollback
            bookedSeats = booking.noOfSeats;

            // STEP: 2
            // update the booking status also
            const status = "Cancelled"
            const updatedBooking  =  await this.bookingRepository.update(
                bookingId,{status},{ transaction: t }
            );

            // STEP: 3
            // fetch the flight and update the available seats
            const flight = await this.#getFlight(booking.flightId);
            const availableSeats = flight.data.data.totalSeats + booking.noOfSeats; 
            const flightPayload = {
                totalSeats: availableSeats
            };
            // calling the flight service to update the seats in flight
            await this.#updateFlight(booking.flightId,flightPayload);
            flightUpdated = true;

            await t.commit();
            return updatedBooking ;
        } catch (error) {
            // Step 4: Rollback DB transaction
            await t.rollback(); // ❌ Rollback if anything fails
            
            // Step 5: Manual (rollback seats in flight service)
            if (flightUpdated) { // if flight updated
                try {
                    console.log(`Rolling back seats: flightId=${flightId}, bookedSeats=${bookedSeats}`);
                    const flight = await this.#getFlight(flightId)
                    const rolledBackSeats = flight.data.data.totalSeats - bookedSeats;
                    await this.#updateFlight(flightId, { totalSeats: rolledBackSeats });
                    console.log("Rolled back seats in flight service");
                } catch (rollbackErr) {
                    console.error("Failed to rollback flight seat count:", rollbackErr);
                }
            }
            throw error;
        }
    }
}

module.exports = BookingService;