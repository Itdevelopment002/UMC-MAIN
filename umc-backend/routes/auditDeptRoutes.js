const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


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


router.post("/audit-report", verifyToken, sanitizeInput, (req, res) => {
  if (req.user?.role !== "Superadmin") {
    const allowedPermissions = ["Audit Department", "ऑडिट विभाग"];

    const hasAuditPermission = allowedPermissions.some((perm) =>
      req.user?.permission?.includes(perm)
    );

    if (!hasAuditPermission) {
      return res.status(403).json({
        message: "Permission denied: Only users with 'Audit Department' access are allowed.",
      });
    }
  }
  const { name, year, pdf_link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);
  const sql =
    "INSERT INTO audit_dept (name, year, pdf_link, issue_date, language_code) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, year, pdf_link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({
      id: result.insertId,
      name,
      year,
      pdf_link,
      language_code
    });
  });
});


router.post("/edit-audit-report/:id", verifyToken, sanitizeInput, (req, res) => {
  if (req.user?.role !== "Superadmin") {
    const allowedPermissions = ["Audit Department", "ऑडिट विभाग"];

    const hasAuditPermission = allowedPermissions.some((perm) =>
      req.user?.permission?.includes(perm)
    );

    if (!hasAuditPermission) {
      return res.status(403).json({
        message: "Permission denied: Only users with 'Audit Department' access are allowed.",
      });
    }
  }
  const { name, year, pdf_link, issue_date, language_code } = req.body;
  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;
  const sql =
    "UPDATE audit_dept SET name = ?, year = ?, pdf_link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(
    sql,
    [name, year, pdf_link, formattedDate, language_code, req.params.id],
    (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    }
  );
});


router.post("/delete-audit-report/:id", verifyToken, (req, res) => {
  if (req.user?.role !== "Superadmin") {
    const allowedPermissions = ["Audit Department", "ऑडिट विभाग"];

    const hasAuditPermission = allowedPermissions.some((perm) =>
      req.user?.permission?.includes(perm)
    );

    if (!hasAuditPermission) {
      return res.status(403).json({
        message: "Permission denied: Only users with 'Audit Department' access are allowed.",
      });
    }
  }
  const sql = "DELETE FROM audit_dept WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.json({ success: true });
  });
});


module.exports = router;
