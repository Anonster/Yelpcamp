//required Packages
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  ejs = require("ejs"),
  methodOverRider = require("method-override"),
  Campground = require("./models/Campground"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/User"),
  Comment = require("./models/Comment");
// Routes
var campgroundRoute = require("./routes/campground"),
  commentRoute = require("./routes/comment"),
  authRoute = require("./routes/index");
//database connection with mongoose
mongoose
  .connect("mongodb://localhost/yelpcamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected To Mongo Db DataBase");
  })
  .catch((err) => {
    console.log("DataBase Connection Error " + err);
  });
// mongoose.set('useCreateIndex', true);
// app.set and use files
app.set("views", "views");
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public"));
app.use(methodOverRider("_method"));
app.use(flash());

//Passport Config
app.use(
  require("express-session")({
    secret: "The world is great",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
//////////////////////
app.use(authRoute);
app.use("/campground", campgroundRoute);
app.use("/campground/:id/comment", commentRoute);
//server Listen
app.listen(3000, function () {
  console.log("Server Has been Started");
});