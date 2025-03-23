const {Router}=require("express");
const jwt = require("jsonwebtoken");
const router=Router();
const fs = require("fs");

const path = require("path");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/data.json"), "utf8"));

const SECRET_KEY ="6431b9ef0e2ff183675ac4040a6fb43879e11005e406acb601b4abb50731449904fa5a2e50d715cacb7f8789b55625f9acf1c419a1e6f160e14371194136f978";

  router.post("/", (req, res) => {
  const { username, password} = req.body;
  if (username !== "hr" || password !== "hr") {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({username, role: "admin"  }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, user: { username: username, password: password } });
});

module.exports = router;