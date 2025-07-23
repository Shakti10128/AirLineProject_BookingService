const { where } = require("sequelize");
const {Booking} = require("../models/index");


class BookingRepository{
    async create(data){
        return await Booking.create(data);
    }

    async update(bookingId,data){
        await Booking.update(data,{
            where:{
                id:bookingId
            }
        });
        return true;
    }
}

module.exports = BookingRepository;