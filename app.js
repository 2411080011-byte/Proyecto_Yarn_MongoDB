const express = require("express");
const {API_VERSION} = require("./constante");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//configuracion
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(express.static("uploads"));

//Configurar HTTP
app.use(cors());

//Importar routings
const authRoutes = require("./router/auth");

//Cofiguración routings
app.use(`/api/${API_VERSION}`, authRoutes)

module.exports = app;