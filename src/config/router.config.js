const router = require("express").Router(); // import express router
const authRouter = require("../modules/auth/auth.router.js"); // import auth router


router.get("/", (req, res) => {
    res.json({
        data: null,
        message: "Health ok!",
        status: "success",
        options: null
    })
})

router.use("/auth", authRouter); // mount auth router on /auth path
router.use("/user", userRouter); 
router.use("/brand", brandRouter)
router.use("/product", productRouter);
router.use("/category", categoryRouter);


// router.use("/order", orderRouter);
// router.use("/cart", cartRouter);
// router.use("/address", addressRouter);
// router.use("/payment", paymentRouter);
// router.use("/wishlist", wishlistRouter);
// router.use("/review", reviewRouter);
// router.use("/notification", NotificationRouter);
// router.use("/admin", adminRouter);


module.exports = router; // export the router



// git stash  --> remain only the last change
// git stash pop  --> apply the last change