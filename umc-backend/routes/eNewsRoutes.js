const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

router.get("/enews_data", (req, res) => {
  db.query("SELECT * FROM e_news", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch e-news." });
    }
    res.json(results);
  });
});

// Add a new e_news
router.post("/enews_data", (req, res) => {
  const { info, issue_date, pdf_link } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql = `
    INSERT INTO e_news 
    (info, issue_date, pdf_link) 
    VALUES (?, ?, ?)
  `;
  db.query(sql, [info, formattedDate, pdf_link], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add e-news." });
    }
    res.json({
      id: result.insertId,
      info,
      issue_date,
      pdf_link,
    });
  });
});

// Update an existing e_news
router.put("/enews_data/:id", (req, res) => {
  const { info, issue_date, pdf_link } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql = `
    UPDATE e_news 
    SET info = ?, issue_date = ?, pdf_link = ? 
    WHERE id = ?
  `;
  db.query(sql, [info, formattedDate, pdf_link, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update e-news." });
    }
    res.json({ success: true });
  });
});

// Delete an e_news
router.delete("/enews_data/:id", (req, res) => {
  const sql = "DELETE FROM e_news WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete e-news." });
    }
    res.json({ success: true });
  });
});

module.exports = router;
