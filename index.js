const express = require("express");
const { createDbConnection } = require("./db");
const UserModel = require("./model/User.model");
const server = express();

server.use(express.static("public"));

server.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
server.set("view engine", "ejs");

// use res.render to load up an ejs view file

// index page
server.get("/signin", function (req, res) {
  res.render("pages/index");
});

// signup page
server.get("/createAccount", function (req, res) {
  res.render("pages/signup");
});

// forgotPassword page
server.get("/forgotPassword", function (req, res) {
  res.render("pages/forgotPassword");
});

// confirmRandomString page
server.get("/confirmString", function (req, res) {
  res.render("pages/confirmString");
});

// error page
server.get("/error", function (req, res) {
  const errorMessage = req.query.message || "Something went wrong!!!";
  res.render("pages/error", { message: errorMessage });
});

// reset Password page
server.get("/resetPassword", function (req, res) {
  res.render("pages/resetPassword");
});

// dashboard page
server.get("/dashBoard", function (req, res) {
  res.render("pages/dashboard");
});

// handle Login
server.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (email && password) {
    return res.redirect(`${req.headers["origin"]}/dashBoard`);
  } else {
    return res.redirect(
      `${req.headers["origin"]}/error?message=Something happened while login!!!`
    );
  }
});

// check email password flow
server.post("/checkEmail", (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  if (email) {
    return res.redirect(`${req.headers["origin"]}/confirmString`);
  } else {
    return res.redirect(
      `${req.headers["origin"]}/error?message=Email not found!!!`
    );
  }
});

// check reset password flow
server.post("/checkRandomString", (req, res) => {
  console.log(req.body);
  const { randomString } = req.body;
  if (randomString) {
    return res.redirect(`${req.headers["origin"]}/resetPassword`);
  } else {
    return res.redirect(
      `${req.headers["origin"]}/error?message=String not match !!!`
    );
  }
});

// save password flow
server.post("/savePassword", (req, res) => {
  console.log(req.body);
  const { confirmpassword } = req.body;
  if (confirmpassword) {
    return res.redirect(`${req.headers["origin"]}/signin`);
  } else {
    return res.redirect(
      `${req.headers["origin"]}/error?message=Couldn't save password !!!`
    );
  }
});

// signup
server.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const newUser = new UserModel(req.body);
    const result = await newUser.save();
    if (result) {
      return res.redirect(`${req.headers["origin"]}/signin`);
    }
  } catch (error) {
    return res.redirect(
      `${req.headers["origin"]}/error?message=Give all the details !!!`
    );
  }
});

// deploy
// server.listen(10000, "0.0.0.0", () => {
//   console.log("server started !!!");
// });

// local server
server.listen(3000, "localhost", () => {
  console.log("server started !!!");
  createDbConnection();
});
