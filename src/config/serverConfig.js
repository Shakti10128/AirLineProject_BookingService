const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    FLIGHT_SERVICE_LOCAL_URL: process.env.FLIGHT_SERVICE_LOCAL_URL,
    AUTH_SERVICE_LOCAL_URL: process.env.AUTH_SERVICE_LOCAL_URL
}