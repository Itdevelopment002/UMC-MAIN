const express = require("express");
const router = express.Router();
const db = require("../config/db");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

router.post("/circular-info", (req, res) => {
  const { description, number, publishDate, link } = req.body;

  const formattedDate = convertToMySQLDate(publishDate);

  if (!description || !number || !publishDate || !link) {
    return res
      .status(400)
      .json({
        message: "Description, number, publish date and link are required",
      });
  }

  const sql =
    "INSERT INTO circulars (description, number, publish_date, link) VALUES (?, ?, ?, ?)";
  db.query(sql, [description, number, formattedDate, link], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Circular added successfully", videoId: result.insertId });
  });
});

router.get("/circular-info", (req, res) => {
  const sql = "SELECT * FROM circulars";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/circular-info/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM circulars WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Circular not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/circular-info/:id", (req, res) => {
  const { id } = req.params;
  const { description, number, publish_date, link } = req.body;

  const formattedDate = publish_date ? convertToMySQLDate(publish_date) : null;

  let updateFields = [];
  let updateParams = [];

  if (description) {
    updateFields.push("description = ?");
    updateParams.push(description);
  }

  if (number) {
    updateFields.push("number = ?");
    updateParams.push(number);
  }

  if (formattedDate) {
    updateFields.push("publish_date = ?");
    updateParams.push(formattedDate);
  }

  if (link) {
    updateFields.push("link = ?");
    updateParams.push(link);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const updateSql = `UPDATE circulars SET ${updateFields.join(", ")} WHERE id = ?`;
  updateParams.push(id);

  db.query(updateSql, updateParams, (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Circular updated successfully" });
  });
});


router.delete("/circular-info/:id", (req, res) => {
  const { id } = req.params;

  const deleteSql = "DELETE FROM circulars WHERE id = ?";
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Circular not found" });
    }
    res.status(200).json({ message: "Circular deleted successfully" });
  });
});

module.exports = router;
