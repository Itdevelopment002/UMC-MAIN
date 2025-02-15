const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Get all ward offices
// router.get("/ward-offices", (req, res) => {
//   db.query("SELECT * FROM WardOffices", (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: "Database query error" });
//     } else {
//       res.json(results);
//     }
//   });
// });
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

// Add a new ward office
router.post("/ward-offices", (req, res) => {
  const { ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url,language_code } = req.body;

  const sql = `
    INSERT INTO WardOffices (ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url,language_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [ward_no, ward_name, officer_name, address, email, mobile, landline, areas,language_code, map_url],
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

// Update a ward office by ID
router.put("/ward-offices/:id", (req, res) => {
  const { ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url,language_code } = req.body;

  const sql = `
    UPDATE WardOffices 
    SET ward_no = ?, ward_name = ?, officer_name = ?, address = ?, email = ?, mobile = ?, landline = ?, areas = ?, map_url = ? ,language_code = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [ward_no, ward_name, officer_name, address, email, mobile, landline, areas, map_url,language_code, req.params.id],
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

// Delete a ward office by ID
router.delete("/ward-offices/:id", (req, res) => {
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
