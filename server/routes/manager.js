const {Router}=require("express");
const router=Router();
const fs = require("fs");

const path = require("path");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../db/data.json"), "utf8"));


router.get("/", (req, res) => {
    res.json(data.manager);
  });

module.exports = router;