const { AUTH_SERVICE_LOCAL_URL, FLIGHT_SERVICE_LOCAL_URL } = require("../config/serverConfig");


const userServiceUrls = {
    getUserReqUrl:(userId)=>{
        return `${AUTH_SERVICE_LOCAL_URL}/api/v1/users/${userId}`;
    },
    getUserAuthenitcateReqUrl:()=>{
        return `${AUTH_SERVICE_LOCAL_URL}/api/v1/users/isauthenticated`;
    }
}


const flightRequestUrl = {
    getFlightRequestUrl:(flightId)=>{
        return `${FLIGHT_SERVICE_LOCAL_URL}/api/v1/flights/${flightId}`;
    },
    updateFlightRequestUrl:(flightId)=>{
        return `${FLIGHT_SERVICE_LOCAL_URL}/api/v1/flights/${flightId}`;
    }
}

module.exports = {
    userServiceUrls,
    flightRequestUrl
}