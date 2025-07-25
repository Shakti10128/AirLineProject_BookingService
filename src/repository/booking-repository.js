const { where } = require("sequelize");
const {Booking} = require("../models/index");


class BookingRepository{
    async create(data){
        return await Booking.create(data);
    }

    async update(bookingId,data,options){
        await Booking.update(data,{
            where:{
                id:bookingId,
            },
            transaction: options.transaction, // ✅ MUST pass transaction here
        });
        return true;
    }

    async get(bookingId) {
        return await Booking.findByPk(bookingId);
    }
}

module.exports = BookingRepository;