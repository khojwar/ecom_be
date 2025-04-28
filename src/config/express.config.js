const express = require('express');
const router = require("./router.config.js");


const app = express(); // create an express application




module.exports = app; // export the express application

// router mount
// http://localhost:3000/api/v1/abc

app.use("/api/v1/", router)
// app.use("/api/v2/", router)



// mount this server on listen from server
module.exports = app