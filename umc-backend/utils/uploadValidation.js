// const multer = require('multer');
// const path = require('path');

// // Validation function matching client-side
// const validateImageFile = (file) => {
//   if (!file) return false;

//   // Allowed extensions (case insensitive)
//   const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

//   // Get file name and convert to lowercase
//   const fileName = file.originalname.toLowerCase();

//   // Check for null bytes in filename (indicates potential attack)
//   if (fileName.includes('%00')) {
//     return false;
//   }

//   // Check for double/triple extensions
//   const parts = fileName.split('.');
//   if (parts.length > 2) { // More than one dot means multiple extensions
//     return false;
//   }
  

//   // Get the actual extension (last part after dot)
//   const extension = '.' + parts.pop();

//   // Check if extension is allowed
//   return allowedExtensions.includes(extension);
// };

// // Custom file filter for multer
// const fileFilter = (req, file, cb) => {
//   if (!validateImageFile(file)) {
//     return cb(new Error('Only JPG, JPEG, PNG or WEBP files are allowed. Files with multiple extensions or null bytes are not allowed.'), false);
//   }
//   cb(null, true);
// };

// // Multer configuration generator
// const getMulterConfig = (options = {}) => {
//   const defaults = {
//     storage: multer.diskStorage({
//       destination: (req, file, cb) => {
//         cb(null, "uploads/");
//       },
//       filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//       },
//     }),
//     fileFilter,
//     limits: {
//       fileSize: 5 * 1024 * 1024 // 5MB limit
//     }
//   };

//   return { ...defaults, ...options };
// };

// // Error handling middleware for multer
// const handleMulterError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ message: err.message });
//   } else if (err) {
//     return res.status(400).json({ message: err.message });
//   }
//   next();
// };

// module.exports = {
//   validateImageFile,
//   fileFilter,
//   getMulterConfig,
//   handleMulterError
// };


const multer = require('multer');
const path = require('path');
 
// Allowed extensions and MIME types
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
 
// Filename and extension validation
const validateImageFile = (file) => {
  if (!file) return false;
 
  const fileName = file.originalname.toLowerCase();
 
  // Prevent null bytes
  if (fileName.includes('%00') || fileName.includes('\0')) {
    return false;
  }
 
  // Extract extension and check for multiple dots
  const parts = fileName.split('.');
  if (parts.length > 2) {
    return false; // Double/triple extensions not allowed
  }
 
  const ext = '.' + parts.pop();
  if (!allowedExtensions.includes(ext)) {
    return false;
  }
 
  // Validate mimetype as an additional safety check
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return false;
  }
 
  return true;
};
 
// Custom file filter
const fileFilter = (req, file, cb) => {
  if (!validateImageFile(file)) {
    return cb(new Error('Only valid image files (JPG, JPEG, PNG, WEBP) are allowed. Double extensions or invalid types are rejected.'), false);
  }
  cb(null, true);
};
 
// Use diskStorage (as requested)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + ext);
  }
});
 
// Multer configuration
const getMulterConfig = (options = {}) => {
  const defaults = {
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  };
 
  return { ...defaults, ...options };
};
 
// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};
 
module.exports = {
  validateImageFile,
  fileFilter,
  getMulterConfig,
  handleMulterError,
};