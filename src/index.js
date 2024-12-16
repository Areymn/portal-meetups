"use strict";

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//Middlewares
app.use(bodyParser.json());
app.use(cors());

//Rutas base
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

//Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:${PORT}");
});
