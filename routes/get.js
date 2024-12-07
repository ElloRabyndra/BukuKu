const express = require("express");
const router = express.Router();
const database = require("../config/database.js");
const { verifyToken } = require("../middleware/verifyToken");
const moment = require("moment-timezone");

function parseResult(result) {
  return Object.values(JSON.parse(JSON.stringify(result)));
}

// Landing and Home Page ---------------------------------------------------------------------------------

// =====================================================================
// Login Page
router.get("/", function (req, res) {
  res.render("index", {message: ""});
});

// =====================================================================
// Register Page
router.get("/register", function (req, res) {
  res.render("register", {message: ""});
});

// =====================================================================
// Home Page
router.get("/home/:userId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql = `SELECT * FROM user WHERE id_user = '${userId}'`;

  database.query(sql, function (error, result) {
    if (error) throw error;

    const user = parseResult(result)[0];
    res.render("home", { user });
  });
});


router.get("/navbar/:userId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql = `SELECT * FROM user WHERE id_user = '${userId}'`;

  database.query(sql, function (error, result) {
    if (error) throw error;

    const user = parseResult(result)[0];
    res.render("navbar", { user });
  });
});

module.exports = router;
