"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// logs path + IP address for every request
router.use((req, res, next) => {
    console.log("got a request for/from the following:");
    console.log(req.url);
    console.log(req.ip);
    next();
});
router.get("/", (req, res) => {
    res.render("home");
});
// handle 5XXs
router.use((err, req, res, next) => {
    console.log("error!", err.stack);
    res.status(500).send("Sorry, something went wrong!");
});
// handle 404s - must be last!
router.use((req, res, next) => {
    res.status(404).send("Sorry, we can't find that! Double check your URL");
});
exports.default = router;
