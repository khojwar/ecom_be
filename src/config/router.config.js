const router = require("express").Router(); // import express router


router.get("/", (req, res) => {
    res.json({
        data: null,
        message: "Health ok!",
        status: "success",
        options: null
    })
})


// ------------- Auth module -----------------------

/**
 * Task:
 * Build atleast the following routes:
 ** Auth and authentication
 * - register
 * - activate
 * - login done
 * - forget password request
 * - token verify for forget password
 * - password reset router
 * - password User get profile
 * - logout
 * - user update
 * 
 */


 router.post("/register", (req, res) => {

    res.status(200).json({
        data: null,
        message: "You are register",
        status: "Success",
        options: null,
    })
 })

 // router.post("/activate/:token", (req, res) => {
router.get("/activate/:token", (req, res) => {
    console.log(req.params);
    
    // const {token} = req.params;    OR
    const token = req.params.token; 
    // console.log(token);

    let params = req.params;
    const header = req.headers;
    const query = req.query;
    

    res.status(200).json({
        // data: token,
        data: {
            params,
            header,
            query
        },
        message: "User activated successfully",
        status: "success",
        options: null 
    })
});

router.post("/login", (req, res, next) => {
    res.status(200).json({
        data: null,
        message: "You are loggedIn",
        status: "Success",
        options: null,
    })
})

router.post("/forget-password", (req, res, next) => {
    res.status(200).json({
        data: null,
        message: "forget password route",
        status: "Success",
        options: null,
    })
})

router.get("/forget-password-verify/:token", (req, res, next) => {
    const token = req.params.token;

    res.status(200).json({
        data: token,
        message: "You are loggedIn",
        status: "Success",
        options: null,
    })
})

router.put("/reset-password", (req, res, next) => {
    res.status(200).json({
        data: null,
        message: "reset password route",
        status: "Success",
        options: null,
    })
})

router.get("me", (req, res, next) => {
    res.status(200).json({
        data: null,
        message: "Me route",
        status: "Success",
        options: null,
    })
})

router.get("/logout", (req, res, next) => {
    res.status(200).json({
        data: null,
        message: "You are LoggedIn",
        status: "Success",
        options: null,
    })
})

router.put("/user/:id", (req, res, next) => {

    res.status(200).json({
        data: req.params.id,
        message: "Update user Router",
        status: "Success",
        options: null,
    })
})



// Watched till: 35 min       (date: Apr 23, 2025 )



module.exports = router; // export the router



// git stash  --> remain only the last change
// git stash pop  --> apply the last change