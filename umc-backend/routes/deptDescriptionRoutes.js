const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Get all department descriptions along with sub-descriptions
router.get("/department-description", (req, res) => {
  const sql = `
    SELECT 
      d.id, 
      d.department, 
      d.description, 
      GROUP_CONCAT(s.sub_description) AS subDescriptions
    FROM deptdescription d
    LEFT JOIN dept_subdescription s ON d.id = s.dept_id
    GROUP BY d.id, d.department, d.description
  `;
  
  db.query(sql, (err, results) => {
    if (err) throw err;
    const processedResults = results.map(item => ({
      ...item,
      subDescriptions: item.subDescriptions ? item.subDescriptions.split(',') : [] // Split string into an array, or default to empty array
    }));
    res.json(processedResults);
  });
});

// Get sub-descriptions for a specific department
router.get("/department-description/:id/sub-descriptions", (req, res) => {
  const sql = "SELECT * FROM dept_subdescription WHERE dept_id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add new department description with sub-descriptions
router.post("/department-description", (req, res) => {
  const { department, description, subDescriptions } = req.body;
  const sql = "INSERT INTO deptdescription (department, description) VALUES (?, ?)";
  
  db.query(sql, [department, description], (err, result) => {
    if (err) throw err;

    // Insert sub-descriptions if they exist
    if (subDescriptions && subDescriptions.length > 0) {
      const deptId = result.insertId;
      const subDescriptionSql = "INSERT INTO dept_subdescription (dept_id, sub_description) VALUES ?";
      const subDescriptionValues = subDescriptions.map(subDesc => [deptId, subDesc]);

      db.query(subDescriptionSql, [subDescriptionValues], (err) => {
        if (err) throw err;
        res.json({ id: deptId, department, description, subDescriptions });
      });
    } else {
      res.json({ id: result.insertId, department, description });
    }
  });
});

// Update department description with sub-descriptions
router.put("/department-description/:id", (req, res) => {
  const { department, description, subDescriptions } = req.body;
  const sql = "UPDATE deptdescription SET department = ?, description = ? WHERE id = ?";
  
  db.query(sql, [department, description, req.params.id], (err, result) => {
    if (err) throw err;

    // Delete existing sub-descriptions
    const deleteSubDescriptionsSql = "DELETE FROM dept_subdescription WHERE dept_id = ?";
    db.query(deleteSubDescriptionsSql, [req.params.id], (err) => {
      if (err) throw err;

      // Insert updated sub-descriptions
      if (subDescriptions && subDescriptions.length > 0) {
        const subDescriptionSql = "INSERT INTO dept_subdescription (dept_id, sub_description) VALUES ?";
        const subDescriptionValues = subDescriptions.map(subDesc => [req.params.id, subDesc]);

        db.query(subDescriptionSql, [subDescriptionValues], (err) => {
          if (err) throw err;
          res.json({ success: true });
        });
      } else {
        res.json({ success: true });
      }
    });
  });
});

// Delete a department description and its sub-descriptions
router.delete("/department-description/:id", (req, res) => {
  // First, delete sub-descriptions
  const deleteSubDescriptionsSql = "DELETE FROM dept_subdescription WHERE dept_id = ?";
  db.query(deleteSubDescriptionsSql, [req.params.id], (err) => {
    if (err) throw err;

    // Then delete the department description
    const sql = "DELETE FROM deptdescription WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});

module.exports = router;
