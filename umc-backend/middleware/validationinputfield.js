// middleware/validators.js
const { body, validationResult } = require("express-validator");

// Admin Validation
const validateInputField = [

    body("language_code")
        .optional()
        .trim()
        .notEmpty().withMessage("Language code is required")
        .isLength({ max: 10 }).withMessage("Language code must be under 10 characters"),
    body("name")
        .optional()
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 100 }).withMessage("Name must be under 100 characters"),

    body("designation")
        .optional()
        .trim()
        .notEmpty().withMessage("Designation is required")
        .isLength({ max: 100 }).withMessage("Designation must be under 100 characters"),

    body("phone")
        .optional()
        .trim()
        .notEmpty().withMessage("Phone number is required")
        .isNumeric().withMessage("Phone must be a number")
        .isLength({ min: 10, max: 15 }).withMessage("Phone number must be 10-15 digits"),

    body("Department_Name")
        .optional()
        .trim()
        .notEmpty().withMessage("Department Name is required")
        .isLength({ max: 100 }),

    body("Agenda_No_Date")
        .optional()
        .trim()
        .notEmpty().withMessage("Agenda No/Date is required")
        .isLength({ max: 100 }),

    body("Schedule_Date_of_Meeting")
        .optional()
        .trim()
        .notEmpty().withMessage("Schedule Date of Meeting is required")
        .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage("Date must be in dd-mm-yyyy format"),

    body("Adjournment_Notice")
        .optional()
        .trim()
        .isLength({ max: 200 }),

    body("language_code")
        .optional()
        .trim()
        .notEmpty().withMessage("Language code is required")
        .isLength({ max: 10 }),

    body("pdf_link")
        .optional()
        .isURL().withMessage("PDF Link must be a valid URL"),

    validateRequest,
];

// Helper: Validate Request and Handle Errors
function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => {
            console.error(`Field "${err.path}": ${err.msg}`); // Logs in console
            return {
                field: err.path,
                message: err.msg
            };
        });

        return res.status(400).json({
            success: false,
            errors: formattedErrors,
        });
    }
    next();
}

module.exports = {
    validateInputField,
};
