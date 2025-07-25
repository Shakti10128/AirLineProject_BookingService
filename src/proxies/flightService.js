const { FLIGHT_SERVICE_LOCAL_URL } = require("../config/serverConfig");
const axios = require('axios');

module.exports = {
    updateSeats: async (flightId, flightPayload)=> {
        return await axios.patch(`${FLIGHT_SERVICE_LOCAL_URL}/api/v1/flights/${flightId}`, flightPayload);
    },

    getFlightDetails: async (flightId) => {
        try {
            return await axios.get(`${FLIGHT_SERVICE_LOCAL_URL}/api/v1/flights/${flightId}`);
        } catch (err) {
            console.error(`Failed to get flight [${flightId}]`, err.message);
            throw err; // always rethrow
        }
    },

    rollbackSeats: async(flightId, noOfSeats, add = true) => {
        try {
            const flight = await getFlightDetails(flightId);
            const currentSeats = flight.data.data.totalSeats;
            return await updateSeats(flightId, {
                totalSeats: add
                    ? currentSeats + noOfSeats
                    : currentSeats - noOfSeats
            });
        } catch (error) {
            console.log("Failed to rollback seats");
            throw error;
        }
    }
};
