const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
router.use(express.json());
const {verifyToken} = require('../middleware/jwtMiddleware.js');


router.get("/admin-notifications", (req, res) => {
  const query = "SELECT * FROM admin_notification";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});


router.post("/admin-notifications", verifyToken, (req, res) => {
  const { new_id, description, role, name, date, time, remark } = req.body;

  if (!new_id || !description || !role || !name || !date || !time) {
    return res
      .status(400)
      .json({
        error:
          "All fields are required (new_id, description, role, name, date, time)",
      });
  }

  const query = `
        INSERT INTO admin_notification (new_id, description, role, name, date, time, remark) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  db.query(
    query,
    [new_id, description, role, name, date, time, remark || "-"],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Notification added successfully",
        id: results.insertId,
      });
    }
  );
});


router.put("/admin-notifications/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { remark } = req.body;

  if (!remark) {
    return res.status(400).json({ error: "Remark field is required" });
  }

  const query = "UPDATE admin_notification SET remark = ? WHERE id = ?";
  db.query(query, [remark, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Remark updated successfully" });
  });
});


router.delete("/admin-notifications/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM admin_notification WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.json({ message: "Notification deleted successfully" });
  });
});


module.exports = router;
