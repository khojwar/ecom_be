
const express = require('express');
require('./mongodb.config.js')
const router = require("./router.config.js");
const { deleteFile } = require('../utilities/helper.js');


const app = express(); // create an express application 

// app.use((req, res, next) => {
//     console.log("I am always executable");

//     req.user = "Tikaram"
    
//     next() // without any argument => call next middleware
// })


// app.use((req, res, next) => {
//     console.log("I am second middleware");

//     next()
// })


// parser 
   // json, urlencoded, multipart/form-data

app.use(express.json({
    limit: "10mb",
})) 

app.use(express.urlencoded({
    extended: true,
    limit: "10mb",
}))



// router mount
// http://localhost:3000/api/v1/abc

app.use("/api/v1/", router)
// app.use("/api/v2/", router)


// 404 route handler
app.use((req, res, next) => {
    next({
        code: 404,
        message: "Resource not found",
        status: "NOT_FOUND"
    })
})


// TODO: Error handling middleware  --> (200 status code bahek-ko sabai error haru handle garne)
app.use((err, req, res, next) => {
    let code = err.code || 500
    let detail = err.detail || null
    let message = err.message || "Internal server error"
    let status = err.status || "SERVER_ERROR"

    // TODO: Refactoring

    // single file upload and error comes then delete the file
    if (req.file) {
        deleteFile(req.file.path)
    } else if (req.files) {
        // multiple file upload and error comes then delete the files
        req.files.forEach(file => {
            deleteFile(file.path)
        })
    }
    
    if (err.name === "MongoServerError") {
        if (+err.code === 11000) {
            code = 400
            message = "Validation Failed"
            status = "VALIDATION_FAILED"

            detail = {}

            Object.keys(err.keyValue).map((key) => {
                detail[key] = `${key} already exists`
            })
        }
    }

    res.status(code).json({
        error: detail,
        message: message,
        status: status,
        options: null,
    })
})

// mount this server on listen from server
module.exports = app

// module.exports = app; // export the express application