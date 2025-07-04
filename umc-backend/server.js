const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const cors = require("cors");
require('dotenv').config();
const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
 
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'], 
    credentials: true,
}));

app.use(express.json());
app.set('trust proxy', 1);

app.use((req, res, next) => {
    const allowedMethods = ['GET', 'POST'];
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    next();
});

app.use(bodyParser.json());
 
 
{/* Main Menu */ }
const mainMenuRoutes = require('./routes/mainMenuRoutes');
 
{/* Home */ }
const ministerDetailRoutes = require('./routes/ministerDetailRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const currentUpdateRoutes = require('./routes/currentUpdateRoutes');
const umcNewsRoutes = require('./routes/umcNewsRoutes');
const initiativeRoutes = require('./routes/initiativeRoutes');
const eServicesRoutes = require('./routes/eServicesRoutes');
const informationRoutes = require('./routes/informationRoutes');
const citizenServicesRoutes = require('./routes/citizenServicesRoutes');
const homeVideosRoutes = require('./routes/homeVideosRoutes');
const homeGalleryRoutes = require('./routes/homeGalleryRoutes');
const portalServicesRoutes = require('./routes/portalServicesRoutes');
const emergencyServicesRoutes = require('./routes/emergencyServicesRoutes');
const homeService1Routes = require('./routes/homeService1Routes');
const homeServices2Routes = require('./routes/homeServices2Routes');
const bottomSliderRoutes = require('./routes/bottomSliderRoutes');
const swmsRoutes = require('./routes/swmsRoutes');
const pressNotesRoutes = require('./routes/pressNotesRoutes');
const propertyDeptRoutes = require('./routes/propertyDeptRoutes');
const empInfoRoutes = require('./routes/empInfoRoutes');
 
{/* About UMC */ }
const locationRoutes = require('./routes/locationRoutes');
const commissionerDataRoutes = require('./routes/commissionerDataRoutes');
const addtComDataRoutes = require('./routes/addtComDataRoutes');
const asstComDataRoutes = require('./routes/asstComDataRoutes');
const deptComDataRoutes = require('./routes/deptComDataRoutes');
const historyImageRoutes = require('./routes/historyImageRoutes');
const historyDescRoutes = require('./routes/historyDescRoutes');
const tourismRoutes = require('./routes/tourismRoutes');
 
{/* Administrative Wings */ }
const tableHeadingRoutes = require('./routes/tableHeadingRoutes');
const structureTab1Routes = require('./routes/structureTab1Routes');
const structureTab2Routes = require('./routes/structureTab2Routes');
const structureTab3Routes = require('./routes/structureTab3Routes');
const structureTab4Routes = require('./routes/structureTab4Routes');
 
{/* Corporation */ }
const administrationRoutes = require('./routes/administrationRoutes');
const annualfinancialRoutes = require('./routes/annualfinancialRoutes');
const electedMemberRoutes = require('./routes/electedMemberRoutes');
const eNewsRoutes = require('./routes/eNewsRoutes');
const muncipalMeetingRoutes = require('./routes/muncipalMeetingRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const budgetsRoutes = require('./routes/budgetsRoutes');
const standingRoutes = require('./routes/standingRoutes');
const wardCommitteeRoutes = require('./routes/wardCommitteeRoutes');
const womenRoutes = require('./routes/womenRoutes');
const policiesRoutes = require('./routes/policiesRoutes');
const resolutionRoutes = require('./routes/resolutionRoutes');
const wardOfficeRoutes = require('./routes/wardOfficeRoutes');
 
{/* Departments */ }
const departmentPageRoutes = require('./routes/departmentPageRoutes');
const deptBannerRoutes = require('./routes/deptBannerRoutes');
const deptDescriptionRoutes = require('./routes/deptDescriptionRoutes');
const deptHodRoutes = require('./routes/deptHodRoutes');
const deptPdfRoutes = require('./routes/deptPdfRoutes');
const auditDeptRoutes = require('./routes/auditDeptRoutes');
 
{/* Tenders and Quotations */ }
const tenderQuotationRoutes = require('./routes/tenderQuotationRoutes');
 
{/* Right to Service */ }
const rtsRoutes = require('./routes/rtsRoutes');
 
{/* Circulars */ }
const circularRoutes = require('./routes/circularRoutes');
 
{/* Online Services */ }
const onlineServiceRoutes = require('./routes/onlineServiceRoutes');
 
{/* Gallery */ }
const imagesGalleryRoutes = require('./routes/imagesGalleryRoutes');
const videoGalleryRoutes = require('./routes/videoGalleryRoutes');
 
{/* Upcoming Projects */ }
const projectRoutes = require('./routes/projectRoutes');
const projectDetailsRoutes = require('./routes/projectDetailsRoutes');
const projectDescriptionRoutes = require('./routes/projectDescriptionRoutes');
 
{/* Right to Information */ }
const rtiRoutes = require('./routes/rtiRoutes');
const proactiveDisclosureRoutes = require('./routes/proactiveDisclosureRoutes');
const subRtiRoutes = require('./routes/subRtiRoutes');
 
{/* Recruitment */ }
const recruitmentRoutes = require('./routes/recruitmentRoutes');
 
{/* Banner */ }
const bannerRoutes = require('./routes/bannerRoutes');
 
{/* Screen Reader */ }
const screenReaderRoutes = require('./routes/screenReaderRoutes');
 
{/* Contact Us */ }
const contactUsRoutes = require('./routes/contactUsRoutes');
const wardRoutes = require('./routes/wardRoutes');
 
{/* Privacy Policy */ }
const policyRoutes = require('./routes/policyRoutes');
 
{/* Hyperlink Policy */ }
const hyperlinkRoutes = require('./routes/hyperlinkRoutes');
 
{/* Celebration */ }
const curtainRoutes = require('./routes/curtainRoutes');
const ribbonRoutes = require('./routes/ribbonRoutes');
 
{/* Footer */ }
const contactInfoRoutes = require('./routes/contactInfoRoutes');
const quickLinksRoutes = require('./routes/quickLinksRoutes');
const helpLinksRoutes = require('./routes/helpLinksRoutes');
const onlineServicesRoutes = require('./routes/onlineServicesRoutes');
 
{/* Profile */ }
const userRoutes = require('./routes/userRoutes');
 
{/* Email */ }
const emailRoutes = require('./routes/emailRoutes');
 
{/* Login */ }
const loginRoutes = require('./routes/loginRoutes');
 
{/* Reset Password */ }
const resetPassRoutes = require('./routes/resetPassRoutes');
 
{/* Visitor */ }
const visitorRoutes = require('./routes/visitorRoutes');
{/* password salt */}
const nonce = require('./routes/nonce');
app.use('/api', nonce);
 
{/* Main Menu */ }
app.use('/api', mainMenuRoutes);
 
{/* Home */ }
app.use('/api', ministerDetailRoutes);
app.use('/api', sliderRoutes);
app.use('/api', currentUpdateRoutes);
app.use('/api', umcNewsRoutes);
app.use('/api', initiativeRoutes);
app.use('/api', eServicesRoutes);
app.use('/api', informationRoutes);
app.use('/api', citizenServicesRoutes);
app.use('/api', homeVideosRoutes);
app.use('/api', homeGalleryRoutes);
app.use('/api', portalServicesRoutes);
app.use('/api', emergencyServicesRoutes);
app.use('/api', homeService1Routes);
app.use('/api', homeServices2Routes);
app.use('/api', bottomSliderRoutes);
app.use('/api', swmsRoutes);
app.use('/api', pressNotesRoutes);
app.use('/api', propertyDeptRoutes);
app.use('/api', empInfoRoutes);
 
{/* About UMC */ }
app.use('/api', locationRoutes);
app.use('/api', commissionerDataRoutes);
app.use('/api', addtComDataRoutes);
app.use('/api', asstComDataRoutes);
app.use('/api', deptComDataRoutes);
app.use('/api', historyImageRoutes);
app.use('/api', historyDescRoutes);
app.use('/api', tourismRoutes);
 
{/* Administrative Wings */ }
app.use('/api', tableHeadingRoutes);
app.use('/api', structureTab1Routes);
app.use('/api', structureTab2Routes);
app.use('/api', structureTab3Routes);
app.use('/api', structureTab4Routes);
 
{/* Corporation */ }
app.use('/api', administrationRoutes);
app.use('/api', annualfinancialRoutes);
app.use('/api', electedMemberRoutes);
app.use('/api', eNewsRoutes);
app.use('/api', muncipalMeetingRoutes);
app.use('/api', agendaRoutes);
app.use('/api', budgetsRoutes);
app.use('/api', standingRoutes);
app.use('/api', wardCommitteeRoutes);
app.use('/api', womenRoutes);
app.use('/api', policiesRoutes);
app.use('/api', resolutionRoutes);
app.use('/api', wardOfficeRoutes);
 
{/* Departments */ }
app.use('/api', departmentPageRoutes);
app.use('/api', deptBannerRoutes);
app.use('/api', deptDescriptionRoutes);
app.use('/api', deptHodRoutes);
app.use('/api', deptPdfRoutes);
app.use('/api', auditDeptRoutes);
 
{/* Tenders and Quotations */ }
app.use('/api', tenderQuotationRoutes);
 
{/* Right to Service */ }
app.use('/api', rtsRoutes);
 
{/* Circulars */ }
app.use('/api', circularRoutes);
 
{/* Online Services */ }
app.use('/api', onlineServiceRoutes);
 
{/* Gallery */ }
app.use('/api', imagesGalleryRoutes);
app.use('/api', videoGalleryRoutes);
 
{/* Upcoming Projects */ }
app.use('/api', projectRoutes);
app.use('/api', projectDetailsRoutes);
app.use('/api', projectDescriptionRoutes);
 
{/* Right to Information */ }
app.use('/api', rtiRoutes);
app.use('/api', proactiveDisclosureRoutes);
app.use('/api', subRtiRoutes);
 
{/* Recruitment */ }
app.use('/api', recruitmentRoutes);
 
{/* Banner */ }
app.use('/api', bannerRoutes);
 
{/* Visitor */ }
app.use('/api', screenReaderRoutes);
 
{/* Contact Us */ }
app.use('/api', contactUsRoutes);
app.use('/api', wardRoutes);
 
{/* Privacy Policy */ }
app.use('/api', policyRoutes);
 
{/* Hyperlink Policy */ }
app.use('/api', hyperlinkRoutes);
 
{/* Celebration */ }
app.use('/api', curtainRoutes);
app.use('/api', ribbonRoutes);
 
{/* Footer */ }
app.use('/api', contactInfoRoutes);
app.use('/api', quickLinksRoutes);
app.use('/api', helpLinksRoutes);
app.use('/api', onlineServicesRoutes);
 
{/* Profile */ }
app.use('/api', userRoutes);
 
{/* Feedback */ }
app.use('/api', emailRoutes);
 
{/* Login */ }
app.use('/api', loginRoutes);
 
{/* Reset Password */ }
app.use('/api', resetPassRoutes);
 
{/* Visitor */ }
app.use('/api', visitorRoutes);

app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ error: 'Access denied: CORS policy violation' });
    }
    console.error('Server Error:', err.message); 
 
    res.status(500).json({
        success: false,
        message: 'Internal Server Error' 
    });
});

 
const PORT = process.env.PORT || 6002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});