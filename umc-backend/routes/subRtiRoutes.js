const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/sub-rti", (req, res) => {
  db.query("SELECT * FROM subrti", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/sub-rti", (req, res) => {
  const { description, link } = req.body;
  const sql = "INSERT INTO subrti (description, link) VALUES (?, ?)";
  db.query(sql, [description, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link });
  });
});

router.put("/sub-rti/:id", (req, res) => {
  const { description, link } = req.body;
  const sql = "UPDATE subrti SET description = ?, link = ? WHERE id = ?";
  db.query(sql, [description, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/sub-rti/:id", (req, res) => {
  const sql = "DELETE FROM subrti WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
