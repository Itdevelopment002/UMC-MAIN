const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Fetch all resolutions
router.get("/resolution", (req, res) => {
  db.query("SELECT * FROM resolution", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch resolutions." });
    }
    res.json(results);
  });
});

// Add a new resolution
router.post("/resolution", (req, res) => {
  const { Department_Name, Resolutions_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link } = req.body;
  const sql = `
    INSERT INTO resolution 
    (Department_Name, Resolutions_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [Department_Name, Resolutions_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add resolution." });
      }
      res.json({
        id: result.insertId,
        Department_Name,
        Resolutions_No_Date,
        Schedule_Date_of_Meeting,
        Adjournment_Notice,
        pdf_link,
      });
    }
  );
});

// Update an existing resolution
router.put("/resolution/:Sr_No", (req, res) => {
  const { Department_Name, Resolutions_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link } = req.body;
  const sql = `
    UPDATE resolution 
    SET Department_Name = ?, Resolutions_No_Date = ?, Schedule_Date_of_Meeting = ?, Adjournment_Notice = ?, pdf_link = ? 
    WHERE Sr_No = ?
  `;
  db.query(
    sql,
    [Department_Name, Resolutions_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link, req.params.Sr_No],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update resolution." });
      }
      res.json({ success: true });
    }
  );
});

// Delete a resolution
router.delete("/resolution/:Sr_No", (req, res) => {
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