const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/department-pdfs", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM deptpdf WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM deptpdf";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/department-pdfs", (req, res) => {
  const { department, heading, link, language_code } = req.body;
  const sql = "INSERT INTO deptpdf (department, heading, link, language_code) VALUES (?, ?, ?, ?)";
  db.query(sql, [department, heading, link, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, department, heading, link, language_code });
  });
});

router.put("/department-pdfs/:id", (req, res) => {
  const { department, heading, link, language_code } = req.body;
  const sql = "UPDATE deptpdf SET department = ?, heading = ?, link = ?, language_code = ? WHERE id = ?";
  db.query(sql, [department, heading, link, language_code, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/department-pdfs/:id", (req, res) => {
  const sql = "DELETE FROM deptpdf WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
