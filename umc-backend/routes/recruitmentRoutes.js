const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require('../middleware/jwtMiddleware.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/recruitment", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM recruitments WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM recruitments";
  }

  db.query(query, params, (err, results) => {
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


router.post("/recruitment", verifyToken, (req, res) => {
  const { heading, description, link, issue_date, language_code } = req.body;

  if (!heading || !description || !link || !issue_date || !language_code) {
    return res
      .status(400)
      .json({
        message: "Heading, Language code, Description and Link are required",
      });
  }
  const formattedDate = convertToMySQLDate(issue_date);
  const sql =
    "INSERT INTO recruitments (heading, description, link, issue_date, language_code) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [heading, description, link, formattedDate, language_code], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res
      .status(200)
      .json({ message: "Recruitment added successfully", recruitmentId: result.insertId });
  });
});


router.post("/edit-recruitment/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { heading, description, link, issue_date, language_code } = req.body;

  let updateSql = "UPDATE recruitments SET ";
  const updateParams = [];
  const updateFields = [];

  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;

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

  if (formattedDate) {
    updateFields.push("issue_date = ?");
    updateParams.push(formattedDate);
  }

  if (language_code) {
    updateFields.push("language_code = ?");
    updateParams.push(language_code);
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


router.post("/delete-recruitment/:id", verifyToken, (req, res) => {
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
