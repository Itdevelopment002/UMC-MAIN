const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/recruitment", (req, res) => {
  const { heading, description, link } = req.body;

  if (!heading || !description || !link) {
    return res
      .status(400)
      .json({
        message: "Heading, Description and Link are required",
      });
  }

  const sql =
    "INSERT INTO recruitments (heading, description, link) VALUES (?, ?, ?)";
  db.query(sql, [heading, description, link], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Recruitment added successfully", recruitmentId: result.insertId });
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
  const { heading, description, link } = req.body;

  let updateSql = "UPDATE recruitments SET ";
  const updateParams = [];
  const updateFields = [];

  if (heading) {
    updateFields.push("heading = ?");
    updateParams.push(heading);
  }

  if (description) {
    updateFields.push("description = ?");
    updateParams.push(description);
  }

  if (link) {
    updateFields.push("link = ?");
    updateParams.push(link);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields provided for update" });
  }

  updateSql += updateFields.join(", ") + " WHERE id = ?";
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
