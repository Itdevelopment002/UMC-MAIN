const path = require('path');

// Allowed image extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

/**
 * Validates image files with strict checks
 * @param {Object} file - The file to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  // Get file name and convert to lowercase
  const fileName = file.originalname.toLowerCase();

  // Check for null bytes in filename (indicates potential attack)
  if (fileName.includes('%00') || fileName.includes('\0')) {
    return { isValid: false, error: "Invalid filename (null bytes detected)" };
  }

  // Check for double/triple extensions
  const parts = fileName.split('.');
  if (parts.length > 2) {
    return { isValid: false, error: "Files with multiple extensions are not allowed" };
  }

  // Get the actual extension (last part after dot)
  const extension = '.' + parts.pop();

  // Check if extension is allowed
  if (!allowedExtensions.includes(extension)) {
    return { isValid: false, error: `Only ${allowedExtensions.join(', ')} files are allowed` };
  }

  return { isValid: true };
};

module.exports = {
  validateImageFile,
  allowedExtensions,
  maxFileSize
};