var express = require("express");
var router = express.Router();
var Campground = require("../models/Campground");
var middleWare = require("../middleware/index");
router.get("/", function (req, res) {
    Campground.find({}, function (err, camps) {
        if (err) {
            console.log(err);
        } else {
            //{source defined in ejs : desitination we are passing}
            res.render("Campground/index", {
                camps: camps,
                currentUser: req.user
            });
        }
    });
});
//post campground route
router.post("/", middleWare.isLoggedin, function (req, res) {
    Campground.create({
            name: req.body.name,
            image: req.body.imageurl,
            price: req.body.price,
            description: req.body.description,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        },
        function (err, camps) {
            if (err) {
                console.log(err);
            } else {
                //redirect back to campground route
                res.redirect("/campground");
            }
        }
    );
});
//add new campground route
router.get("/new", middleWare.isLoggedin, function (req, res) {
    res.render("Campground/new");
});
//show champground routes
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec(function (err, campground) {
            if (err) {
                console.log("error found");
            } else {
                res.render("Campground/show", {
                    campground: campground,
                });
            }
        });
});
//edit campgroung route
router.get("/:id/edit", middleWare.isAuthorizedUser, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            res.render("Campground/edit", {
                campground: camp
            });
        }
    });
});

//update campground route
router.put("/:id", middleWare.isAuthorizedUser, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
        if (err) {
            Console.log(err);
            res.redirect("/campground/" + req.params.id);
        } else {
            req.flash("success", "Updated Successfully!");
            res.redirect("/campground/" + req.params.id);
        }
    });
});
//Delete Camp
router.delete("/:id", middleWare.isAuthorizedUser, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wronge!!!");
            res.redirect("/campground");
        }
        req.flash("success", "Deleted Successfully!");
        res.redirect("/campground");
    });
});


module.exports = router;