const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Fetch all agenda
router.get("/agenda_data", (req, res) => {
  db.query("SELECT * FROM agenda", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch agenda." });
    }
    res.json(results);
  });
});

// Add a new agenda
router.post("/agenda_data", (req, res) => {
  const { Department_Name, Agenda_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link } = req.body;
  const sql = `
    INSERT INTO agenda 
    (Department_Name, Agenda_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [Department_Name, Agenda_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add agenda." });
      }
      res.json({
        id: result.insertId,
        Department_Name,
        Agenda_No_Date,
        Schedule_Date_of_Meeting,
        Adjournment_Notice,
        pdf_link,
      });
    }
  );
});

// Update an existing agenda
router.put("/agenda_data/:Sr_No", (req, res) => {
  const { Department_Name, Agenda_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link } = req.body;
  const sql = `
    UPDATE agenda 
    SET Department_Name = ?, Agenda_No_Date = ?, Schedule_Date_of_Meeting = ?, Adjournment_Notice = ?, pdf_link = ? 
    WHERE Sr_No = ?
  `;
  db.query(
    sql,
    [Department_Name, Agenda_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link, req.params.Sr_No],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update agenda." });
      }
      res.json({ success: true });
    }
  );
});

// Delete a agenda
router.delete("/agenda_data/:Sr_No", (req, res) => {
  const sql = "DELETE FROM agenda WHERE Sr_No = ?";
  db.query(sql, [req.params.Sr_No], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete agenda." });
    }
    res.json({ success: true });
  });
});

module.exports = router;