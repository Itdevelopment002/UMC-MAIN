const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/standing-committee", (req, res) => {
  db.query("SELECT * FROM standingcommittee", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/standing-committee", (req, res) => {
  const { heading } = req.body;
  const sql = "INSERT INTO standingcommittee (heading) VALUES (?)";
  db.query(sql, [heading], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, heading });
  });
});

router.put("/standing-committee/:id", (req, res) => {
  const { heading } = req.body;
  const sql = "UPDATE standingcommittee SET heading = ? WHERE id = ?";
  db.query(sql, [heading, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/standing-committee/:id", (req, res) => {
  const sql = "DELETE FROM standingcommittee WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
