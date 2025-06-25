const { body, validationResult } = require("express-validator");

// Regex rules
const nameRegex = /^[A-Za-z\u0900-\u097F\s().]+$/;
const designationRegex = /^[A-Za-z\u0900-\u097F\s.(),-]+$/;
const menuNameRegex = /^[A-Za-z\u0900-\u097F\u0966-\u096F0-9.&\s]+$/;
const descriptionRegex = /^[A-Za-z\u0900-\u097F\u0966-\u096F0-9\s.,()'"‘’“”—–_+%\-:\/।\[\]&]+$/;
const phoneRegex = /^[0-9\u0966-\u096F+\-()/\s]+$/;
const departmentRegex = /^[A-Za-z\u0900-\u097F\s.&]+$/;


// Min/Max length constants
const minNameLength = 3;
const maxNameLength = 40;

const minDesignationLength = 3;
const maxDesignationLength = 80;

const minMenuNameLength = 3;
const maxMenuNameLength = 50;

const minSubMenuNameLength = 3;
const maxSubMenuNameLength = 50;

const minDescriptionLength = 3;
const maxDescriptionLength = 1000;

const minHeadingLength = 3;
const maxHeadingLength = 300;

const minPhoneNumberLength = 5;
const maxPhoneNumberLength = 20;

const minDepartmentLength = 5;
const maxDepartmentLength = 100;


// URL/Path Validation Helper
const validateUrlOrPath = (value) => {
    if (value === '#') {
        return true;
    }
    // Improved full URL pattern
    if (value.startsWith('http://') || value.startsWith('https://')) {
        return /^(https?:\/\/)[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/i.test(value);
    }
    // Internal paths
    return /^\/[a-zA-Z0-9\-_/#&]*$/.test(value);
};

// Alphabet-only validator with '-' allowed as exception
const alphabetOnlyValidator = (field, min, max, label, regex) =>
    body(field)
        .trim()
        .notEmpty().withMessage(`${label} is required`)
        .bail()
        .custom((value) => {
            if (value === '-') return true;
            if (value.length < min || value.length > max) {
                throw new Error(`${label} must be between ${min} and ${max} characters`);
            }
            return true;
        })
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
        .trim()
        .custom(validateUrlOrPath)
        .withMessage(`${label} must be a valid URL (https://example.com), path (/path), or hash (# or /#)`);

const languageCodeValidator = (field) =>
    body(field)
        .trim()
        .notEmpty().withMessage("Language code is required")
        .bail()
        .isLength({ max: 10 }).withMessage("Language code must be under 10 characters");

const arrayValidator = (field, label) =>
    body(field)
        .isArray({ min: 1 }).withMessage(`${label} must be an array with at least one item`);

const phoneNumberValidator = (field, min, max, label, regex) =>
    body(field)
        .trim()
        .notEmpty().withMessage(`${label} is required`)
        .bail()
        .custom((value) => {
            if (value === '-' || value.trim() === '-') {
                return true;
            }
            if (value.length < min || value.length > max) {
                throw new Error(`${label} must be between ${min} and ${max} characters`);
            }

            return true;
        })
        .bail()
        .matches(regex).withMessage(`${label} must be a valid phone number. Allowed: digits, +, -, space, (), 5–20 characters.`);

const issueDateValidator = (field) =>
    body(field)
        .notEmpty().withMessage(`Issue date is required`)


// Request Validator Handler
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


// Main Menu Validation
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
    validateRequest,
];
const validateUpdateMainMenu = [
    menuNameValidator("mainMenu", minMenuNameLength, maxMenuNameLength, "Main menu name"),
    urlValidator("mainMenuLink", "Main menu link"),
    languageCodeValidator("language_code"),
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
    validateRequest,
];

// Minister Details Validation
const validateMinisterDetails = [
    alphabetOnlyValidator("name", minNameLength, maxNameLength, "Minister Name", nameRegex),
    alphabetOnlyValidator("designation", minDesignationLength, maxDesignationLength, "Designation", designationRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// slider Validation
const validateAddSlider = [
    alphabetOnlyValidator("sliderName", minNameLength, maxNameLength, "Slider Name", nameRegex),
    languageCodeValidator("languageCode"),
    validateRequest,
];
const validateUpdateSlider = [
    alphabetOnlyValidator("name", minNameLength, maxNameLength, "Slider Name", nameRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Current Update Validation
const validateCurrentUpdate = [
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Description", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// UMC News Validation
const validateUMCNews = [
    alphabetOnlyValidator("heading", minDescriptionLength, maxDescriptionLength, "News Heading", descriptionRegex),
    urlValidator("link", "News Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Initiative Programme Validation
const validateInitiativeProgram = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Initiative Heading", descriptionRegex),
    urlValidator("link", "Initiative Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Employee Info Validation
const validateEmployeeInfo = [
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Emp Info Description", descriptionRegex),
    urlValidator("link", "Emp Info Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Eservices Validation
const validateEServices = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Service Heading", descriptionRegex),
    urlValidator("link", "Service Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Information Validation
const validateInformation = [
    alphabetOnlyValidator("heading", minDescriptionLength, maxDescriptionLength, "Information Heading", descriptionRegex),
    urlValidator("link", "Information Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Citizen Services Validation
const validateCitizenServices = [
    alphabetOnlyValidator("serviceHeading", minMenuNameLength, maxMenuNameLength, "Service Heading", menuNameRegex),
    urlValidator("serviceLink", "Service Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Home Video validation
const validateHomeVideo = [
    urlValidator("videoUrl", "Video url"),
    validateRequest,
];
const validateUpdateHomeVideo = [
    urlValidator("video_url", "Video url"),
    validateRequest,
];

// Home Gallery Validation
const validateHomeGalleryAdd = [
    alphabetOnlyValidator("photoName", minNameLength, maxNameLength, "Photo Gallery Name", nameRegex),
    validateRequest,
];
const validateHomeGalleryupdate = [
    alphabetOnlyValidator("photo_name", minNameLength, maxNameLength, "Photo Gallery Name", nameRegex),
    validateRequest,
];

// Citizen Communication Validation
const validatePortalServices = [
    alphabetOnlyValidator("heading", minMenuNameLength, maxMenuNameLength, "Service Heading ", menuNameRegex),
    alphabetOnlyValidator("description", minMenuNameLength, maxMenuNameLength, "Service Description", menuNameRegex),
    urlValidator("link", "Service Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Emergency Services Validation
const validateEmergencyServices = [
    alphabetOnlyValidator("heading", minMenuNameLength, maxMenuNameLength, "Service Heading", menuNameRegex),
    phoneNumberValidator("number", minPhoneNumberLength, maxPhoneNumberLength, "Service Number", phoneRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Home Services1 Validation
const validateHomeServices1 = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Service Heading", descriptionRegex),
    urlValidator("link", "Service Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Home Services2 Validation
const validateHomeServices2 = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Service Heading", descriptionRegex),
    urlValidator("link", "Service Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Bottom Slider Validation
const validateBottomSlider = [
    urlValidator("websitelink", "Slider Link"),
    validateRequest,
];

// Solid Waste Management System Validation
const validateSolidWasteMantSystem = [
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Swms Description", descriptionRegex),
    urlValidator("link", "Swms Link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Press Note Validation
const validatePressNotes = [
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Description", descriptionRegex),
    urlValidator("link", "Link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Property Tax Department Validation
const validatePropertyTaxDept = [
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Description", descriptionRegex),
    urlValidator("link", "Link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Location Validation
const validateLocationInfo = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Title", descriptionRegex),
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Description", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// All Commissioner Data Validation
const validateCommissionerData = [
    alphabetOnlyValidator("coName", minNameLength, maxNameLength, "Commissioner Name", nameRegex),
    alphabetOnlyValidator("designation", minDesignationLength, maxDesignationLength, "Designation", designationRegex),
    alphabetOnlyValidator("qualification", minHeadingLength, maxHeadingLength, "Education Qualification", descriptionRegex),
    alphabetOnlyValidator("address", minHeadingLength, maxHeadingLength, "Office Address", descriptionRegex),
    phoneNumberValidator("number", minPhoneNumberLength, maxPhoneNumberLength, "Phone Number", phoneRegex),
    alphabetOnlyValidator("email", minHeadingLength, maxHeadingLength, "Email Address", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

//  Commissioner Description Validation
const validateCommissionerDesc = [
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Commissioner Description", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Additional, Deputy, Assistant Commissioner description Validation
const validateaddCommissionerDesc = [
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Commissioner Description", descriptionRegex),
    alphabetOnlyValidator("commissioner_name", minNameLength, maxNameLength, "Commissioner Name", nameRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// History Validation
const validateHistoryImage = [
    alphabetOnlyValidator("photo_name", minNameLength, maxNameLength, "Image Name", nameRegex),
    validateRequest,
];
const validateHistoryDescription = [
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "History Description", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Tourism Validation
const validateTourism = [
    alphabetOnlyValidator("name", minHeadingLength, maxHeadingLength, "Site Name", descriptionRegex),
    alphabetOnlyValidator("address", minHeadingLength, maxHeadingLength, "Site Address", descriptionRegex),
    alphabetOnlyValidator("hours", minHeadingLength, maxHeadingLength, "Open Hour", descriptionRegex),
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Site Description", descriptionRegex),
    urlValidator("locationLink", "Location Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Administrative Structure Validation
const validateTableHeading = [
    alphabetOnlyValidator("tablename", minHeadingLength, maxHeadingLength, "Table Name", descriptionRegex),
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Heading Name", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];
const validatestructuretab1 = [
    alphabetOnlyValidator("heading1", minHeadingLength, maxHeadingLength, "Heading 1", descriptionRegex),
    alphabetOnlyValidator("heading2", minHeadingLength, maxHeadingLength, "Heading 2", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];
const validatestructuretab2 = [
    alphabetOnlyValidator("heading1", minHeadingLength, maxHeadingLength, "Heading 1", descriptionRegex),
    alphabetOnlyValidator("heading2", minHeadingLength, maxHeadingLength, "Heading 2", descriptionRegex),
    alphabetOnlyValidator("heading3", minHeadingLength, maxHeadingLength, "Heading 3", descriptionRegex),
    alphabetOnlyValidator("heading4", minHeadingLength, maxHeadingLength, "Heading 4", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];
const validatestructuretab4 = [
    alphabetOnlyValidator("ward", 1, maxHeadingLength, "Ward Committee No.", phoneRegex),
    alphabetOnlyValidator("officer", minHeadingLength, maxHeadingLength, "Officer Name", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Administration Validation
const validateAdministration = [
    alphabetOnlyValidator("name", minNameLength, maxNameLength, "Name", nameRegex),
    alphabetOnlyValidator("designation", minDesignationLength, maxDesignationLength, "Designation", designationRegex),
    phoneNumberValidator("phone", minPhoneNumberLength, maxPhoneNumberLength, "Phone Number", phoneRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Annual Financial Statement Validation
const validateAnnual = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Heading", descriptionRegex),
    urlValidator("link", "Link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Elected Member Validation
const validateElected = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Heading", descriptionRegex),
    urlValidator("link", "Pdf link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// e-News Letter Validation
const validateEnews = [
    alphabetOnlyValidator("info", minHeadingLength, maxHeadingLength, "Information", descriptionRegex),
    urlValidator("pdf_link", "Pdf link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Municipal Meeting Validation
const validateMunicipal = [
    alphabetOnlyValidator("name", minDepartmentLength, maxDepartmentLength, "Meeting Name", departmentRegex),
    alphabetOnlyValidator("year", minDescriptionLength, maxDescriptionLength, "Year", descriptionRegex),
    urlValidator("pdf_link1", "Pdf link 1"),
    urlValidator("pdf_link2", "Pdf link 2"),
    urlValidator("pdf_link3", "Pdf link 3"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// UMC Agenda Validation
const validateAgenda = [
    alphabetOnlyValidator("Department_Name", minDepartmentLength, maxDepartmentLength, "Department name", departmentRegex),
    alphabetOnlyValidator("Agenda_No_Date", minHeadingLength, maxHeadingLength, "Agenda No/Date", descriptionRegex),
    alphabetOnlyValidator("Adjournment_Notice", minHeadingLength, maxHeadingLength, "Adjournment Notice", descriptionRegex),
    urlValidator("pdf_link", "Pdf link"),
    issueDateValidator("Schedule_Date_of_Meeting"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// UMC Budget Validation
const validateBudget = [
    alphabetOnlyValidator("year", minHeadingLength, maxHeadingLength, "Year", descriptionRegex),
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Heading", descriptionRegex),
    urlValidator("link", "Pdf link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// UMC Committee (Standing / Women and child Welfare Committee) Validation
const validateCommittee = [
    alphabetOnlyValidator("heading", minNameLength, maxNameLength, "Member Name", nameRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// UMC Committee (Ward Committee) Validation
const validateWardCommittee = [
    alphabetOnlyValidator("ward", minHeadingLength, maxHeadingLength, "Ward Name", descriptionRegex),
    alphabetOnlyValidator("heading", minNameLength, maxNameLength, "Member Name", nameRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// UMC Policies Validation
const validatePolicies = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Heading", descriptionRegex),
    urlValidator("link", "Pdf link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// UMC Resolution Validation
const validateResolution = [
    alphabetOnlyValidator("Department_Name", minDepartmentLength, maxDepartmentLength, "Department name", departmentRegex),
    alphabetOnlyValidator("Resolutions_No_Date", minHeadingLength, maxHeadingLength, "Resolution No/Date", descriptionRegex),
    alphabetOnlyValidator("Adjournment_Notice", minHeadingLength, maxHeadingLength, "Adjournment Notice", descriptionRegex),
    urlValidator("pdf_link", "Pdf link"),
    issueDateValidator("Schedule_Date_of_Meeting"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Ward Office Validation
const validateWardOffice = [
    alphabetOnlyValidator("ward_no", minHeadingLength, maxHeadingLength, "Ward no.", descriptionRegex),
    alphabetOnlyValidator("ward_name", minHeadingLength, maxHeadingLength, "Ward Name", descriptionRegex),
    alphabetOnlyValidator("officer_name", minHeadingLength, maxHeadingLength, "Officer Name", nameRegex),
    alphabetOnlyValidator("areas", minHeadingLength, maxHeadingLength, "Area", descriptionRegex),
    alphabetOnlyValidator("address", minHeadingLength, maxHeadingLength, "Office Address", descriptionRegex),
    alphabetOnlyValidator("email", minHeadingLength, maxHeadingLength, "Email Address", descriptionRegex),
    phoneNumberValidator("mobile", minPhoneNumberLength, maxPhoneNumberLength, "Phone Number", phoneRegex),
    phoneNumberValidator("landline", minPhoneNumberLength, maxPhoneNumberLength, "Landline", phoneRegex),
    urlValidator("map_url", "Iframe Src"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Department Validation
const validateDepartment = [
    alphabetOnlyValidator("heading", minDepartmentLength, maxDepartmentLength, "Department name", departmentRegex),
    urlValidator("link", "Department link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Department Banner Validation
const validateDeptBanner = [
    alphabetOnlyValidator("departmentName", minDepartmentLength, maxDepartmentLength, "Department name", departmentRegex),
    validateRequest,
];
const validateUpdateDeptBanner = [
    alphabetOnlyValidator("name", minDepartmentLength, maxDepartmentLength, "Department name", departmentRegex),
    validateRequest,
];

// Department Description Validation
const validateDeptDescription = [
    alphabetOnlyValidator("department", minDepartmentLength, maxDepartmentLength, "Department name", departmentRegex),
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Department description", descriptionRegex),
    languageCodeValidator("language_code"),
    body("subDescriptions")
        .optional()
        .isArray().withMessage("SubDescriptions must be an array")
        .bail()
        .custom((arr) =>
            arr.every(desc =>
                typeof desc === "string" &&
                desc.length > 0 &&
                descriptionRegex.test(desc)
            )
        )
        .withMessage("Each subDescription must be a non-empty valid string"),
    validateRequest,
];

// HOD Details Validation
const validateDeptHod = [
    alphabetOnlyValidator("department", minNameLength, maxNameLength, "Department name", nameRegex),
    alphabetOnlyValidator("hodName", minHeadingLength, maxHeadingLength, "Hod name", descriptionRegex),
    alphabetOnlyValidator("designation", minDesignationLength, maxDesignationLength, "Designation", designationRegex),
    alphabetOnlyValidator("education", minHeadingLength, maxHeadingLength, "Education qualification", descriptionRegex),
    alphabetOnlyValidator("address", minHeadingLength, maxHeadingLength, "Office Address", descriptionRegex),
    phoneNumberValidator("number", minPhoneNumberLength, maxPhoneNumberLength, "Phone Number", phoneRegex),
    alphabetOnlyValidator("email", minHeadingLength, maxHeadingLength, "Email Address", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];
const validateUpdateDeptHod = [
    alphabetOnlyValidator("department", minNameLength, maxNameLength, "Department name", nameRegex),
    alphabetOnlyValidator("name", minHeadingLength, maxHeadingLength, "Hod name", descriptionRegex),
    alphabetOnlyValidator("designation", minDesignationLength, maxDesignationLength, "Designation", designationRegex),
    alphabetOnlyValidator("education", minHeadingLength, maxHeadingLength, "Education qualification", descriptionRegex),
    alphabetOnlyValidator("address", minHeadingLength, maxHeadingLength, "Office Address", descriptionRegex),
    phoneNumberValidator("number", minPhoneNumberLength, maxPhoneNumberLength, "Phone Number", phoneRegex),
    alphabetOnlyValidator("email", minHeadingLength, maxHeadingLength, "Email Address", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Department PDF Validation
const validateDeptPdf = [
    alphabetOnlyValidator("department", minDepartmentLength, maxDepartmentLength, "Department name", departmentRegex),
    alphabetOnlyValidator("heading", minDescriptionLength, maxDescriptionLength, "Pdf heading", descriptionRegex),
    urlValidator("link", "Pdf link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Audit Report Validation
const validateAuditReport = [
    alphabetOnlyValidator("name", minHeadingLength, maxHeadingLength, "Report name", menuNameRegex),
    alphabetOnlyValidator("year", minHeadingLength, maxHeadingLength, "Year", descriptionRegex),
    urlValidator("pdf_link", "Pdf link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Tenders and Quotations Validation
const validateTender = [
    alphabetOnlyValidator("heading", minDescriptionLength, maxDescriptionLength, "Tender heading", descriptionRegex),
    alphabetOnlyValidator("department", minDepartmentLength, maxDepartmentLength, "Department name", departmentRegex),
    urlValidator("link", "Tender link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Right To Service Validation
const validateRts = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Heading", descriptionRegex),
    urlValidator("link", "Link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Online Services Validation
const validateOnlineServices = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Service name", descriptionRegex),
    urlValidator("link", "Service link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Photo and video Category Validation
const validatePhotoGallery = [
    alphabetOnlyValidator("categoryName", minHeadingLength, maxHeadingLength, "Category Name", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];
const validateUpdatePhotoGallery = [
    alphabetOnlyValidator("name", minHeadingLength, maxHeadingLength, "Category Name", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Video Gallery (Category-wise Videos) Validation
const validateVideoGallery = [
    urlValidator("link", "Video link"),
    validateRequest,
];
const validateUpdateVideoGallery = [
    urlValidator("video_url", "Video link"),
    validateRequest,
];

// Home Projects Validation
const validateHomeProject = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Project Heading", descriptionRegex),
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Project Description", descriptionRegex),
    urlValidator("link", "Project Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Project Category Validation
const validateProjectCategory = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Project Heading", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Project Description Validation
const validateProjectDescription = [
    alphabetOnlyValidator("department", minHeadingLength, maxHeadingLength, "Project Heading", descriptionRegex),
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Project Description", descriptionRegex),
    languageCodeValidator("language_code"),
    body("subDescriptions")
        .optional()
        .isArray().withMessage("SubDescriptions must be an array")
        .bail()
        .custom((arr) =>
            arr.every(desc =>
                typeof desc === "string" &&
                desc.length > 0 &&
                descriptionRegex.test(desc)
            )
        )
        .withMessage("Each subDescription must be a non-empty valid string matching the required format"),
    validateRequest,
];

const validateUpdateProjectDescription = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Project Heading", descriptionRegex),
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Project Description", descriptionRegex),
    languageCodeValidator("language_code"),
    body("subDescriptions")
        .optional()
        .isArray().withMessage("SubDescriptions must be an array")
        .bail()
        .custom((arr) =>
            arr.every(desc =>
                typeof desc === "string" &&
                desc.length > 0 &&
                descriptionRegex.test(desc)
            )
        )
        .withMessage("Each subDescription must be a non-empty valid string matching the required format"),
    validateRequest,
];

// Right to Information / Public Disclosure / Sub RTI Validation
const validateRti = [
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Description", descriptionRegex),
    urlValidator("link", "Link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Recruitment validation
const validateRecruitment = [
    body("heading")
        .trim()
        .notEmpty().withMessage("Heading is required")
        .bail()
        .isIn(["Contract Basis Recruitment", "Old Recruitment"]).withMessage("Invalid heading"),

    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Job Description", descriptionRegex),
    urlValidator("link", "Job Link"),
    issueDateValidator("issue_date"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Banner validation
const validateBanner = [
    body("bannerName")
        .trim()
        .notEmpty().withMessage("Banner Name is required")
        .bail()
        .isLength({ min: 3, max: 50 }).withMessage("Banner Name must be between 3 and 50 characters")
        .bail()
        .matches(/^[A-Za-z\s\-]+$/).withMessage("Banner Name can only contain letters, spaces, and hyphens"),

    validateRequest,
];
const validateUpdateBanner = [
    body("banner_name")
        .trim()
        .notEmpty().withMessage("Banner Name is required")
        .bail()
        .isLength({ min: 3, max: 50 }).withMessage("Banner Name must be between 3 and 50 characters")
        .bail()
        .matches(/^[A-Za-z\s\-]+$/).withMessage("Banner Name can only contain letters, spaces, and hyphens"),

    validateRequest,
];

// Screen Reader Access validation
const validateScreenReader = [
    body("available")
        .trim()
        .notEmpty().withMessage("Availablitiy status is required"),

    body("name")
        .trim()
        .notEmpty().withMessage("Reader name is required")
        .bail()
        .isLength({ min: 3, max: 50 }).withMessage("Reader name must be between 3 and 50 characters")
        .bail()
        .matches(/^[A-Za-z\u0900-\u097F\s\-()]+$/)
        .withMessage("Reader Name can only contain letters, spaces, hyphens, and parentheses"),

    urlValidator("website", "Reader website"),
    languageCodeValidator("language_code"),

    validateRequest,
];

// Screen Reader Access validation
const validateContactUsInfo = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Heading", nameRegex),
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Description", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];
const validateContactUsWard = [
    alphabetOnlyValidator("office", 1, maxHeadingLength, "Ward Office No.", phoneRegex),
    alphabetOnlyValidator("address", minHeadingLength, maxHeadingLength, "Office Address", descriptionRegex),
    phoneNumberValidator("phone", minPhoneNumberLength, maxPhoneNumberLength, "Phone Number", phoneRegex),
    alphabetOnlyValidator("email", minHeadingLength, maxHeadingLength, "Email Id", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Privacy Policy validation
const validatePrivacyPolicy = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Policy Heading", nameRegex),
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Policy Description", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Hyperlink Policy validation
const validateHyperlinkPolicy = [
    alphabetOnlyValidator("description", minDescriptionLength, maxDescriptionLength, "Policy Description", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];

// Footer Validation
const validateFooterContact = [
    alphabetOnlyValidator("name", minNameLength, maxNameLength, "Contact Title", nameRegex),
    alphabetOnlyValidator("designation", minHeadingLength, maxHeadingLength, "Contact Description", descriptionRegex),
    languageCodeValidator("language_code"),
    validateRequest,
];
const validateFooterUpdateContact = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Contact Title", nameRegex),
    alphabetOnlyValidator("description", minHeadingLength, maxHeadingLength, "Contact Description", descriptionRegex),
    languageCodeValidator("language_code"),

    validateRequest,
];

// Quick / Help Links / Online Services Validation
const validateFooter = [
    alphabetOnlyValidator("heading", minHeadingLength, maxHeadingLength, "Heading", descriptionRegex),
    urlValidator("link", "Link"),
    languageCodeValidator("language_code"),
    validateRequest,
];

// User Validation
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
    body("fullname")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("Full name must be between 3 and 50 characters")
        .matches(nameRegex).withMessage("Full name can only contain letters, spaces, parentheses, and dots"),

    body("role")
        .trim()
        .optional()
        .bail()
        .isIn(["Superadmin", "Admin"]).withMessage("Invalid role"),

    body("email")
        .trim()
        .optional()
        .bail()
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("permission")
        .optional(),

    body("status")
        .trim()
        .optional()
        .bail()
        .isIn(["Active", "Deactive"]).withMessage("Invalid status"),

    validateRequest,
];




module.exports = {
    validateMinisterDetails,
    validateAddMainMenu,
    validateUpdateMainMenu,
    validateAddSlider,
    validateUpdateSlider,
    validateCurrentUpdate,
    validateUMCNews,
    validateInitiativeProgram,
    validateEmployeeInfo,
    validateEServices,
    validateInformation,
    validateCitizenServices,
    validateHomeVideo,
    validateUpdateHomeVideo,
    validateHomeGalleryAdd,
    validateHomeGalleryupdate,
    validatePortalServices,
    validateEmergencyServices,
    validateHomeServices1,
    validateHomeServices2,
    validateBottomSlider,
    validateSolidWasteMantSystem,
    validatePressNotes,
    validatePropertyTaxDept,
    validateLocationInfo,
    validateCommissionerData,
    validateCommissionerDesc,
    validateaddCommissionerDesc,
    validateHistoryImage,
    validateHistoryDescription,
    validateTourism,
    validateTableHeading,
    validatestructuretab1,
    validatestructuretab2,
    validatestructuretab4,
    validateAdministration,
    validateAnnual,
    validateElected,
    validateEnews,
    validateMunicipal,
    validateAgenda,
    validateBudget,
    validateCommittee,
    validateWardCommittee,
    validatePolicies,
    validateResolution,
    validateWardOffice,
    validateDepartment,
    validateDeptBanner,
    validateUpdateDeptBanner,
    validateDeptHod,
    validateUpdateDeptHod,
    validateDeptDescription,
    validateDeptPdf,
    validateAuditReport,
    validateTender,
    validateRts,
    validateOnlineServices,
    validatePhotoGallery,
    validateUpdatePhotoGallery,
    validateVideoGallery,
    validateUpdateVideoGallery,
    validateHomeProject,
    validateProjectCategory,
    validateProjectDescription,
    validateUpdateProjectDescription,
    validateRti,
    validateRecruitment,
    validateBanner,
    validateUpdateBanner,
    validateScreenReader,
    validateContactUsInfo,
    validateContactUsWard,
    validatePrivacyPolicy,
    validateHyperlinkPolicy,
    validateFooterContact,
    validateFooterUpdateContact,
    validateFooter,
    validateUserDetails,
    validateUpdateUserDetails,
};