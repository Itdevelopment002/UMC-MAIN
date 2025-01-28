const express = require("express");
const router = express.Router();
const db = require("../config/db");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

router.post("/recruitment", (req, res) => {
  const { description, publishDate } = req.body;

  const formattedDate = convertToMySQLDate(publishDate);

  if (!description || !publishDate) {
    return res
      .status(400)
      .json({
        message: "Description and publish date are required",
      });
  }

  const sql =
    "INSERT INTO recruitments (description, publish_date) VALUES (?, ?)";
  db.query(sql, [description, formattedDate], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Recruitment added successfully", videoId: result.insertId });
  });
});

router.get("/recruitment", (req, res) => {
  const sql = "SELECT * FROM recruitments";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/recruitment/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM recruitments WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Recruitment not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.put("/recruitment/:id", (req, res) => {
  const { id } = req.params;
  const { description, publish_date } = req.body;

  const formattedDate = publish_date ? convertToMySQLDate(publish_date) : null;

  let updateSql = "UPDATE recruitments SET";
  const updateParams = [];

  if (description) {
    updateSql += " description = ?";
    updateParams.push(description);
  }
  if (formattedDate) {
    updateSql += ", publish_date = ?";
    updateParams.push(formattedDate);
  }

  updateSql += " WHERE id = ?";
  updateParams.push(id);

  db.query(updateSql, updateParams, (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json({ message: "Recruitment updated successfully" });
  });
});

router.delete("/recruitment/:id", (req, res) => {
  const { id } = req.params;

  const deleteSql = "DELETE FROM recruitments WHERE id = ?";
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Recruitment not found" });
    }
    res.status(200).json({ message: "Recruitment deleted successfully" });
  });
});

module.exports = router;
