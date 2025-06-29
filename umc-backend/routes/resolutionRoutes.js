const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateResolution } = require("../middleware/validationinputfield.js");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/resolution", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM resolution WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM resolution";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/resolution", verifyToken, sanitizeInput, validateResolution, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { Department_Name, Resolutions_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link, language_code } = req.body;
  const formattedDate = convertToMySQLDate(Schedule_Date_of_Meeting);
  const sql = `
    INSERT INTO resolution 
    (Department_Name, Resolutions_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link,language_code) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [Department_Name, Resolutions_No_Date, formattedDate, Adjournment_Notice, pdf_link, language_code],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add resolution." });
      }
      res
        .status(200)
        .json({ message: "Resolution added successfully", resolutionId: result.insertId });
    });
});


router.post("/edit-resolution/:Sr_No", verifyToken, sanitizeInput, validateResolution, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { Department_Name, Resolutions_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link, language_code } = req.body;
  const formattedDate = Schedule_Date_of_Meeting ? convertToMySQLDate(Schedule_Date_of_Meeting) : null;
  const sql = `
    UPDATE resolution 
    SET Department_Name = ?, Resolutions_No_Date = ?, Schedule_Date_of_Meeting = ?, Adjournment_Notice = ?, pdf_link = ?, language_code = ?
    WHERE Sr_No = ?
  `;
  db.query(
    sql,
    [Department_Name, Resolutions_No_Date, formattedDate, Adjournment_Notice, pdf_link, language_code, req.params.Sr_No],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update resolution." });
      }
      res.json({ success: true });
    }
  );
});


router.post("/delete-resolution/:Sr_No", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const sql = "DELETE FROM resolution WHERE Sr_No = ?";
  db.query(sql, [req.params.Sr_No], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete resolution." });
    }
    res.json({ success: true });
  });
});


module.exports = router;