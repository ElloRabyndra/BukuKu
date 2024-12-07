const express = require("express");
const router = express.Router();
const database = require("../config/database.js");
const { verifyToken } = require("../middleware/verifyToken");
const moment = require("moment-timezone");

function parseResult(result) {
  return Object.values(JSON.parse(JSON.stringify(result)));
}

// Section Book --------------------------------------------------------------------------------------------

// View List Book Page
router.get("/book/:userId", verifyToken, function (req, res) {
  const userId = req.params.userId;

  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql = `SELECT * FROM book WHERE id_user = ${userId}`;

  database.query(sql, function (error, result) {
    if (error) throw error;

    const books = parseResult(result);
    console.log(books);
    res.render("books", { books, userId });
  });
});

// =====================================================================
// View Detail Book Page
router.get("/view-book/:userId/:bookId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql = ` SELECT * FROM book LEFT JOIN CATEGORIES ON (book.id_categories = categories.id_categories)
                WHERE book.id_user = ${userId} AND book.id_book = ${bookId}`;

  database.query(sql, function (error, result) {
    if (error) throw error;

    const book = parseResult(result)[0];
    console.log(book);
    res.render("viewBook", { book, userId });
  });
});

// =====================================================================
// Add Book Page
router.get("/add-book/:userId", verifyToken, function (req, res) {
  const userId = req.params.userId;

  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql = `SELECT * FROM categories WHERE id_user = ${userId}`;

  database.query(sql, function (error, result) {
    if (error) throw error;

    const categories = parseResult(result);
    res.render("addBook", { categories, userId });
  });
});

// =====================================================================
// Update Book Page
router.get("/Update-book/:userId/:bookId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql1 = `SELECT * FROM categories WHERE id_user = ${userId}`;
  const sql2 = `SELECT * FROM book WHERE id_user = ${userId} AND id_book = ${bookId}`;

  database.query(sql1, function (error, result) {
    if (error) throw error;
    const categories = parseResult(result);

    database.query(sql2, function (error, result) {
      if (error) throw error;

      const book = parseResult(result)[0];
      res.render("updateBook", { book, categories, userId });
    });
  });
});

// =====================================================================
// Add Book Submit
router.post("/add-book/submit/:userId", function (req, res) {
  const userId = req.params.userId;
  const userInput = req.body;
  console.log(userInput);

  if (userInput.categories == "None") {
    if (!req.files || Object.keys(req.files).length === 0) {
      // Input Buku Tanpa Kategori dan Cover
      const sql = `INSERT INTO book(id_user, tittle, author, publisher) Values
                  (${userId},'${userInput.tittle}', '${userInput.author}', '${userInput.publisher}')`;

      database.query(sql, function (error, result) {
        if (error) throw error;
        console.log("Input Buku Tanpa Kategori dan Cover");
        res.redirect(`/book/${userId}`);
      });
    } else {
      // Input Buku Tanpa Kategori Dengan Cover
      const cover = req.files.cover;
      const uploadPath =
        __dirname + "/../public/asset/book_cover/" + cover.name;
      console.log(cover.name);

      cover.mv(uploadPath, function (error) {
        if (error) throw error;
        const sql = `INSERT INTO book(id_user, tittle, author, publisher, cover_book) Values
        (${userId},'${userInput.tittle}', '${userInput.author}', '${userInput.publisher}', '${cover.name}')`;

        database.query(sql, function (error, result) {
          if (error) throw error;
          console.log("Input Buku Tanpa Kategori Dengan Cover");
          res.redirect(`/book/${userId}`);
        });
      });
    }
  } else {
    if (!req.files || Object.keys(req.files).length === 0) {
      // Input Buku Dengan Kategori Tanpa Cover
      database.query(
        `SELECT id_categories FROM categories WHERE id_user = ${userId} AND name = '${userInput.categories}'`,
        function (error, result) {
          if (error) throw error;

          const categoriesId = parseResult(result)[0].id_categories;
          const sql = `INSERT INTO book(id_user, tittle, author, publisher, id_categories) Values
                       (${userId},'${userInput.tittle}', '${userInput.author}', '${userInput.publisher}', ${categoriesId})`;

          database.query(sql, function (error, result) {
            if (error) throw error;
            console.log("Input Buku Dengan Kategori Tanpa Cover");
            res.redirect(`/book/${userId}`);
          });
        }
      );
    } else {
      // Input Buku Dengan Kategori dan Cover
      const cover = req.files.cover;
      const uploadPath =
        __dirname + "/../public/asset/book_cover/" + cover.name;
      console.log(cover.name);

      cover.mv(uploadPath, function (error) {
        if (error) throw error;

        database.query(
          `SELECT id_categories FROM categories WHERE id_user = ${userId} AND name = '${userInput.categories}'`,
          function (error, result) {
            if (error) throw error;

            const categoriesId = parseResult(result)[0].id_categories;
            const sql = `INSERT INTO book(id_user, tittle, author, publisher, cover_book, id_categories) Values
                         (${userId}, '${userInput.tittle}', '${userInput.author}', '${userInput.publisher}', '${cover.name}', ${categoriesId})`;

            database.query(sql, function (error, result) {
              if (error) throw error;
              console.log("Input Buku Dengan Kategori dan Cover");
              res.redirect(`/book/${userId}`);
            });
          }
        );
      });
    }
  }
});

// =====================================================================
// Update Book Submit
router.post("/update-book/submit/:userId/:bookId", function (req, res) {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const userInput = req.body;
  console.log(userInput);

  // Update Cover
  if (!req.files || Object.keys(req.files).length === 0) {
    // Do Nothing
  } else {
    const cover = req.files.cover;
    const uploadPath = __dirname + "/../public/asset/book_cover/" + cover.name;
    console.log(cover.name);

    cover.mv(uploadPath, function (error) {
      if (error) throw error;

      const sql = `UPDATE book set cover_book = '${cover.name}' WHERE id_user = ${userId} AND id_book = ${bookId}`;

      database.query(sql, function (error, result) {
        if (error) throw error;
      });
    });
  }

  // Update Submit
  database.query(
    `SELECT id_categories FROM categories WHERE name = '${userInput.categories}'`,
    function (error, result) {
      if (error) throw error;

      const categoriesId = parseResult(result)[0].id_categories;
      const sql = `UPDATE book set tittle = '${userInput.tittle}', author = '${userInput.author}', publisher = '${userInput.publisher}', id_categories = ${categoriesId} WHERE id_user = ${userId} AND id_book = ${bookId}`;

      database.query(sql, function (error, result) {
        if (error) throw error;
        res.redirect(`/book/${userId}`);
      });
    }
  );
});

// =====================================================================
// Delete Book
router.post("/delete-book/:userId/:bookId", function (req, res) {
  const userId = req.params.userId;
  const bookId = req.params.bookId;
  const sql = `DELETE FROM book WHERE id_user = ${userId} AND id_book = ${bookId}`;
  database.query(sql, function (error, result) {
    if (error) throw error;
    res.redirect(`/book/${userId}`);
  });
});

module.exports = router;
