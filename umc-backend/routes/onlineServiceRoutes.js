const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/online-services-home", (req, res) => {
  db.query("SELECT * FROM onlineservice", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/online-services-home", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO onlineservice (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});

router.put("/online-services-home/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE onlineservice SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/online-services-home/:id", (req, res) => {
  const sql = "DELETE FROM onlineservice WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
