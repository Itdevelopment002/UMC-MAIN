const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/audit-report", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM audit_dept WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM audit_dept";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/audit-report", (req, res) => {
  const { name, year, pdf_link1, pdf_link2, pdf_link3,language_code } = req.body;
  const sql =
    "INSERT INTO audit_dept (name, year, pdf_link1, pdf_link2, pdf_link3,language_code) VALUES (?, ?, ?, ?, ?,?)";
  db.query(sql, [name, year, pdf_link1, pdf_link2, pdf_link3,language_code], (err, result) => {
    if (err) throw err;
    res.json({
      id: result.insertId,
      name,
      year,
      pdf_link1,
      pdf_link2,
      pdf_link3,
      language_code
    });
  });
});


router.put("/audit-report/:id", (req, res) => {
  const { name, year, pdf_link1, pdf_link2, pdf_link3,language_code } = req.body;
  const sql =
    "UPDATE audit_dept SET name = ?, year = ?, pdf_link1 = ?, pdf_link2 = ?, pdf_link3 = ? ,language_code = ? WHERE id = ?";
  db.query(
    sql,
    [name, year, pdf_link1, pdf_link2, pdf_link3,language_code, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    }
  );
});


router.delete("/audit-report/:id", (req, res) => {
  const sql = "DELETE FROM audit_dept WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
