const express = require('express');
const router = require("./router.config.js");


const app = express(); // create an express application






// router mount
// http://localhost:3000/api/v1/abc

app.use("/api/v1/", router)
// app.use("/api/v2/", router)


// 404 route handler
app.use((req, res, next) => {
    res.status(404).json({
        error: null,
        message: "Resource not found",
        status: "NOT_FOUND",
        options: null,
    })
})



// mount this server on listen from server
module.exports = app

// module.exports = app; // export the express application