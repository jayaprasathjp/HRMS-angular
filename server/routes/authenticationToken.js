// const { Router } = require("express");
const jwt = require("jsonwebtoken");

const SECRET_KEY =
  "6431b9ef0e2ff183675ac4040a6fb43879e11005e406acb601b4abb50731449904fa5a2e50d715cacb7f8789b55625f9acf1c419a1e6f160e14371194136f978";

 const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;