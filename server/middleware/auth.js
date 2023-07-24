import ENV from "../config.js";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authentication Error" });
    }

    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);

    req.user = decodedToken;

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication Error" });
  }
};

export const localVariables = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };

  next();
};
