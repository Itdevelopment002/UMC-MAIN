// const express = require("express");
// const router = express.Router();
// const db = require("../config/db.js");

// router.get("/asst-commissioner-desc", (req, res) => {
//   const language = req.query.lang;
//   let query;
//   let params = [];
//   if (language) {
//     query = `SELECT * FROM asst_commissioner_desc WHERE language_code = ?`;
//     params.push(language);
//   } else {
//     query = "SELECT * FROM asst_commissioner_desc";
//   }

//   db.query(query, params, (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });


// router.get("/asst-commissioner-desc/:id", (req, res) => {
//   const { id } = req.params;
//   const sql = "SELECT * FROM asst_commissioner_desc WHERE id = ?";
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     if (result.length === 0) {
//       return res.status(404).json({ message: "Assistant Commissioner Description not found" });
//     }
//     res.status(200).json(result[0]);
//   });
// });


// router.post("/asst-commissioner-desc", (req, res) => {
//   const { description, language_code } = req.body;
//   if (!description || !language_code) {
//     return res.status(400).json({ message: "Description is required" });
//   }
//   const sql = "INSERT INTO asst_commissioner_desc (description, language_code) VALUES (?, ?)";
//   db.query(sql, [description, language_code], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     res
//       .status(201)
//       .json({
//         message: "Assistant Commissioner Description added successfully",
//         historyId: result.insertId,
//       });
//   });
// });


// router.put("/asst-commissioner-desc/:id", (req, res) => {
//   const { id } = req.params;
//   const { description, language_code } = req.body;
//   const sql = "UPDATE asst_commissioner_desc SET description = ?, language_code = ? WHERE id = ?";
//   db.query(sql, [description, language_code, id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Assistant Commissioner Description not found" });
//     }
//     res.status(200).json({ message: "Assistant Commissioner Description updated successfully" });
//   });
// });


// router.delete("/asst-commissioner-desc/:id", (req, res) => {
//   const { id } = req.params;
//   const sql = "DELETE FROM asst_commissioner_desc WHERE id = ?";
//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Database error", error: err });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Assistant Commissioner Description not found" });
//     }
//     res.status(200).json({ message: "Assistant Commissioner Description deleted successfully" });
//   });
// });


// module.exports = router;


const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.get("/asst-commissioner-desc", (req, res) => {
  const { lang, commissioner } = req.query;
  let query = "SELECT * FROM asst_commissioner_desc";
  let params = [];

  if (lang && commissioner) {
    query += " WHERE language_code = ? AND commissioner_name = ?";
    params.push(lang, commissioner);
  } else if (lang) {
    query += " WHERE language_code = ?";
    params.push(lang);
  } else if (commissioner) {
    query += " WHERE commissioner_name = ?";
    params.push(commissioner);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

router.get("/asst-commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM asst_commissioner_desc WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Assistant Commissioner description not found" });
    }
    res.status(200).json(result[0]);
  });
});

router.post("/asst-commissioner-desc", (req, res) => {
  const { description, language_code, commissioner_name } = req.body;
  
  if (!description || !language_code || !commissioner_name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO asst_commissioner_desc 
    (commissioner_name, description, language_code) 
    VALUES (?, ?, ?)
  `;
  
  db.query(sql, [commissioner_name, description, language_code], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ 
      message: "Assistant Commissioner description added successfully",
      id: result.insertId 
    });
  });
});

router.put("/asst-commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const { description, language_code, commissioner_name } = req.body;
  
  const sql = `
    UPDATE asst_commissioner_desc 
    SET commissioner_name = ?, description = ?, language_code = ?
    WHERE id = ?
  `;
  
  db.query(sql, [commissioner_name, description, language_code, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Assistant Commissioner description not found" });
    }
    res.status(200).json({ message: "Assistant Commissioner description updated successfully" });
  });
});

router.delete("/asst-commissioner-desc/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM asst_commissioner_desc WHERE id = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Assistant Commissioner description not found" });
    }
    res.status(200).json({ message: "Assistant Commissioner description deleted successfully" });
  });
});

module.exports = router;