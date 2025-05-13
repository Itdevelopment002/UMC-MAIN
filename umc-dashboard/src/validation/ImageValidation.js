/**
 * Validates image files with strict checks
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateImageFile = (file) => {
  if (!file) return false;
 
  // Allowed extensions (case insensitive)
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
 
  // Get file name and convert to lowercase
  const fileName = file.name.toLowerCase();
 
  // Check for null bytes in filename (indicates potential attack)
  if (fileName.includes('%00')) {
    return false;
  }
 
  // Check for double/triple extensions
  const parts = fileName.split('.');
  if (parts.length > 2) { // More than one dot means multiple extensions
    return false;
  }
 
  // Get the actual extension (last part after dot)
  const extension = '.' + parts.pop();
 
  // Check if extension is allowed
  return allowedExtensions.includes(extension);
};
 
/**
 * Gets a user-friendly error message for image validation
 * @param {File} file - The file to check
 * @returns {string} - Error message if invalid, empty string if valid
 */
export const getImageValidationError = (file) => {
  if (!file) return "Image is required";
 
  if (!validateImageFile(file)) {
    return "Only JPG, JPEG, or PNG files are allowed. Files with multiple extensions or null bytes are not allowed.";
  }
 
  return "";
};