const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/department-pdfs", (req, res) => {
  db.query("SELECT * FROM deptpdf", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/department-pdfs", (req, res) => {
  const { department, heading, link } = req.body;
  const sql = "INSERT INTO deptpdf (department, heading, link) VALUES (?, ?, ?)";
  db.query(sql, [department, heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, department, heading, link });
  });
});

router.put("/department-pdfs/:id", (req, res) => {
  const { department, heading, link } = req.body;
  const sql = "UPDATE deptpdf SET department = ?, heading = ?, link = ? WHERE id = ?";
  db.query(sql, [department, heading, link, req.params.id], (err, result) => {
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
