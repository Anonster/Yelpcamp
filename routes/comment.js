var express = require("express");
var middleWare = require("../middleware/index");
var router = express.Router({
    mergeParams: true
});
var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
//new comment route
router.get("/new", middleWare.isLoggedin, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("err");
        } else {
            res.render("Comment/new", {
                campground: campground,
            });
        }
    });
});
//post route for new comment
router.post("/", middleWare.isLoggedin, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!!!");
            res.redirect("/campground");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong!!!");
                    res.redirect("/campground");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added new comment");
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    });
});
//edit comment
router.get("/:comment_id/edit", middleWare.isAuthorizedForComment, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            req.flash("error", "Something went wrong!!!");
            res.redirect("back");
        } else {
            res.render("Comment/edit", {
                campground_id: req.params.id,
                comment: comment
            })
        }
    });
});
//update comment
router.put("/:comment_id/", middleWare.isAuthorizedForComment, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if (err) {
            Console.log(err);
            req.flash("error", "Something went wrong!!!");
            res.redirect("/campground/" + req.params.id);
        } else {
            req.flash("success", "Updated Successfully!");
            res.redirect("/campground/" + req.params.id);
        }
    });
});
//delete comment
router.delete("/:comment_id/", middleWare.isAuthorizedForComment, (req, res) => {
    Comment.findOneAndDelete(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!!!");
            res.redirect("/campground/" + req.params.id);
        } else {
            req.flash("success", "Deleted Successfully!");
            res.redirect("/campground/" + req.params.id);
        }

    });
});
module.exports = router;