const express = require("express");
const router = express.Router();
const database = require("../config/database.js");
const { verifyToken } = require("../middleware/verifyToken");
const moment = require("moment-timezone");

function parseResult(result) {
  return Object.values(JSON.parse(JSON.stringify(result)));
}

// Section Now Reading --------------------------------------------------------------------------------------------

// View Now Reading Page
router.get("/now-reading/:userId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql = `SELECT * FROM book LEFT JOIN categories ON (book.id_categories = categories.id_categories)
                WHERE book.id_user = ${userId}`;

  database.query(sql, function (error, result) {
    if (error) throw error;

    const books = parseResult(result);
    console.log(books);
    res.render("nowReading", { books, userId });
  });
});

// ===================================================================================================
// Update Status Page
router.get("/update-status-page/:userId/:bookId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }
  
  const sql = `SELECT * FROM book WHERE id_user = ${userId} AND id_book = ${bookId}`;

  database.query(sql, function (error, result) {
    const book = parseResult(result)[0];
    const startDate = moment
      .tz(book.start_date, "UTC")
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DD");
    const endDate = moment
      .tz(book.end_date, "UTC")
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DD");
    console.log(book);
    console.log("Waktu Mulai (dengan timezone):", startDate);
    console.log("Waktu Selesai (dengan timezone):", endDate);
    res.render("updateStatus", { book, startDate, endDate, userId });
  });
});

// ===================================================================================================
// Update Status Submit
router.post("/update-status/submit/:userId/:bookId", function (req, res) {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const userInput = req.body;
  console.log("Mulai: " + userInput.startDate);
  console.log("Selesai :" + userInput.endDate);
  const sql = `UPDATE book SET status = '${userInput.status}', start_date = '${userInput.startDate}', end_date = '${userInput.endDate}', notes = '${userInput.notes}'
    WHERE id_user = ${userId} AND id_book = ${bookId}`;

  database.query(sql, function (error, result) {
    if (error) throw error;
    res.redirect(`/now-reading/${userId}`);
  });
});

module.exports = router;
