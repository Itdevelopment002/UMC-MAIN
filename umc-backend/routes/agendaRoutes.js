const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

router.get("/agenda_data", (req, res) => {
  db.query("SELECT * FROM agenda", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch agenda." });
    }
    res.json(results);
  });
});


router.post("/agenda_data", (req, res) => {
  const { Department_Name, Agenda_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link } = req.body;
  const formattedDate = convertToMySQLDate(Schedule_Date_of_Meeting);
  const sql = `
    INSERT INTO agenda 
    (Department_Name, Agenda_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [Department_Name, Agenda_No_Date, formattedDate, Adjournment_Notice, pdf_link],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add agenda." });
      }
      res
        .status(200)
        .json({ message: "Agenda added successfully", agendaId: result.insertId });
    });
});


router.put("/agenda_data/:Sr_No", (req, res) => {
  const { Department_Name, Agenda_No_Date, Schedule_Date_of_Meeting, Adjournment_Notice, pdf_link } = req.body;
  const formattedDate = Schedule_Date_of_Meeting ? convertToMySQLDate(Schedule_Date_of_Meeting) : null;
  const sql = `
    UPDATE agenda 
    SET Department_Name = ?, Agenda_No_Date = ?, Schedule_Date_of_Meeting = ?, Adjournment_Notice = ?, pdf_link = ? 
    WHERE Sr_No = ?
  `;
  db.query(
    sql,
    [Department_Name, Agenda_No_Date, formattedDate, Adjournment_Notice, pdf_link, req.params.Sr_No],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update agenda." });
      }
      res.json({ success: true });
    }
  );
});


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