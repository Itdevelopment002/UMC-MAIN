const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken } = require('../middleware/jwtMiddleware.js');


router.get("/department-description", (req, res) => {
  const language = req.query.lang;

  let sql = `
    SELECT 
      d.id, 
      d.department, 
      d.description, 
      d.language_code,
      IFNULL(GROUP_CONCAT(s.sub_description ORDER BY s.id SEPARATOR '||'), '') AS subDescriptions
    FROM deptdescription d
    LEFT JOIN dept_subdescription s ON d.id = s.dept_id
  `;

  const params = [];

  if (language) {
    sql += ` WHERE d.language_code = ?`;
    params.push(language);
  }

  sql += ` GROUP BY d.id, d.department, d.description, d.language_code`;

  db.query("SET SESSION group_concat_max_len = 100000", () => {
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const processedResults = results.map(item => ({
        ...item,
        subDescriptions: item.subDescriptions ? item.subDescriptions.split("||") : []
      }));

      res.json(processedResults);
    });
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


router.post("/department-description", verifyToken, (req, res) => {
  const { department, description, subDescriptions, language_code } = req.body;

  if (req.user?.role !== "Superadmin") {
    const allowedDepartments = req.user?.permission?.split(",") || [];
    const trimmedDepartments = allowedDepartments.map((d) => d.trim());

    if (!trimmedDepartments.includes(department)) {
      return res.status(403).json({
        message: `Access denied: You don't have permission to upload for '${department}' description.`,
      });
    }
  }

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


router.post("/edit-department-description/:id", verifyToken, (req, res) => {
  const { department, description, subDescriptions, language_code } = req.body;
  if (req.user?.role !== "Superadmin") {
    const allowedDepartments = req.user?.permission?.split(",").map(p => p.trim()) || [];
    if (!allowedDepartments.includes(department)) {
      return res.status(403).json({
        message: `Access denied: You don't have permission to edit '${department}' description.`,
      });
    }
  }
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

router.post("/delete-department-description/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const user = req.user;

  // First fetch the department name using the ID
  const fetchDepartmentSql = "SELECT department FROM deptdescription WHERE id = ?";
  db.query(fetchDepartmentSql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Department not found" });

    const department = result[0].department;

    // Permission check
    if (req.user?.role !== "Superadmin") {
      const allowedDepartments = req.user?.permission?.split(",").map(p => p.trim()) || [];
      if (!allowedDepartments.includes(department)) {
        return res.status(403).json({ message: `Access denied: You don't have permission to delete '${department}' description.` });
      }
    }

    // First delete sub-descriptions
    const deleteSubDescriptionsSql = "DELETE FROM dept_subdescription WHERE dept_id = ?";
    db.query(deleteSubDescriptionsSql, [id], (err) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      // Then delete the main department description
      const deleteDeptSql = "DELETE FROM deptdescription WHERE id = ?";
      db.query(deleteDeptSql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        res.json({ success: true, message: "Department description deleted successfully" });
      });
    });
  });
});



module.exports = router;
