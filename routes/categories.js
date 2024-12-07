const express = require("express");
const router = express.Router();
const database = require("../config/database.js");
const { verifyToken } = require("../middleware/verifyToken");
const moment = require("moment-timezone");

function parseResult(result) {
  return Object.values(JSON.parse(JSON.stringify(result)));
}

// Section Categories --------------------------------------------------------------------------------------------

// View Categories
router.get("/categories/:userId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  const sql = `SELECT * FROM categories WHERE id_user = ${userId}`;

  database.query(sql, function (error, result) {
    if (error) throw error;

    const categories = parseResult(result);
    console.log(categories);
    res.render("categories", { categories, userId });
  });
});

// =====================================================================
// Add Categories Page
router.get("/add-categories/:userId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }

  res.render("addCategories", { userId });
});

// =====================================================================
// Update Categories Page
router.get("/Update-categories/:userId/:categoryId", verifyToken, function (req, res) {
  const userId = req.params.userId;
  if (userId != req.user.id) {
    return res.status(403).redirect("/");
  }
  
  const categoryId = req.params.categoryId;
  const sql = `SELECT * FROM categories WHERE id_user = ${userId} AND id_categories = ${categoryId}`;

  database.query(sql, function (error, result) {
    if (error) throw error;
    const category = parseResult(result)[0];
    res.render("updateCategories", { category, userId });
  });
});

// =====================================================================
// Add Categories Submit
router.post("/add-categories/submit/:userId", function (req, res) {
  const userId = req.params.userId;
  const userInput = req.body;
  const sql = `INSERT INTO categories(name, id_user) VALUES ('${userInput.category}', ${userId})`;

  database.query(sql, function (error, result) {
    if (error) throw error;
    res.redirect(`/categories/${userId}`);
  });
});

// =====================================================================
// Update Categories Submit
router.post(
  "/update-categories/submit/:userId/:categoryId",
  function (req, res) {
    const userId = req.params.userId;
    const categoriesId = req.params.categoryId;
    const userInput = req.body;
    const sql = `UPDATE categories SET name = '${userInput.category}' WHERE id_user = ${userId} AND id_categories = ${categoriesId}`;
    console.log(userInput);

    database.query(sql, function (error, result) {
      if (error) throw error;
      res.redirect(`/categories/${userId}`);
    });
  }
);

// =====================================================================
// Delete Categories
router.post("/delete-categories/:userId/:categoriesId", function (req, res) {
  const userId = req.params.userId;
  const categoriesId = req.params.categoriesId;
  const sql = `DELETE FROM categories WHERE id_user = ${userId} AND id_categories = ${categoriesId}`;
  database.query(sql, function (error, result) {
    if (error) throw error;
    res.redirect(`/categories/${userId}`);
  });
});

module.exports = router;
