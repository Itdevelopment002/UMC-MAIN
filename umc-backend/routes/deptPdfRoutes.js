const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');
const sanitizeInput = require('../middleware/sanitizeInput.js');
const { validateDeptPdf } = require("../middleware/validationinputfield.js");

const convertToMySQLDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};


router.get("/department-pdfs", (req, res) => {
  const language = req.query.lang;
  let query;
  let params = [];
  if (language) {
    query = `SELECT * FROM deptpdf WHERE language_code = ?`;
    params.push(language);
  } else {
    query = "SELECT * FROM deptpdf";
  }

  db.query(query, params, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post("/department-pdfs", verifyToken, sanitizeInput, validateDeptPdf, (req, res) => {
  const { department, heading, link, issue_date, language_code } = req.body;
  const formattedDate = convertToMySQLDate(issue_date);

  if (req.user?.role !== "Superadmin") {
    const allowedDepartments = req.user?.permission?.split(",") || [];
    const trimmedDepartments = allowedDepartments.map((d) => d.trim());

    if (!trimmedDepartments.includes(department)) {
      return res.status(403).json({
        message: `Access denied: You don't have permission to upload for '${department}'`,
      });
    }
  }

  const sql = "INSERT INTO deptpdf (department, heading, link, issue_date, language_code) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [department, heading, link, formattedDate, language_code], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, department, heading, link, language_code });
  });
});


router.post("/edit-department-pdfs/:id", verifyToken, sanitizeInput, validateDeptPdf, (req, res) => {
  const { department, heading, link, issue_date, language_code } = req.body;

  // Check permission
  const allowedDepartments = req.user?.permission?.split(",").map(dep => dep.trim()) || [];

  if (req.user?.role !== "Superadmin" && !allowedDepartments.includes(department)) {
    return res.status(403).json({ message: "Access denied: You don't have permission for this department." });
  }

  const formattedDate = issue_date ? convertToMySQLDate(issue_date) : null;

  const sql = "UPDATE deptpdf SET department = ?, heading = ?, link = ?, issue_date = ?, language_code = ? WHERE id = ?";
  db.query(sql, [department, heading, link, formattedDate, language_code, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ success: true });
  });
});



router.post("/delete-department-pdfs/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  // Step 1: Get department for the given PDF
  const selectSql = "SELECT department FROM deptpdf WHERE id = ?";
  db.query(selectSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Department PDF not found" });
    }

    const department = result[0].department;

    // Step 2: Check permission
    const allowedDepartments = req.user?.permission?.split(",").map(dep => dep.trim()) || [];

    if (req.user?.role !== "Superadmin" && !allowedDepartments.includes(department)) {
      return res.status(403).json({ message: "Access denied: You don't have permission for this department." });
    }

    // Step 3: Proceed with deletion
    const deleteSql = "DELETE FROM deptpdf WHERE id = ?";
    db.query(deleteSql, [id], (err, deleteResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.json({ success: true });
    });
  });
});



module.exports = router;
