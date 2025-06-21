const { body, validationResult } = require("express-validator");

// ✅ Regex rules
const nameRegex = /^[A-Za-z\u0900-\u097F\s.]+$/;
const designationRegex = /^[A-Za-z\u0900-\u097F\s.(),-]+$/;
const menuNameRegex = /^[A-Za-z\u0900-\u097F\u0966-\u096F0-9.&\s]+$/;

// ✅ Min/Max length constants
const minNameLength = 3;
const maxNameLength = 30;

const minDesignationLength = 3;
const maxDesignationLength = 80;

const minMenuNameLength = 3;
const maxMenuNameLength = 50;

const minSubMenuNameLength = 3;
const maxSubMenuNameLength = 50;

// ✅ URL/Path Validation Helper
const validateUrlOrPath = (value) => {
    if (value === '#' || value === '/#' || value === '') {
        return true;
    }
    if (value.startsWith('http://') || value.startsWith('https://')) {
        return /^(http|https):\/\/[^ "]+$/.test(value);
    }
    return /^\/?[a-zA-Z0-9\-_\/#]+(\/[a-zA-Z0-9\-_\/#]+)*$/.test(value);
};

// ✅ Reusable Validators
const alphabetOnlyValidator = (field, min, max, label, regex) =>
    body(field)
        .trim()
        .notEmpty().withMessage(`${label} is required`)
        .bail()
        .isLength({ min, max }).withMessage(`${label} must be between ${min} and ${max} characters`)
        .bail()
        .matches(regex).withMessage(`${label} must contain only valid characters`);

const menuNameValidator = (field, min, max, label) =>
    body(field)
        .trim()
        .notEmpty().withMessage(`${label} is required`)
        .bail()
        .isLength({ min, max }).withMessage(`${label} must be between ${min} and ${max} characters`)
        .bail()
        .matches(menuNameRegex).withMessage(`${label} contains invalid characters`);

const urlValidator = (field, label) =>
    body(field)
        .optional()
        .trim()
        .custom(validateUrlOrPath)
        .withMessage(`${label} must be a valid URL (https://example.com), path (/path), or hash (# or /#)`);

const languageCodeValidator = (field = "language_code") =>
    body(field)
        .trim()
        .notEmpty().withMessage("Language code is required")
        .bail()
        .isLength({ max: 10 }).withMessage("Language code must be under 10 characters");

const arrayValidator = (field, label) =>
    body(field)
        .isArray({ min: 1 }).withMessage(`${label} must be an array with at least one item`);

// ✅ Request Validator Handler
function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));

        return res.status(400).json({
            success: false,
            errors: formattedErrors,
        });
    }
    next();
}

// ✅ Minister Details Validation
const validateMinisterDetails = [
    alphabetOnlyValidator("name", minNameLength, maxNameLength, "Name", nameRegex),
    alphabetOnlyValidator("designation", minDesignationLength, maxDesignationLength, "Designation", designationRegex),
    languageCodeValidator(),
    validateRequest,
];

// ✅ Main Menu Validation
const validateAddMainMenu = [
    arrayValidator("menuItems", "Menu items"),
    body("menuItems.*.mainMenu")
        .trim()
        .notEmpty().withMessage("Main menu name is required")
        .bail()
        .isLength({ min: minMenuNameLength, max: maxMenuNameLength })
        .withMessage(`Main menu name must be between ${minMenuNameLength} and ${maxMenuNameLength} characters`)
        .bail()
        .matches(menuNameRegex).withMessage("Main menu name contains invalid characters"),
    urlValidator("menuItems.*.mainMenuLink", "Main menu link"),
    languageCodeValidator("menuItems.*.language_code"),
    body("menuItems.*.subMenus").optional().isArray(),
    body("menuItems.*.subMenus.*.subMenu")
        .if(body("menuItems.*.subMenus").exists())
        .trim()
        .notEmpty().withMessage("Sub menu name is required")
        .bail()
        .isLength({ min: minSubMenuNameLength, max: maxSubMenuNameLength })
        .withMessage(`Sub menu name must be between ${minSubMenuNameLength} and ${maxSubMenuNameLength} characters`)
        .bail()
        .matches(menuNameRegex).withMessage("Sub menu name contains invalid characters"),
    urlValidator("menuItems.*.subMenus.*.subLink", "Sub menu link"),
    languageCodeValidator("menuItems.*.subMenus.*.language_code"),
    validateRequest,
];

const validateUpdateMainMenu = [
    menuNameValidator("mainMenu", minMenuNameLength, maxMenuNameLength, "Main menu name"),
    urlValidator("mainMenuLink", "Main menu link"),
    languageCodeValidator(),
    body("subMenus").optional().isArray(),
    body("subMenus.*.subMenu")
        .if(body("subMenus").exists())
        .trim()
        .notEmpty().withMessage("Sub menu name is required")
        .bail()
        .isLength({ min: minSubMenuNameLength, max: maxSubMenuNameLength })
        .withMessage(`Sub menu name must be between ${minSubMenuNameLength} and ${maxSubMenuNameLength} characters`)
        .bail()
        .matches(menuNameRegex).withMessage("Sub menu name contains invalid characters"),
    urlValidator("subMenus.*.subLink", "Sub menu link"),
    languageCodeValidator("subMenus.*.language_code"),
    validateRequest,
];

// ✅ User Validation
const validateUserDetails = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .bail()
        .isLength({ min: 3, max: 30 }).withMessage("Username must be between 3 and 30 characters")
        .bail()
        .matches(/^[A-Za-z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores")
        .bail()
        .custom(value => {
            if (/\s/.test(value)) {
                throw new Error("Username cannot contain spaces");
            }
            return true;
        }),

    alphabetOnlyValidator("fullname", minNameLength, maxNameLength, "Full name", nameRegex),

    body("role")
        .trim()
        .notEmpty().withMessage("Role is required")
        .bail()
        .isIn(["Superadmin", "Admin"]).withMessage("Invalid role"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .bail()
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required")
        .bail()
        .isLength({ min: 8, max: 100 }).withMessage("Password must be between 6 and 100 characters"),

    body("permission")
        .notEmpty().withMessage("Permission is required"),

    validateRequest,
];


const validateUpdateUserDetails = [
    alphabetOnlyValidator("fullname", minNameLength, maxNameLength, "Full name", nameRegex),

    body("role")
        .trim()
        .notEmpty().withMessage("Role is required")
        .bail()
        .isIn(["Superadmin", "Admin"]).withMessage("Invalid role"),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .bail()
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("permission")
        .notEmpty().withMessage("Permission is required"),

    body("status")
        .trim()
        .notEmpty().withMessage("Status is required")
        .bail()
        .isIn(["Active", "Deactive"]).withMessage("Invalid status"),

    validateRequest,
];

module.exports = {
    validateMinisterDetails,
    validateAddMainMenu,
    validateUpdateMainMenu,
    validateUserDetails,
    validateUpdateUserDetails,
};