const { AUTH_SERVICE_LOCAL_URL} = require("../config/serverConfig");



module.exports = {
    isUserAuthenticated: async(token)=>{
        try {
            const response = await axios.get(`${AUTH_SERVICE_LOCAL_URL}/api/v1/users/isauthenticated`, {
                headers: {
                    "x-access-token": token,
                },
            });
        return response;
        } catch (error) {
            throw error;
        }
    },


}