import "./i18n";
import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import StickyFeedback from "./components/StickyFeedback/StickyFeedback";
import Home from "./components/Home/Home";
import ScreenReader from "./components/ScreenReader/ScreenReader";
import Location from "./components/Location/Location";
import History from "./components/History/History";
import Commissioner from "./components/Commissioner/Commissioner";
import Tourism from "./components/Tourism/Tourism";
import AdministrativeStructure from "./components/AdministrativeStructure/AdministrativeStructure";
import Administration from "./components/Administration/Administration";
import Agenda from "./components/Agenda/Agenda";
import AnnualFinancialStatement from "./components/AnnualFinancialStatement/AnnualFinancialStatement";
import Budget from "./components/Budget/Budget";
import Committee from "./components/Committee/Committee";
import ElectedMember from "./components/ElectedMember/ElectedMember";
import ENews from "./components/ENews/ENews";
import MunicipalMeeting from "./components/MunicipalMeeting/MunicipalMeeting";
import Policies from "./components/Policies/Policies";
import Resolutions from "./components/Resolutions/Resolutions";
import WardOffice from "./components/WardOffice/WardOffice";
import Departments from "./components/Departments/Departments";
import AccountsDepartment from "./components/AccountsDepartment/AccountsDepartment";
import AuditDepartment from "./components/AuditDepartment/AuditDepartment";
import CensusDepartment from "./components/CensusDepartment/CensusDepartment";
import ComputerIt from "./components/ComputerIt/ComputerIt";
import DisasterManagement from "./components/DisasterManagement/DisasterManagement";
import EducationDept from './components/EducationDept/EducationDept';
import ElectionDept from './components/ElectionDept/ElectionDept';
import ElectricalDept from './components/ElectricalDept/ElectricalDept';
import EncroachmentDepartment from "./components/EncroachmentDepartment/EncroachmentDepartment";
import EnvironmentDepartment from "./components/EnvironmentDepartment/EnvironmentDepartment";
import EstateDepartment from "./components/EstateDepartment/EstateDepartment";
import FireDept from "./components/FireDept/FireDept";
import GardenDept from './components/GardenDept/GardenDept';
import GeneralAdminDept from "./components/GeneralAdminDept/GeneralAdminDept";
import HandicapWelfareScheme from "./components/HandicapWelfareScheme/HandicapWelfareScheme";
import LBTDept from './components/LBTDept/LBTDept';
import LegalDept from './components/LegalDept/LegalDept';
import MarketLicensingDept from "./components/MarketLicensingDept/MarketLicensingDept";
import MedicalHealthDept from "./components/MedicalHealthDept/MedicalHealthDept";
import MunicipalSecretaryDept from "./components/MunicipalSecretaryDept/MunicipalSecretaryDept";
import Nulm from "./components/Nulm/Nulm";
import PropertyTaxDept from "./components/PropertyTaxDept/PropertyTaxDept";
import PublicHealthDept from "./components/PublicHealthDept/PublicHealthDept";
import PublicRelationshipDept from "./components/PublicRelationshipDept/PublicRelationshipDept";
import PublicWorksDept from "./components/PublicWorksDept/PublicWorksDept";
import RecordsDepartment from "./components/RecordsDepartment/RecordsDepartment"
import SecurityDept from "./components/SecurityDept/SecurityDept";
import SolidWasteManagementDept from "./components/SolidWasteManagementDept/SolidWasteManagementDept";
import SportsDept from "./components/SportsDept/SportsDept";
import StoreDept from "./components/StoreDept/StoreDept";
import TownPlanning from "./components/TownPlanning/TownPlanning";
import VehicleDepartment from "./components/VehicleDepartment/VehicleDepartment";
import WaterSupplyDept from "./components/WaterSupplyDept/WaterSupplyDept";
import WomenChildDevelopment from "./components/WomenChildDevelopment/WomenChildDevelopment";
import Circular from "./components/Circular/Circular";
import PropertyTax from "./components/PropertyTax/PropertyTax";
import BirthCertificate from "./components/BirthCertificate/BirthCertificate";
import DeathCertificate from "./components/DeathCertificate/DeathCertificate";
import ETender from "./components/ETender/ETender";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery";
import VideoGallery from "./components/VideoGallery/VideoGallery";
import Recruitment from "./components/Recruitment/Recruitment";
import RTS from "./components/RTS/RTS";
import PressNote from "./components/PressNote/PressNote";
import PTDept from "./components/PTDept/PTDept";
import SWMSystem from "./components/SWMSystem/SWMSystem";
import TendersQuotations from "./components/TendersQuotations/TendersQuotations";
import RTI from "./components/RTI/RTI";
import ProactiveDisclosure from "./components/ProactiveDisclosure/ProactiveDisclosure";
import SubRti from "./components/SubRti/SubRti";
import TermsConditions from "./components/TermsConditions/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import ContactUs from "./components/ContactUs/ContactUs";
import HyperlinkPolicy from "./components/HyperlinkPolicy/HyperlinkPolicy";
import AccessibilityStatement from "./components/AccessibilityStatement/AccessibilityStatement";
import UpcomingProjects from "./components/UpcomingProjects/UpcomingProjects";
import DeputyMayorOffice from "./components/DeputyMayorOffice/DeputyMayorOffice";
import MayorOffice from "./components/MayorOffice/MayorOffice";
import Quotations from "./components/Quotations/Quotations";
import StandingCommittee from "./components/StandingCommittee/StandingCommittee";
import SubjectCommittee from "./components/SubjectCommittee/SubjectCommittee";
import Authorities from "./components/Authorities/Authorities";
import WardCommittee from "./components/WardCommittee/WardCommittee";
import CustomerSupport from "./components/CustomerSupport/CustomerSupport";
import BottomSlider from "./components/BottomSlider/BottomSlider";
import Footer from "./components/Footer/Footer";
import { useTranslation } from "react-i18next";
import loaderimage from "./assets/loader_trans.gif";
import Celebration from "./components/Celebration/Celebration";
import api from "../src/components/api";
import AddtCommissioner from "./components/AddtCommissioner/AddtCommissioner";
import AsstCommissioner from "./components/AsstCommissioner/AsstCommissioner";
import DeptCommissioner from "./components/DeptCommissioner/DeptCommissioner";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const { i18n } = useTranslation();
  const location = useLocation();

  // Mapping of routes to page titles
  const routeTitles = {
    "/": "Home | Ulhasnagar Municipal Corporation",
    "/screen-reader-access": "Screen Reader Access | Ulhasnagar Municipal Corporation",
    "/location": "Location | Ulhasnagar Municipal Corporation",
    "/history": "History | Ulhasnagar Municipal Corporation",
    "/commissioner": "Commissioner | Ulhasnagar Municipal Corporation",
    "/tourism": "Tourism | Ulhasnagar Municipal Corporation",
    "/additional-commissioner": "Additional Commissioner | Ulhasnagar Municipal Corporation",
    "/assistant-commissioner": "Assistant Commissioner | Ulhasnagar Municipal Corporation",
    "/deputy-commissioner": "Deputy Commissioner | Ulhasnagar Municipal Corporation",
    "/administrative-structure": "Administrative Structure | Ulhasnagar Municipal Corporation",
    "/administration": "Administration | Ulhasnagar Municipal Corporation",
    "/agenda": "Agenda | Ulhasnagar Municipal Corporation",
    "/annual-financial-statement": "Annual Financial Statement | Ulhasnagar Municipal Corporation",
    "/budget": "Budget | Ulhasnagar Municipal Corporation",
    "/committee": "Committee | Ulhasnagar Municipal Corporation",
    "/elected-member": "Elected Member | Ulhasnagar Municipal Corporation",
    "/e-news": "E-News | Ulhasnagar Municipal Corporation",
    "/municipal-meeting": "Municipal Meeting | Ulhasnagar Municipal Corporation",
    "/policies": "Policies | Ulhasnagar Municipal Corporation",
    "/resolutions": "Resolutions | Ulhasnagar Municipal Corporation",
    "/ward-office": "Ward Office | Ulhasnagar Municipal Corporation",
    "/departments": "Departments | Ulhasnagar Municipal Corporation",
    "/accounts-department": "Accounts Department | Ulhasnagar Municipal Corporation",
    "/audit-department": "Audit Department | Ulhasnagar Municipal Corporation",
    "/census-aadhar-center": "Census Aadhar Center | Ulhasnagar Municipal Corporation",
    "/computer-department": "Computer Department | Ulhasnagar Municipal Corporation",
    "/disaster-management-department": "Disaster Management Department | Ulhasnagar Municipal Corporation",
    "/education-department": "Education Department | Ulhasnagar Municipal Corporation",
    "/election-department": "Election Department | Ulhasnagar Municipal Corporation",
    "/electrical-department": "Electrical Department | Ulhasnagar Municipal Corporation",
    "/encroachment-department": "Encroachment Department | Ulhasnagar Municipal Corporation",
    "/environment-department": "Environment Department | Ulhasnagar Municipal Corporation",
    "/estate-department": "Estate Department | Ulhasnagar Municipal Corporation",
    "/fire-department": "Fire Department | Ulhasnagar Municipal Corporation",
    "/garden-department": "Garden Department | Ulhasnagar Municipal Corporation",
    "/general-administrative-department": "General Administrative Department | Ulhasnagar Municipal Corporation",
    "/handicap-welfare-scheme": "Handicap Welfare Scheme | Ulhasnagar Municipal Corporation",
    "/lbt-department": "LBT Department | Ulhasnagar Municipal Corporation",
    "/legal-department": "Legal Department | Ulhasnagar Municipal Corporation",
    "/market-and-licensing-department": "Market and Licensing Department | Ulhasnagar Municipal Corporation",
    "/medical-health-department": "Medical Health Department | Ulhasnagar Municipal Corporation",
    "/municipal-secretary-department": "Municipal Secretary Department | Ulhasnagar Municipal Corporation",
    "/nulm-department": "NULM Department | Ulhasnagar Municipal Corporation",
    "/property-tax-department": "Property Tax Department | Ulhasnagar Municipal Corporation",
    "/public-health-department": "Public Health Department | Ulhasnagar Municipal Corporation",
    "/public-relationship-department": "Public Relationship Department | Ulhasnagar Municipal Corporation",
    "/public-works-department": "Public Works Department | Ulhasnagar Municipal Corporation",
    "/records-department": "Records Department | Ulhasnagar Municipal Corporation",
    "/security-department": "Security Department | Ulhasnagar Municipal Corporation",
    "/solid-waste-management-department": "Solid Waste Management Department | Ulhasnagar Municipal Corporation",
    "/sports-department": "Sports Department | Ulhasnagar Municipal Corporation",
    "/store-department": "Store Department | Ulhasnagar Municipal Corporation",
    "/town-planning-department": "Town Planning Department | Ulhasnagar Municipal Corporation",
    "/vehicle-department": "Vehicle Department | Ulhasnagar Municipal Corporation",
    "/water-supply-department": "Water Supply Department | Ulhasnagar Municipal Corporation",
    "/women-and-child-department": "Women and Child Department | Ulhasnagar Municipal Corporation",
    "/circular": "Circular | Ulhasnagar Municipal Corporation",
    "/property-tax-payment": "Property Tax Payment | Ulhasnagar Municipal Corporation",
    "/birth-certificate": "Birth Certificate | Ulhasnagar Municipal Corporation",
    "/death-certificate": "Death Certificate | Ulhasnagar Municipal Corporation",
    "/e-tender": "E-Tender | Ulhasnagar Municipal Corporation",
    "/photo-gallery": "Photo Gallery | Ulhasnagar Municipal Corporation",
    "/video-gallery": "Video Gallery | Ulhasnagar Municipal Corporation",
    "/recruitment": "Recruitment | Ulhasnagar Municipal Corporation",
    "/rts-act-2015": "RTS Act 2015 | Ulhasnagar Municipal Corporation",
    "/press-note": "Press Note | Ulhasnagar Municipal Corporation",
    "/property-tax-dept": "Property Tax Department | Ulhasnagar Municipal Corporation",
    "/solid-waste-management-system": "Solid Waste Management System | Ulhasnagar Municipal Corporation",
    "/tenders-and-quotations": "Tenders and Quotations | Ulhasnagar Municipal Corporation",
    "/rti": "RTI | Ulhasnagar Municipal Corporation",
    "/proactive-disclosure": "Proactive Disclosure | Ulhasnagar Municipal Corporation",
    "/sub-rti": "Sub RTI | Ulhasnagar Municipal Corporation",
    "/terms-and-conditions": "Terms and Conditions | Ulhasnagar Municipal Corporation",
    "/privacy-policy": "Privacy Policy | Ulhasnagar Municipal Corporation",
    "/contact-us": "Contact Us | Ulhasnagar Municipal Corporation",
    "/hyperlink-policy": "Hyperlink Policy | Ulhasnagar Municipal Corporation",
    "/accessibility-statement": "Accessibility Statement | Ulhasnagar Municipal Corporation",
    "/upcoming-projects": "Upcoming Projects | Ulhasnagar Municipal Corporation",
    "/deputy-mayor-office": "Deputy Mayor Office | Ulhasnagar Municipal Corporation",
    "/mayor-office": "Mayor Office | Ulhasnagar Municipal Corporation",
    "/quotations": "Quotations | Ulhasnagar Municipal Corporation",
    "/standing-committee": "Standing Committee | Ulhasnagar Municipal Corporation",
    "/subject-committee": "Subject Committee | Ulhasnagar Municipal Corporation",
    "/authorities": "Authorities | Ulhasnagar Municipal Corporation",
    "/ward-committee": "Ward Committee | Ulhasnagar Municipal Corporation",
    "/customer-support": "Customer Support | Ulhasnagar Municipal Corporation",
  };

  // Update document title based on the current route
  useEffect(() => {
    const title = routeTitles[location.pathname] || "Ulhasnagar Municipal Corporation";
    document.title = title;
  }, [location]);

  useEffect(() => {
    i18n.changeLanguage(i18n.language);
  }, [i18n]);

  useEffect(() => {
    const fetchCelebrationStatus = async () => {
      try {
        const response = await api.get("/celebration/1");
        const status = response.data.status;
        if (status === "Disable") {
          setShowIntro(false);
          setShowLoader(true);
          setTimeout(() => {
            setShowLoader(false);
            setShowMainContent(true);
          }, 2000);
        }
      } catch (error) {
        console.error("Error fetching celebration status:", error);
      }
    };
    fetchCelebrationStatus();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 600,
      delay: 100,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setShowMainContent(true);
    }, 2000);
  };

  const GlobalFontHandler = () => {
    useEffect(() => {
      const applyFontBasedOnLanguage = () => {
        const translatedText = document.querySelector("html").lang;
        if (translatedText === "mr") {
          applyFontFamily("Mukta, sans-serif");
        } else {
          applyFontFamily("");
        }
      };

      applyFontBasedOnLanguage();
    }, [location]);

    return null;
  };

  const applyFontFamily = (font) => {
    document.documentElement.style.setProperty("--global-font-family", font);
    document.body.style.fontFamily = font;
    let styleTag = document.getElementById("dynamic-font-style");
    
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-font-style";
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
        * { font-family: var(--global-font-family) !important; }
    `;
  };

  return (
    <>
      <div className="app-container">
        {showIntro && <Celebration onStart={handleIntroComplete} />}
        {showLoader && (
          <div className="loader-container d-flex items-center">
            <img
              src={loaderimage}
              alt="Loading..."
              className="gif-loader"
              style={{ width: "130px", height: "130px" }}
            />
          </div>
        )}
        {showMainContent && (
          <>
            <GlobalFontHandler />
            <Header data-aos="fade-down" />
            <StickyFeedback data-aos="fade-right" />

            <Routes>
              {/* Home */}
              <Route path="/" element={<Home data-aos="fade-up" />} />

              {/* Screen Reader Access */}
              <Route path="/screen-reader-access" element={<ScreenReader data-aos="fade-up" />} />

              {/* About UMC */}
              <Route path="/location" element={<Location data-aos="fade-left" />} />
              <Route path="/history" element={<History data-aos="zoom-in" />} />
              <Route path="/commissioner" element={<Commissioner data-aos="fade-up" />} />
              <Route path="/tourism" element={<Tourism data-aos="fade-up" />} />
              <Route path="/additional-commissioner" element={<AddtCommissioner data-aos="fade-up" />} />
              <Route path="/assistant-commissioner" element={<AsstCommissioner data-aos="fade-up" />} />
              <Route path="/deputy-commissioner" element={<DeptCommissioner data-aos="fade-up" />} />

              {/* Administrative Wings */}
              <Route path="/administrative-structure" element={<AdministrativeStructure data-aos="fade-up" />} />

              {/* Corporation */}
              <Route path="/administration" element={<Administration data-aos="fade-right" />} />
              <Route path="/agenda" element={<Agenda data-aos="fade-right" />} />
              <Route path="/annual-financial-statement" element={<AnnualFinancialStatement />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/committee" element={<Committee />} />
              <Route path="/elected-member" element={<ElectedMember />} />
              <Route path="/e-news" element={<ENews />} />
              <Route path="/municipal-meeting" element={<MunicipalMeeting />} />
              <Route path="/policies" element={<Policies />} />
              <Route path="/resolutions" element={<Resolutions />} />
              <Route path="/ward-office" element={<WardOffice />} />

              {/* Departments */}
              <Route path="/departments" element={<Departments data-aos="fade-up" />} />
              <Route path="/accounts-department" element={<AccountsDepartment data-aos="zoom-in-up" />} />
              <Route path="/audit-department" element={<AuditDepartment data-aos="fade-right" />} />
              <Route path="/census-aadhar-center" element={<CensusDepartment />} />
              <Route path="/computer-department" element={<ComputerIt data-aos="fade-left" />} />
              <Route path="/disaster-management-department" element={<DisasterManagement data-aos="fade-right" />} />
              <Route path="/education-department" element={<EducationDept />} />
              <Route path="/election-department" element={<ElectionDept />} />
              <Route path="/electrical-department" element={<ElectricalDept />} />
              <Route path="/encroachment-department" element={<EncroachmentDepartment data-aos="flip-right" />} />
              <Route path="/environment-department" element={<EnvironmentDepartment data-aos="zoom-in" />} />
              <Route path="/estate-department" element={<EstateDepartment data-aos="zoom-in" />} />
              <Route path="/fire-department" element={<FireDept />} />
              <Route path="/garden-department" element={<GardenDept />} />
              <Route path="/general-administrative-department" element={<GeneralAdminDept data-aos="zoom-in" />} />
              <Route path="/handicap-welfare-scheme" element={<HandicapWelfareScheme data-aos="fade-up" />} />
              <Route path="/lbt-department" element={<LBTDept />} />
              <Route path="/legal-department" element={<LegalDept />} />
              <Route path="/market-and-licensing-department" element={<MarketLicensingDept />} />
              <Route path="/medical-health-department" element={<MedicalHealthDept />} />
              <Route path="/municipal-secretary-department" element={<MunicipalSecretaryDept />} />
              <Route path="/nulm-department" element={<Nulm data-aos="zoom-in-up" />} />
              <Route path="/property-tax-department" element={<PropertyTaxDept />} />
              <Route path="/public-health-department" element={<PublicHealthDept />} />
              <Route path="/public-relationship-department" element={<PublicRelationshipDept />} />
              <Route path="/public-works-department" element={<PublicWorksDept />} />
              <Route path="/records-department" element={<RecordsDepartment />} />
              <Route path="/security-department" element={<SecurityDept />} />
              <Route path="/solid-waste-management-department" element={<SolidWasteManagementDept />} />
              <Route path="/sports-department" element={<SportsDept />} />
              <Route path="/store-department" element={<StoreDept />} />
              <Route path="/town-planning-department" element={<TownPlanning data-aos="fade-left" />} />
              <Route path="/vehicle-department" element={<VehicleDepartment data-aos="flip-left" />} />
              <Route path="/water-supply-department" element={<WaterSupplyDept />} />
              <Route path="/women-and-child-department" element={<WomenChildDevelopment />} />

              {/* Circular */}
              <Route path="/circular" element={<Circular data-aos="flip-down" />} />

              {/* Online Services */}
              <Route path="/property-tax-payment" element={<PropertyTax />} />
              <Route path="/birth-certificate" element={<BirthCertificate />} />
              <Route path="/death-certificate" element={<DeathCertificate />} />
              <Route path="/e-tender" element={<ETender />} />

              {/* Gallery */}
              <Route path="/photo-gallery" element={<PhotoGallery data-aos="zoom-in" />} />
              <Route path="/video-gallery" element={<VideoGallery data-aos="flip-up" />} />

              {/* Recruitment */}
              <Route path="/recruitment" element={<Recruitment data-aos="flip-left" />} />

              {/* RTS */}
              <Route path="/rts-act-2015" element={<RTS data-aos="fade-up" />} />

              {/* Citizen Services */}
              <Route path="/press-note" element={<PressNote />} />
              <Route path="/property-tax-dept" element={<PTDept />} />
              <Route path="/solid-waste-management-system" element={<SWMSystem />} />
              <Route path="/tenders-and-quotations" element={<TendersQuotations data-aos="zoom-in-up" />} />

              {/* RTI */}
              <Route path="/rti" element={<RTI />} />
              <Route path="/proactive-disclosure" element={<ProactiveDisclosure />} />
              <Route path="/sub-rti" element={<SubRti />} />

              {/* Footer Links */}
              <Route path="/terms-and-conditions" element={<TermsConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact-us" element={<ContactUs data-aos="fade-up" />} />
              <Route path="/hyperlink-policy" element={<HyperlinkPolicy />} />
              <Route path="/accessibility-statement" element={<AccessibilityStatement />} />

              {/* Upcoming Projects */}
              <Route path="/upcoming-projects" element={<UpcomingProjects />} />

              {/* Comming Soon pages */}
              <Route path="/deputy-mayor-office" element={<DeputyMayorOffice />} />
              <Route path="/mayor-office" element={<MayorOffice />} />
              <Route path="/quotations" element={<Quotations />} />
              <Route path="/standing-committee" element={<StandingCommittee />} />
              <Route path="/subject-committee" element={<SubjectCommittee />} />
              <Route path="/authorities" element={<Authorities />} />
              <Route path="/ward-committee" element={<WardCommittee />} />
              <Route path="/customer-support" element={<CustomerSupport />} />
            </Routes>

            <BottomSlider data-aos="fade-up" />
            <Footer data-aos="fade-down" />
          </>
        )}
      </div>
    </>
  );
}

export default App;


// import "./i18n";
// import "./App.css";
// import React, { useState, useEffect } from "react";
// // eslint-disable-next-line
// import { BrowserRouter as Router, Route, Routes, useParams, Navigate, useLocation } from "react-router-dom";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Header from "./components/Header/Header";
// import StickyFeedback from "./components/StickyFeedback/StickyFeedback";
// import Home from "./components/Home/Home";
// import ScreenReader from "./components/ScreenReader/ScreenReader";
// import Location from "./components/Location/Location";
// import History from "./components/History/History";
// import Commissioner from "./components/Commissioner/Commissioner";
// import Tourism from "./components/Tourism/Tourism";
// import AdministrativeStructure from "./components/AdministrativeStructure/AdministrativeStructure";
// import Administration from "./components/Administration/Administration";
// import Agenda from "./components/Agenda/Agenda";
// import AnnualFinancialStatement from "./components/AnnualFinancialStatement/AnnualFinancialStatement";
// import Budget from "./components/Budget/Budget";
// import Committee from "./components/Committee/Committee";
// import ElectedMember from "./components/ElectedMember/ElectedMember";
// import ENews from "./components/ENews/ENews";
// import MunicipalMeeting from "./components/MunicipalMeeting/MunicipalMeeting";
// import Policies from "./components/Policies/Policies";
// import Resolutions from "./components/Resolutions/Resolutions";
// import WardOffice from "./components/WardOffice/WardOffice";
// import Departments from "./components/Departments/Departments";
// import AccountsDepartment from "./components/AccountsDepartment/AccountsDepartment";
// import AuditDepartment from "./components/AuditDepartment/AuditDepartment";
// import CensusDepartment from "./components/CensusDepartment/CensusDepartment";
// import ComputerIt from "./components/ComputerIt/ComputerIt";
// import DisasterManagement from "./components/DisasterManagement/DisasterManagement";
// import EducationDept from './components/EducationDept/EducationDept';
// import ElectionDept from './components/ElectionDept/ElectionDept';
// import ElectricalDept from './components/ElectricalDept/ElectricalDept';
// import EncroachmentDepartment from "./components/EncroachmentDepartment/EncroachmentDepartment";
// import EnvironmentDepartment from "./components/EnvironmentDepartment/EnvironmentDepartment";
// import EstateDepartment from "./components/EstateDepartment/EstateDepartment";
// import FireDept from "./components/FireDept/FireDept";
// import GardenDept from './components/GardenDept/GardenDept';
// import GeneralAdminDept from "./components/GeneralAdminDept/GeneralAdminDept";
// import HandicapWelfareScheme from "./components/HandicapWelfareScheme/HandicapWelfareScheme";
// import LBTDept from './components/LBTDept/LBTDept';
// import LegalDept from './components/LegalDept/LegalDept';
// import MarketLicensingDept from "./components/MarketLicensingDept/MarketLicensingDept";
// import MedicalHealthDept from "./components/MedicalHealthDept/MedicalHealthDept";
// import MunicipalSecretaryDept from "./components/MunicipalSecretaryDept/MunicipalSecretaryDept";
// import Nulm from "./components/Nulm/Nulm";
// import PropertyTaxDept from "./components/PropertyTaxDept/PropertyTaxDept";
// import PublicHealthDept from "./components/PublicHealthDept/PublicHealthDept";
// import PublicRelationshipDept from "./components/PublicRelationshipDept/PublicRelationshipDept";
// import PublicWorksDept from "./components/PublicWorksDept/PublicWorksDept";
// import RecordsDepartment from "./components/RecordsDepartment/RecordsDepartment"
// import SecurityDept from "./components/SecurityDept/SecurityDept";
// import SolidWasteManagementDept from "./components/SolidWasteManagementDept/SolidWasteManagementDept";
// import SportsDept from "./components/SportsDept/SportsDept";
// import StoreDept from "./components/StoreDept/StoreDept";
// import TownPlanning from "./components/TownPlanning/TownPlanning";
// import VehicleDepartment from "./components/VehicleDepartment/VehicleDepartment";
// import WaterSupplyDept from "./components/WaterSupplyDept/WaterSupplyDept";
// import WomenChildDevelopment from "./components/WomenChildDevelopment/WomenChildDevelopment";
// import Circular from "./components/Circular/Circular";
// import PropertyTax from "./components/PropertyTax/PropertyTax";
// import BirthCertificate from "./components/BirthCertificate/BirthCertificate";
// import DeathCertificate from "./components/DeathCertificate/DeathCertificate";
// import ETender from "./components/ETender/ETender";
// import PhotoGallery from "./components/PhotoGallery/PhotoGallery";
// import VideoGallery from "./components/VideoGallery/VideoGallery";
// import Recruitment from "./components/Recruitment/Recruitment";
// import RTS from "./components/RTS/RTS";
// import PressNote from "./components/PressNote/PressNote";
// import PTDept from "./components/PTDept/PTDept";
// import SWMSystem from "./components/SWMSystem/SWMSystem";
// import TendersQuotations from "./components/TendersQuotations/TendersQuotations";
// import RTI from "./components/RTI/RTI";
// import ProactiveDisclosure from "./components/ProactiveDisclosure/ProactiveDisclosure";
// import SubRti from "./components/SubRti/SubRti";
// import TermsConditions from "./components/TermsConditions/TermsConditions";
// import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
// import ContactUs from "./components/ContactUs/ContactUs";
// import HyperlinkPolicy from "./components/HyperlinkPolicy/HyperlinkPolicy";
// import AccessibilityStatement from "./components/AccessibilityStatement/AccessibilityStatement";
// import UpcomingProjects from "./components/UpcomingProjects/UpcomingProjects";
// import DeputyMayorOffice from "./components/DeputyMayorOffice/DeputyMayorOffice";
// import MayorOffice from "./components/MayorOffice/MayorOffice";
// import Quotations from "./components/Quotations/Quotations";
// import StandingCommittee from "./components/StandingCommittee/StandingCommittee";
// import SubjectCommittee from "./components/SubjectCommittee/SubjectCommittee";
// import Authorities from "./components/Authorities/Authorities";
// import WardCommittee from "./components/WardCommittee/WardCommittee";
// import CustomerSupport from "./components/CustomerSupport/CustomerSupport";
// import BottomSlider from "./components/BottomSlider/BottomSlider";
// // import WhatsAppChat from "./components/WhatsAppChat/WhatsAppChat";
// import Footer from "./components/Footer/Footer";
// import { useTranslation } from "react-i18next";
// import loaderimage from "./assets/loader_trans.gif";
// import Celebration from "./components/Celebration/Celebration";
// import api from "../src/components/api";
// import AddtCommissioner from "./components/AddtCommissioner/AddtCommissioner";
// import AsstCommissioner from "./components/AsstCommissioner/AsstCommissioner";
// import DeptCommissioner from "./components/DeptCommissioner/DeptCommissioner";


// function App() {
//   const [showIntro, setShowIntro] = useState(true);
//   const [showLoader, setShowLoader] = useState(false);
//   const [showMainContent, setShowMainContent] = useState(false);
//   const { i18n } = useTranslation();

//   useEffect(() => {
//     i18n.changeLanguage(i18n.language);
//   }, [i18n]);

//   useEffect(() => {
//     const fetchCelebrationStatus = async () => {
//       try {
//         const response = await api.get("/celebration/1");
//         const status = response.data.status;
//         if (status === "Disable") {
//           setShowIntro(false);
//           setShowLoader(true);
//           setTimeout(() => {
//             setShowLoader(false);
//             setShowMainContent(true);
//           }, 2000);
//         }
//       } catch (error) {
//         console.error("Error fetching celebration status:", error);
//       }
//     };
//     fetchCelebrationStatus();
//   }, []);

//   useEffect(() => {
//     AOS.init({
//       duration: 600,
//       delay: 100,
//       easing: "ease-in-out",
//       once: true,
//     });
//   }, []);

//   const handleIntroComplete = () => {
//     setShowIntro(false);
//     setShowLoader(true);
//     setTimeout(() => {
//       setShowLoader(false);
//       setShowMainContent(true);
//     }, 2000);
//   };

//   const GlobalFontHandler = () => {
//     const location = useLocation();

//     useEffect(() => {
//       const applyFontBasedOnLanguage = () => {
//         const translatedText = document.querySelector("html").lang;
//         if (translatedText === "mr") {
//           applyFontFamily("Mukta, sans-serif");
//         } else {
//           applyFontFamily("");
//         }
//       };

//       applyFontBasedOnLanguage();
//     }, [location]);

//     return null;
//   };

//   const applyFontFamily = (font) => {
//     document.documentElement.style.setProperty("--global-font-family", font);
//     document.body.style.fontFamily = font;
//     let styleTag = document.getElementById("dynamic-font-style");
    
//     if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = "dynamic-font-style";
//         document.head.appendChild(styleTag);
//     }
//     styleTag.innerHTML = `
//         * { font-family: var(--global-font-family) !important; }
//     `;
// };

//   return (
//     <>
//       <div className="app-container">
//         {showIntro && <Celebration onStart={handleIntroComplete} />}
//         {showLoader && (
//           <div className="loader-container d-flex items-center">
//             <img
//               src={loaderimage}
//               alt="Loading..."
//               className="gif-loader"
//               style={{ width: "130px", height: "130px" }}
//             />
//           </div>
//         )}
//         {showMainContent && (
//           <>

//             <GlobalFontHandler />
//             <Header data-aos="fade-down" />
//             <StickyFeedback data-aos="fade-right" />

//             <Routes>
//               {/* Home */}
//               <Route path="/" element={<Home data-aos="fade-up" />} />

//               {/* Screen Reader Access */}
//               <Route path="/screen-reader-access" element={<ScreenReader data-aos="fade-up" />} />

//               {/* About UMC */}
//               <Route path="/location" element={<Location data-aos="fade-left" />} />
//               <Route path="/history" element={<History data-aos="zoom-in" />} />
//               <Route path="/commissioner" element={<Commissioner data-aos="fade-up" />} />
//               <Route path="/tourism" element={<Tourism data-aos="fade-up" />} />
//               <Route path="/additional-commissioner" element={<AddtCommissioner data-aos="fade-up" />} />
//               <Route path="/assistant-commissioner" element={<AsstCommissioner data-aos="fade-up" />} />
//               <Route path="/deputy-commissioner" element={<DeptCommissioner data-aos="fade-up" />} />


//               {/* Administrative Wings */}
//               <Route path="/administrative-structure" element={<AdministrativeStructure data-aos="fade-up" />} />

//               {/* Corporation */}
//               <Route path="/administration" element={<Administration data-aos="fade-right" />} />
//               <Route path="/agenda" element={<Agenda data-aos="fade-right" />} />
//               <Route path="/annual-financial-statement" element={<AnnualFinancialStatement />} />
//               <Route path="/budget" element={<Budget />} />
//               <Route path="/committee" element={<Committee />} />
//               <Route path="/elected-member" element={<ElectedMember />} />
//               <Route path="/e-news" element={<ENews />} />
//               <Route path="/municipal-meeting" element={<MunicipalMeeting />} />
//               <Route path="/policies" element={<Policies />} />
//               <Route path="/resolutions" element={<Resolutions />} />
//               <Route path="/ward-office" element={<WardOffice />} />

//               {/* Departments */}
//               <Route path="/departments" element={<Departments data-aos="fade-up" />} />
//               <Route path="/accounts-department" element={<AccountsDepartment data-aos="zoom-in-up" />} />
//               <Route path="/audit-department" element={<AuditDepartment data-aos="fade-right" />} />
//               <Route path="/census-aadhar-center" element={<CensusDepartment />} />
//               <Route path="/computer-department" element={<ComputerIt data-aos="fade-left" />} />
//               <Route path="/disaster-management-department" element={<DisasterManagement data-aos="fade-right" />} />
//               <Route path="/education-department" element={<EducationDept />} />
//               <Route path="/election-department" element={<ElectionDept />} />
//               <Route path="/electrical-department" element={<ElectricalDept />} />
//               <Route path="/encroachment-department" element={<EncroachmentDepartment data-aos="flip-right" />} />
//               <Route path="/environment-department" element={<EnvironmentDepartment data-aos="zoom-in" />} />
//               <Route path="/estate-department" element={<EstateDepartment data-aos="zoom-in" />} />
//               <Route path="/fire-department" element={<FireDept />} />
//               <Route path="/garden-department" element={<GardenDept />} />
//               <Route path="/general-administrative-department" element={<GeneralAdminDept data-aos="zoom-in" />} />
//               <Route path="/handicap-welfare-scheme" element={<HandicapWelfareScheme data-aos="fade-up" />} />
//               <Route path="/lbt-department" element={<LBTDept />} />
//               <Route path="/legal-department" element={<LegalDept />} />
//               <Route path="/market-and-licensing-department" element={<MarketLicensingDept />} />
//               <Route path="/medical-health-department" element={<MedicalHealthDept />} />
//               <Route path="/municipal-secretary-department" element={<MunicipalSecretaryDept />} />
//               <Route path="/nulm-department" element={<Nulm data-aos="zoom-in-up" />} />
//               <Route path="/property-tax-department" element={<PropertyTaxDept />} />
//               <Route path="/public-health-department" element={<PublicHealthDept />} />
//               <Route path="/public-relationship-department" element={<PublicRelationshipDept />} />
//               <Route path="/public-works-department" element={<PublicWorksDept />} />
//               <Route path="/records-department" element={<RecordsDepartment />} />
//               <Route path="/security-department" element={<SecurityDept />} />
//               <Route path="/solid-waste-management-department" element={<SolidWasteManagementDept />} />
//               <Route path="/sports-department" element={<SportsDept />} />
//               <Route path="/store-department" element={<StoreDept />} />
//               <Route path="/town-planning-department" element={<TownPlanning data-aos="fade-left" />} />
//               <Route path="/vehicle-department" element={<VehicleDepartment data-aos="flip-left" />} />
//               <Route path="/water-supply-department" element={<WaterSupplyDept />} />
//               <Route path="/women-and-child-department" element={<WomenChildDevelopment />} />

//               {/* Circular */}
//               <Route path="/circular" element={<Circular data-aos="flip-down" />} />

//               {/* Online Services */}
//               <Route path="/property-tax-payment" element={<PropertyTax />} />
//               <Route path="/birth-certificate" element={<BirthCertificate />} />
//               <Route path="/death-certificate" element={<DeathCertificate />} />
//               <Route path="/e-tender" element={<ETender />} />

//               {/* Gallery */}
//               <Route path="/photo-gallery" element={<PhotoGallery data-aos="zoom-in" />} />
//               <Route path="/video-gallery" element={<VideoGallery data-aos="flip-up" />} />

//               {/* Recruitment */}
//               <Route path="/recruitment" element={<Recruitment data-aos="flip-left" />} />

//               {/* RTS */}
//               <Route path="/rts-act-2015" element={<RTS data-aos="fade-up" />} />

//               {/* Citizen Services */}
//               <Route path="/press-note" element={<PressNote />} />
//               <Route path="/property-tax-dept" element={<PTDept />} />
//               <Route path="/solid-waste-management-system" element={<SWMSystem />} />
//               <Route path="/tenders-and-quotations" element={<TendersQuotations data-aos="zoom-in-up" />} />

//               {/* RTI */}
//               <Route path="/rti" element={<RTI />} />
//               <Route path="/proactive-disclosure" element={<ProactiveDisclosure />} />
//               <Route path="/sub-rti" element={<SubRti />} />

//               {/* Footer Links */}
//               <Route path="/terms-and-conditions" element={<TermsConditions />} />
//               <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//               <Route path="/contact-us" element={<ContactUs data-aos="fade-up" />} />
//               <Route path="/hyperlink-policy" element={<HyperlinkPolicy />} />
//               <Route path="/accessibility-statement" element={<AccessibilityStatement />} />

//               {/* Upcoming Projects */}
//               <Route path="/upcoming-projects" element={<UpcomingProjects />} />

//               {/* Comming Soon pages */}
//               <Route path="/deputy-mayor-office" element={<DeputyMayorOffice />} />
//               <Route path="/mayor-office" element={<MayorOffice />} />
//               <Route path="/quotations" element={<Quotations />} />
//               <Route path="/standing-committee" element={<StandingCommittee />} />
//               <Route path="/subject-committee" element={<SubjectCommittee />} />
//               <Route path="/authorities" element={<Authorities />} />
//               <Route path="/ward-committee" element={<WardCommittee />} />
//               <Route path="/customer-support" element={<CustomerSupport />} />

//             </Routes>

//             <BottomSlider data-aos="fade-up" />
//             {/* <WhatsAppChat data-aos="fade-right" /> */}
//             <Footer data-aos="fade-down" />

//           </>
//         )}
//       </div>
//     </>
//   );
// }

// export default App;