// const validator = require('validator');

// const sanitizeInput = (req, res, next) => {
//   // Only process POST requests
//   if (req.method !== 'POST') {
//     return next();
//   }

//   // Skip if it's a file upload (we'll handle this in routes)
//   if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
//     return next();
//   }

//   const htmlTagRegex = /<[^>]*>/g;
//   const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
//   const sqlInjectionRegex = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER)\b)|('|--|;)/i;
//   const errors = [];

//   // Validate request body (excluding file upload fields)
//   if (req.body) {
//     for (const key in req.body) {
//       // Skip validation for file upload fields (they'll be handled by multer)
//       if (key === 'image' || key === 'file' || key === 'upload') {
//         continue;
//       }

//       if (typeof req.body[key] === "string") {
//         const value = req.body[key].trim();
        
//         // Check for HTML/script tags
//         if (htmlTagRegex.test(value) || scriptRegex.test(value)) {
//           errors.push(`Invalid input in field "${key}": HTML or script tags are not allowed.`);
//         }

//         // Check for SQL injection patterns
//         if (sqlInjectionRegex.test(value)) {
//           errors.push(`Invalid input in field "${key}": SQL injection patterns detected.`);
//         }

//         // Sanitize the input
//         req.body[key] = validator.escape(value);
//       }
//     }
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({ 
//       message: "Security validation failed",
//       errors: errors,
//       timestamp: new Date().toISOString()
//     });
//   }

//   next();
// };

// module.exports = sanitizeInput;


const validator = require('validator');

const sanitizeInput = (req, res, next) => {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) {
    return next();
  }

  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const dangerousHtmlRegex = /<(?!\/|\!-)[^>]*>/g; // Allows closing tags and comments
  const errors = [];

  const sanitizeField = (value, fieldName) => {
    if (typeof value !== "string") return value;

    // Check for script tags
    if (scriptRegex.test(value)) {
      errors.push(`Invalid input in field "${fieldName}": Script tags are not allowed.`);
      return false;
    }

    // Check for dangerous HTML (but allow simple closing tags)
    if (dangerousHtmlRegex.test(value)) {
      errors.push(`Invalid input in field "${fieldName}": HTML tags are not allowed.`);
      return false;
    }

    // Custom escape function that preserves forward slashes
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
      // Note: intentionally not escaping forward slashes
  };

  if (req.body) {
    for (const key in req.body) {
      if (key === 'menuItems' && Array.isArray(req.body.menuItems)) {
        req.body.menuItems = req.body.menuItems.map(item => ({
          ...item,
          mainMenu: sanitizeField(item.mainMenu, 'mainMenu'),
          mainMenuLink: sanitizeField(item.mainMenuLink, 'mainMenuLink'),
          language_code: sanitizeField(item.language_code, 'language_code'),
          subMenus: item.subMenus?.map(sub => ({
            subMenu: sanitizeField(sub.subMenu, 'subMenu'),
            subLink: sanitizeField(sub.subLink, 'subLink'),
            language_code: sanitizeField(sub.language_code, 'language_code')
          }))
        }));
      } else if (key === 'subMenus' && Array.isArray(req.body.subMenus)) {
        req.body.subMenus = req.body.subMenus.map(sub => ({
          subMenu: sanitizeField(sub.subMenu, 'subMenu'),
          subLink: sanitizeField(sub.subLink, 'subLink'),
          language_code: sanitizeField(sub.language_code, 'language_code')
        }));
      } else {
        req.body[key] = sanitizeField(req.body[key], key);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      message: "Security validation failed",
      errors: errors,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

module.exports = sanitizeInput;