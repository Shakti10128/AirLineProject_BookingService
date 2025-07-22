const {Booking} = require("../models/index");


class BookingRepository{
    async create(data){
        return await Booking.create(data);
    }
}

module.exports = BookingRepository;