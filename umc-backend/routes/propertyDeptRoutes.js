const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/property-dept", (req, res) => {
  db.query("SELECT * FROM property_dept", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.post("/property-dept", (req, res) => {
  const { description, link } = req.body;
  const sql = "INSERT INTO property_dept (description, link) VALUES (?, ?)";
  db.query(sql, [description, link], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, description, link });
  });
});

router.put("/property-dept/:id", (req, res) => {
  const { description, link } = req.body;
  const sql = "UPDATE property_dept SET description = ?, link = ? WHERE id = ?";
  db.query(sql, [description, link, req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

router.delete("/property-dept/:id", (req, res) => {
  const sql = "DELETE FROM property_dept WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});

module.exports = router;
