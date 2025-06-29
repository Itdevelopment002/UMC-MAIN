const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateWardOffice } = require("../middleware/validationinputfield.js");

router.get("/ward-offices", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM WardOffices WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM WardOffices";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/ward-offices", verifyToken, sanitizeInput, validateWardOffice, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url, language_code } = req.body;

  const sql = `
    INSERT INTO WardOffices (ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url,language_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url, language_code],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Database insertion error" });
      } else {
        res.json({
          id: result.insertId,
          ward_no,
          ward_name,
          officer_name,
          address,
          email,
          mobile,
          landline,
          areas,
          map_url,
          language_code
        });
      }
    }
  );
});


router.post("/edit-ward-offices/:id", verifyToken, sanitizeInput, validateWardOffice, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url, language_code } = req.body;

  const sql = `
    UPDATE WardOffices 
    SET ward_no = ?, ward_name = ?, officer_name = ?, address = ?, email = ?, mobile = ?, landline = ?, areas = ?, map_url = ? ,language_code = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url, language_code, req.params.id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Database update error" });
      } else {
        res.json({ success: true });
      }
    }
  );
});


router.post("/delete-ward-offices/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const sql = "DELETE FROM WardOffices WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database deletion error" });
    } else {
      res.json({ success: true });
    }
  });
});


module.exports = router;
