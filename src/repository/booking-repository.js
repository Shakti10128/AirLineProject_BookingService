const { where,Op } = require("sequelize");
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

    async getAll(userId,status){
        let whereClause = {userId};
        if (status === 'active') {
            whereClause.status = { [Op.ne]: 'Cancelled' };
        } 
        else if (status === 'cancelled') {
            whereClause.status = 'Cancelled';
        }
        const bookings = await Booking.findAll({ where: whereClause });
        return bookings;
    }
}

module.exports = BookingRepository;