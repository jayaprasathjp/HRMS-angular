const express = require("express");
const jsonServer = require("json-server");
const cors = require("cors");
const fs = require("fs");

const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
// const projectData = JSON.parse(fs.readFileSync("./db/data.json", "utf8"));

// const emp_router = jsonServer.router(require("./db/data.json"));
// const middlewares = jsonServer.defaults();
// app.use(middlewares);
// app.use("/hrms", emp_router);


app.use(require("./routes/index.js"));

app.get("/hrms", (req, res) => {
  res.send("Root HRMS endpoint...");
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
