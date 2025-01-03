const express = require("express");
const cookieParser = require("cookie-parser");

const UserModel = require("./model/User.model");
const NoteModel = require("./model/notes.model");
const {
  fetchAllNotes,
  fetchNoteId,
} = require("./controllers/notes.controller");
const { cookieGuard } = require("./middleware/cookieMiddleware");
const server = express();

server.use(cookieParser());

require("dotenv").config();
const { createDbConnection } = require("./db");
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

// note details page
server.get("/note/:noteId", cookieGuard, async function (req, res) {
  const { noteId } = req.params;
  try {
    const note = await fetchNoteId(noteId);
    res.render("pages/notedetails", {
      note,
    });
  } catch (error) {
    res.render("pages/error", {
      error: error.message,
    });
  }
});

// dashboard page
server.get("/dashboard", cookieGuard, async function (req, res) {
  try {
    const notes = await fetchAllNotes();
    console.log("notes", notes);
    res.render("pages/dashboard", {
      data: notes,
    });
  } catch (error) {
    res.render("pages/error", {
      error: error.message,
    });
  }
});

// creates note page
server.get("/createnotes", function (req, res) {
  res.render("pages/createnotes");
});

// handle Login
server.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body", req.body);
  try {
    const matchUser = await UserModel.findOne({ email });
    if (matchUser.password === password) {
      res.cookie("auth", { email });
      return res.redirect(`${req.headers["origin"]}/dashboard`);
    } else {
      res.render("pages/error", {
        error: "Bad credentials!!!",
      });
    }
  } catch (error) {
    res.render("pages/error", {
      error: error.message,
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
server.listen(`${process.env.PORT}`, `${process.env.LOCALHOST}`, () => {
  console.log("server started !!!");
  createDbConnection();
});
