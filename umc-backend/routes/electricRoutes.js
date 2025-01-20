const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/electric", (req, res) => {
  db.query("SELECT * FROM electric", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch electric data" });
    }
    res.json(results);
  });
});

router.post("/electric", (req, res) => {
  const { heading, description, mobileNo, vendorName } = req.body;
  const sql =
    "INSERT INTO electric (heading, description, mobileNo, vendorName) VALUES (?, ?, ?, ?)";

  db.query(sql, [heading, description, mobileNo, vendorName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add electric data" });
    }
    res.json({
      id: result.insertId,
      heading,
      description,
      mobileNo,
      vendorName,
    });
  });
});

router.put("/electric/:id", (req, res) => {
  const { heading, description, mobileNo, vendorName } = req.body;
  const sql =
    "UPDATE electric SET heading = ?, description = ?, mobileNo = ?, vendorName = ? WHERE id = ?";

  db.query(
    sql,
    [heading, description, mobileNo, vendorName, req.params.id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Failed to update electric data" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Electric record not found" });
      }
      res.json({ success: true });
    }
  );
});

router.delete("/electric/:id", (req, res) => {
  const sql = "DELETE FROM electric WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete electric data" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Electric record not found" });
    }
    res.json({ success: true });
  });
});

module.exports = router;
