const express = require("express");
const router = express.Router();
const database = require("../config/database.js");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../middleware/verifyToken");

function parseResult(result) {
  return Object.values(JSON.parse(JSON.stringify(result)));
}

// Profile Page
router.get("/profile/:userId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql = `SELECT * FROM user WHERE id_user = '${userId}'`;

  database.query(sql, function (error, result) {
    if (error) throw error;

    const user = parseResult(result)[0];
    res.render("profile", { user, message: "" });
  });
});

// Update Profile Submit
router.post("/edit-profile/:userId", verifyToken, async function (req, res) {
  const userId = req.params.userId;
  const { username, oldPassword, newPassword, passwordConfirm } = req.body;

  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  // Ambil data user dari database
  const sql = `SELECT * FROM user WHERE id_user = ?`;
  database.query(sql, [userId], async function (error, result) {
    if (error) throw error;

    const user = parseResult(result)[0];

    // hanya mengupdate username
    if (newPassword === "" && oldPassword === "") {
      const updateSql = `UPDATE user SET username = ? WHERE id_user = ?`;
      database.query(updateSql, [username, userId], function (error, result) {
        if (error) throw error;
        return res.render("profile", { user, message: "Update Berhasil !"});
      });
    }
    // Jika mengganti username dan password
    else if (oldPassword !== "" && newPassword !== "") {
      const validPassword = await bcrypt.compare(oldPassword, user.password);
      if (!validPassword) {
        // Password lama salah
        return res.render("profile", { user, message: "Password Lama Salah !"});
      }

      if (newPassword !== passwordConfirm) {
        // Password baru dan konfirmasi tidak sama
        return res.render("profile", { user, message: "Password Konfirmasi Salah !"});
      }

      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = `UPDATE user SET username = ?, password = ? WHERE id_user = ?`;
      database.query(
        updateSql,
        [username, hashedPassword, userId],
        function (error, result) {
          if (error) throw error;
          return res.render("profile", { user, message: "Update Berhasil !"});
        }
      );
    } else {
      // Jika hanya password yang diisi tetapi tidak valid
      return res.render("profile", { user, message: "Password Salah !" });
    }
  });
});

router.get("/dashboard/:userId", verifyToken, function(req, res) {
  const userId = req.params.userId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  // Menyimpan Data Dashboard
  const sql = `
  SELECT 
    (SELECT COUNT(*) FROM book WHERE id_user = ?) AS total_buku,
    (SELECT COUNT(*) FROM categories WHERE id_user = ?) AS total_kategori,
    (SELECT COUNT(*) FROM book WHERE id_user = ? AND status = 'Belum Dibaca') AS buku_belum_dibaca,
    (SELECT COUNT(*) FROM book WHERE id_user = ? AND status = 'Sedang Dibaca') AS buku_sedang_dibaca,
    (SELECT COUNT(*) FROM book WHERE id_user = ? AND status = 'Selesai Dibaca') AS buku_selesai_dibaca
`;

database.query(sql, [userId, userId, userId, userId, userId], function (error, result) {
  if (error) throw error;

  const dashboard = parseResult(result)[0];
  res.render("dashboard", {userId, dashboard})
  });
});

module.exports = router;
