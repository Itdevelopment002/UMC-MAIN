const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Get all department descriptions along with sub-descriptions
router.get("/project-description", (req, res) => {
  const sql = `
    SELECT 
      d.id, 
      d.heading, 
      d.description, 
      GROUP_CONCAT(s.sub_description) AS subDescriptions
    FROM descriptions d
    LEFT JOIN sub_descriptions s ON d.id = s.dept_id
    GROUP BY d.id, d.heading, d.description
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

router.get("/project-description/:id/sub-descriptions", (req, res) => {
  const sql = "SELECT * FROM sub_descriptions WHERE dept_id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add new department description with sub-descriptions
router.post("/project-description", (req, res) => {
  const { department, description, subDescriptions } = req.body;
  const sql = "INSERT INTO descriptions (heading, description) VALUES (?, ?)";
  
  db.query(sql, [department, description], (err, result) => {
    if (err) throw err;

    // Insert sub-descriptions if they exist
    if (subDescriptions && subDescriptions.length > 0) {
      const deptId = result.insertId;
      const subDescriptionSql = "INSERT INTO sub_descriptions (dept_id, sub_description) VALUES ?";
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
router.put("/project-description/:id", (req, res) => {
  const { heading, description, subDescriptions } = req.body;
  const sql = "UPDATE descriptions SET heading = ?, description = ? WHERE id = ?";
  
  db.query(sql, [heading, description, req.params.id], (err, result) => {
    if (err) throw err;

    // Delete existing sub-descriptions
    const deleteSubDescriptionsSql = "DELETE FROM sub_descriptions WHERE dept_id = ?";
    db.query(deleteSubDescriptionsSql, [req.params.id], (err) => {
      if (err) throw err;

      // Insert updated sub-descriptions
      if (subDescriptions && subDescriptions.length > 0) {
        const subDescriptionSql = "INSERT INTO sub_descriptions (dept_id, sub_description) VALUES ?";
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
router.delete("/project-description/:id", (req, res) => {
  // First, delete sub-descriptions
  const deleteSubDescriptionsSql = "DELETE FROM sub_descriptions WHERE dept_id = ?";
  db.query(deleteSubDescriptionsSql, [req.params.id], (err) => {
    if (err) throw err;

    // Then delete the department description
    const sql = "DELETE FROM descriptions WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});

module.exports = router;
