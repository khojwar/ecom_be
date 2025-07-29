
const express = require('express');
require('./mongodb.config.js')

const authServ = require('../modules/auth/auth.service.js');

// -------------------------------------------
// connect to SQL database
const { authenticateSql } = require('./sql.config.js');
authenticateSql()
  .then(() => console.log("SQL Database connected successfully"))
  .catch((error) => console.error("SQL Database connection failed:", error));

  // -------------------------------------------


const router = require("./router.config.js");
const { deleteFile } = require('../utilities/helper.js');

const EventEmitter = require('events');

const myEvent = new EventEmitter();
// trigger
// listen (consume)


const app = express(); // create an express application 

// event listen
myEvent.on("sendWelcomeNotification", async (user) => {
    await authServ.sendActivationNotification(user);
});

app.use((req, res, next) => {
    req.myEvent = myEvent; // attach the event emitter to the request object
    next(); // call the next middleware
})

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

    if (err.name === "multerError") {
        /**
         *   LIMIT_PART_COUNT: 'Too many parts',
            LIMIT_FILE_SIZE: 'File too large',
            LIMIT_FILE_COUNT: 'Too many files',
            LIMIT_FIELD_KEY: 'Field name too long',
            LIMIT_FIELD_VALUE: 'Field value too long',
            LIMIT_FIELD_COUNT: 'Too many fields',
            LIMIT_UNEXPECTED_FILE: 'Unexpected field',
            MISSING_FIELD_NAME: 'Field name missing'
         */

        code = 422;
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