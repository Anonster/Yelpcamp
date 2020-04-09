var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");
//index route
router.get("/", function (req, res) {
    res.render("landing");
});
//register get Route
router.get("/register", (req, res) => {
    res.render("register");
});
//register post Route
router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome ${user.username}`)
            res.redirect("/campground");
        });
    });
});
//Login get Route
router.get("/login", (req, res) => {
    res.render("login");
});
//Login post Route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
}), (req, res) => {});

//Logout Route
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "You are SuccessFully LoggedOut!");
    res.redirect('/');
});
module.exports = router;