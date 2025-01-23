const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/online_service", (req, res) => {
  db.query("SELECT * FROM online_services", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/online_service", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO online_services (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});

router.put("/online_service/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE online_services SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/online_service/:id", (req, res) => {
  const sql = "DELETE FROM online_services WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
