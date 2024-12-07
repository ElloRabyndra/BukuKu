const express = require("express");
const router = express.Router();
const database = require("../config/database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

function parseResult(result) {
  return Object.values(JSON.parse(JSON.stringify(result)));
}

// =====================================================================
// Register Submit
router.post("/register/submit", async function (req, res) {
  const user = req.body;

  database.query(
    `SELECT * FROM user WHERE username = ?`,
    [user.username],
    async function (error, result) {
      if (error) throw error;

      if (result.length > 0) {
        return res.render("register", {message: "Username Telah Digunakan !"});
      } else if(user.username.length < 5) {
        return res.render("register", {message: "Username Minimal 5 Huruf !"});
      } else if(user.password.length < 5) {
        return res.render("register", {message: "Password Minimal 5 Huruf !"});
      }
       else if (user.password !== user.passwordConfirm) {
        return res.render("register", {message: "Password Konfirmasi Salah !"});
      } else {
        let hashedPassword = await bcrypt.hash(user.password, 10);
        const sql = `INSERT INTO user (username, password) values (?, ?)`;
        database.query(
          sql,
          [user.username, hashedPassword],
          function (error, result) {
            if (error) throw error;
            res.redirect("/");
          }
        );
      }
    }
  );
});

// =====================================================================
// Login Submit
router.post("/login", async function (req, res) {
  const userInput = req.body;
  const sql = `SELECT * FROM user WHERE username = ?`;
  database.query(sql, [userInput.username], async function (error, result) {
    if (error) throw error;

    if (result.length == 0) {
      return res.render("index", {message: "Username Tidak Ditemukan !"});
    } else {
      const user = parseResult(result)[0];
      const valid = await bcrypt.compare(userInput.password, user.password);
      if (!valid) {
        return res.render("index", {message: "Password Salah !"});
      } else {
        // Buat Token
        const token = jwt.sign(
          {
            id: user.id_user,
            username: user.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Set Cookie
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000,
        });
        res.redirect(`/home/${user.id_user}`);
      }
    }
  });
});

// LogOut
router.get("/logout", function (req, res) {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
