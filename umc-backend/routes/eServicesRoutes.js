const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/eservices", (req, res) => {
  db.query("SELECT * FROM eservices", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/eservices", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO eservices (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});

router.put("/eservices/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE eservices SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/eservices/:id", (req, res) => {
  const sql = "DELETE FROM eservices WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
