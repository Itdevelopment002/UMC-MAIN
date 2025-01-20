const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/private-hospital", (req, res) => {
  const {
    hospitalName,
    division,
    principalDoctor,
    address,
    phoneNo,
    mobileNo,
    beds,
    facilities,
  } = req.body;

  const sql = `
      INSERT INTO prvt_hospital 
      (hospital_name, division, principal_doctor, address, phone_no, mobile_no, beds, facility) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      hospitalName,
      division,
      principalDoctor,
      address,
      phoneNo,
      mobileNo,
      beds,
      facilities,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res
        .status(200)
        .json({ message: "Hospital added successfully", data: result });
    }
  );
});

router.get("/private-hospital", (req, res) => {
  const sql = `SELECT * FROM prvt_hospital`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
});

router.delete("/private-hospital/:id", (req, res) => {
  const hospitalId = req.params.id;

  const sql = "DELETE FROM prvt_hospital WHERE id = ?";

  db.query(sql, [hospitalId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Hospital deleted successfully" });
  });
});

router.put("/private-hospital/:id", (req, res) => {
  const hospitalId = req.params.id;
  const {
    hospitalName,
    division,
    principalDoctor,
    address,
    phoneNo,
    mobileNo,
    beds,
    facilities,
  } = req.body;

  const sql = `
        UPDATE prvt_hospital
        SET hospital_name = ?, division = ?, principal_doctor = ?, address = ?, phone_no = ?, mobile_no = ?, beds = ?, facility = ?
        WHERE id = ?
      `;

  db.query(
    sql,
    [
      hospitalName,
      division,
      principalDoctor,
      address,
      phoneNo,
      mobileNo,
      beds,
      facilities,
      hospitalId,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({ message: "Hospital updated successfully" });
    }
  );
});

module.exports = router;
