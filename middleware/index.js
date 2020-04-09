var Campground = require("../models/Campground");
var Comment = require("../models/Comment");
var middlewareObj = {};
//isloggedin middleware
middlewareObj.isLoggedin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You Must Login First');
    res.redirect("/login");
}
//Autheraziation middleware
middlewareObj.isAuthorizedForComment = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                console.log(err);
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission Denied");
                    res.redirect("back");
                }

            }
        });
    } else {
        req.flash("error", "Please Login first to continue");
        res.redirect("back");
    }
}
//Autheraziation middleware
middlewareObj.isAuthorizedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, camp) => {
            if (err) {
                console.log(err);
            } else {
                if (camp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission Denied");
                    res.redirect("back");
                }

            }
        });
    } else {
        req.flash("error", "Please Login first to continue");
        res.redirect("back");
    }
}

module.exports = middlewareObj;