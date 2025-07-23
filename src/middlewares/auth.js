
// middlewares/auth.js
const axios = require("axios");
const {userServiceUrls} = require("../utils/servicesUrls");
const { AppError} = require("../utils/index");
const { StatusCodes } = require("http-status-codes");

const authenticate = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return next(new AppError("Token is missing", StatusCodes.UNAUTHORIZED));
  }

  try {
    const userAuthenitcateReqUrl = userServiceUrls.getUserAuthenitcateReqUrl();
    const response = await axios.get(userAuthenitcateReqUrl, {
      headers: {
        "x-access-token": token,
      },
    });
    req.userId = response.data.data; // auth service returns userId in data
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;
