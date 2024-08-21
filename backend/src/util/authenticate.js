const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const User = require("../database/user.js");

const authenticate = async (req) => {
  if (req.headers["x-public-route"]) {
    return null;
  }
  const token = req.headers.authorization || "";
  if (!token) {
    throw new AuthenticationError("You must be logged in");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AuthenticationError("Invalid token");
    }
    return user;
  } catch (error) {
    throw new AuthenticationError("Invalid/Expired token");
  }
};

module.exports = authenticate;
