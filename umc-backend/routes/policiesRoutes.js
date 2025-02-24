const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/policies_data", (req, res) => {
  db.query("SELECT * FROM policies", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/policies_data", (req, res) => {
  const { heading, link } = req.body;
  const sql = "INSERT INTO policies (heading, link) VALUES (?, ?)";
  db.query(sql, [heading, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading, link });
  });
});


router.put("/policies_data/:id", (req, res) => {
  const { heading, link } = req.body;
  const sql = "UPDATE policies SET heading = ?, link = ? WHERE id = ?";
  db.query(sql, [heading, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


router.delete("/policies_data/:id", (req, res) => {
  const sql = "DELETE FROM policies WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
