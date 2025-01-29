const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/tenders-quotations", (req, res) => {
  db.query("SELECT * FROM tenders_quotations", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/tenders-quotations", (req, res) => {
  const { heading, department, link } = req.body;
  const sql = "INSERT INTO tenders_quotations (heading, department, link) VALUES (?, ?, ?)";
  db.query(sql, [heading, department, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, department, link });
  });
});

router.put("/tenders-quotations/:id", (req, res) => {
  const { heading, department, link } = req.body;
  const sql = "UPDATE tenders_quotations SET heading = ?, department = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, department, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/tenders-quotations/:id", (req, res) => {
  const sql = "DELETE FROM tenders_quotations WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
