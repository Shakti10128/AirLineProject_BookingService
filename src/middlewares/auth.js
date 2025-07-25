
// middlewares/auth.js
const axios = require("axios");
const { AppError} = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const {userService} = require("../proxies/index");

const authenticate = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return next(new AppError("Token is missing", StatusCodes.UNAUTHORIZED));
  }

  try {
    const response = await userService.isUserAuthenticated(token);
    req.userId = response.data.data; // axios returns userId in data:{data:userId,message:""}
    if (!userId) {
      throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
    req.userId = userId;
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;
