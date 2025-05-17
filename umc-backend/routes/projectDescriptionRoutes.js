const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');

router.get("/project-description", (req, res) => {
  const language = req.query.lang;
  let sql = `
    SELECT 
      d.id, 
      d.heading, 
      d.description, 
      d.language_code,
      GROUP_CONCAT(s.sub_description) AS subDescriptions
    FROM descriptions d
    LEFT JOIN sub_descriptions s ON d.id = s.dept_id
  `;

  const params = [];

  if (language) {
    sql += ` WHERE d.language_code = ?`;
    params.push(language);
  }

  sql += ` GROUP BY d.id, d.heading, d.description`;

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


router.get("/project-description/:id/sub-descriptions", (req, res) => {
  const { id } = req.params;
  const language = req.query.lang;

  let sql = "SELECT * FROM sub_descriptions WHERE dept_id = ?";
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


router.post("/project-description", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { department, description, language_code, subDescriptions } = req.body;
  const sql = "INSERT INTO descriptions (heading, description, language_code) VALUES (?, ?, ?)";

  db.query(sql, [department, description, language_code], (err, result) => {
    if (err) throw err;

    if (subDescriptions && subDescriptions.length > 0) {
      const deptId = result.insertId;
      const subDescriptionSql = "INSERT INTO sub_descriptions (dept_id, sub_description) VALUES ?";
      const subDescriptionValues = subDescriptions.map(subDesc => [deptId, subDesc]);

      db.query(subDescriptionSql, [subDescriptionValues], (err) => {
        if (err) throw err;
        res.json({ id: deptId, department, description, language_code, subDescriptions });
      });
    } else {
      res.json({ id: result.insertId, department, description, language_code });
    }
  });
});


router.post("/edit-project-description/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const { heading, description, language_code, subDescriptions } = req.body;
  const sql = "UPDATE descriptions SET heading = ?, description = ?, language_code = ? WHERE id = ?";

  db.query(sql, [heading, description, language_code, req.params.id], (err, result) => {
    if (err) throw err;

    const deleteSubDescriptionsSql = "DELETE FROM sub_descriptions WHERE dept_id = ?";
    db.query(deleteSubDescriptionsSql, [req.params.id], (err) => {
      if (err) throw err;

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


router.post("/delete-project-description/:id", verifyToken, (req, res) => {
  if (req.user?.role === "Admin") {
    return res.status(403).json({ message: "Permission denied: Admins are not allowed to perform this action." });
  }
  const deleteSubDescriptionsSql = "DELETE FROM sub_descriptions WHERE dept_id = ?";
  db.query(deleteSubDescriptionsSql, [req.params.id], (err) => {
    if (err) throw err;

    const sql = "DELETE FROM descriptions WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    });
  });
});


module.exports = router;
