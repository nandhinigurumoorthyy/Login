const express = require("express");
const { createDbConnection } = require("./db");
const UserModel = require("./model/User.model");
const NoteModel = require("./model/notes.model");
const { fetchAllNotes } = require("./controllers/notes.controller");
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
  res.render("pages/error", { error: "Something went wrong !!!" });
});

// reset Password page
server.get("/resetPassword", function (req, res) {
  res.render("pages/resetPassword");
});

// dashboard page
server.get("/dashBoard", async function (req, res) {
  const result = await fetchAllNotes();
  console.log("notes", result);
  res.render("pages/dashboard");
});

// creates note page
server.get("/createnotes", function (req, res) {
  res.render("pages/createnotes");
});

// handle Login
server.post("/login", (req, res) => {
  console.log("req.body", req.body);
  const { email, password } = req.body;
  if (email && password) {
    return res.redirect(`${req.headers["origin"]}/dashBoard`);
  } else {
    res.render("pages/error", {
      error: "Bad credentials!!!",
    });
  }
});

// check email password flow
server.post("/checkEmail", (req, res) => {
  console.log("req.body", req.body);
  const { email } = req.body;
  if (email) {
    return res.redirect(`${req.headers["origin"]}/confirmString`);
  } else {
    res.render("pages/error", {
      error: "Email not found!!",
    });
  }
});

// check reset password flow
server.post("/checkRandomString", (req, res) => {
  console.log("req.body", req.body);
  const { randomString } = req.body;
  if (randomString) {
    return res.redirect(`${req.headers["origin"]}/resetPassword`);
  } else {
    res.render("pages/error", {
      error: error.message,
    });
  }
});

// save password flow
server.post("/savePassword", (req, res) => {
  console.log("req.body", req.body);
  const { confirmpassword } = req.body;
  if (confirmpassword) {
    return res.redirect(`${req.headers["origin"]}/signin`);
  } else {
    res.render("pages/error", {
      error: error.message,
    });
  }
});

// signup
server.post("/signup", async (req, res) => {
  console.log("req.body", req.body);
  try {
    const newUser = new UserModel(req.body);
    const result = await newUser.save();
    if (result) {
      return res.redirect(`${req.headers["origin"]}/signin`);
    }
  } catch (error) {
    res.render("pages/error", {
      error: error.message,
    });
  }
});

// save note
server.post("/savenote", async (req, res) => {
  console.log("req.body", req.body);
  try {
    const newNote = new NoteModel(req.body);
    const result = await newNote.save();
    if (result) {
      return res.redirect(`${req.headers["origin"]}/dashboard`);
    }
  } catch (error) {
    res.render("pages/error", {
      error: error.message,
    });
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
