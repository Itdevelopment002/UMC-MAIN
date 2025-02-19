const express = require("express");
const router = express.Router();
const db = require("../config/db.js");


router.get("/department-description", (req, res) => {
  const language = req.query.lang;
  let sql = `
    SELECT 
      d.id, 
      d.department, 
      d.description, 
      d.language_code,
      GROUP_CONCAT(s.sub_description) AS subDescriptions
    FROM deptdescription d
    LEFT JOIN dept_subdescription s ON d.id = s.dept_id
  `;

  const params = [];

  if (language) {
    sql += ` WHERE d.language_code = ?`;
    params.push(language);
  }

  sql += ` GROUP BY d.id, d.department, d.description`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const processedResults = results.map(item => ({
      ...item,
      subDescriptions: item.subDescriptions ? item.subDescriptions.split(',') : []
    }));

    res.json(processedResults);

  });
});


router.get("/department-description/:id/sub-descriptions", (req, res) => {
  const { id } = req.params;
  const language = req.query.lang;

  let sql = "SELECT * FROM dept_subdescription WHERE dept_id = ?";
  const params = [id];

  if (language) {
    sql += " AND language_code = ?";
    params.push(language);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});


router.post("/department-description", (req, res) => {
  const { department, description, subDescriptions, language_code } = req.body;
  const sql = "INSERT INTO deptdescription (department, description, language_code) VALUES (?, ?, ?)";

  db.query(sql, [department, description, language_code], (err, result) => {
    if (err) throw err;

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


router.put("/department-description/:id", (req, res) => {
  const { department, description, subDescriptions, language_code } = req.body;
  const sql = "UPDATE deptdescription SET department = ?, description = ?, language_code = ? WHERE id = ?";

  db.query(sql, [department, description, language_code, req.params.id], (err, result) => {
    if (err) throw err;

    const deleteSubDescriptionsSql = "DELETE FROM dept_subdescription WHERE dept_id = ?";
    db.query(deleteSubDescriptionsSql, [req.params.id], (err) => {
      if (err) throw err;

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

router.delete("/department-description/:id", (req, res) => {
  const deleteSubDescriptionsSql = "DELETE FROM dept_subdescription WHERE dept_id = ?";
  db.query(deleteSubDescriptionsSql, [req.params.id], (err) => {
    if (err) throw err;

    const sql = "DELETE FROM deptdescription WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});


module.exports = router;
