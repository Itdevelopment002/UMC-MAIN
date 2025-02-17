import "./i18n"; // Ensure this is imported once
import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useParams, Navigate, useLocation } from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import History from "./components/History/History";
import WhatsAppChat from "./components/WhatsAppChat/WhatsAppChat";
import StickyFeedback from "./components/StickyFeedback/StickyFeedback";
import Location from "./components/Location/Location";
import BottomSlider from "./components/BottomSlider/BottomSlider";
import Commissioner from "./components/Commissioner/Commissioner";
import Tourism from "./components/Tourism/Tourism";
import RTS from "./components/RTS/RTS";
import PhotoGallery from "./components/PhotoGallery/PhotoGallery";
import Recruitment from "./components/Recruitment/Recruitment";
import VideoGallery from "./components/VideoGallery/VideoGallery";
import DisasterManagement from "./components/DisasterManagement/DisasterManagement";
import GeneralAdminDept from "./components/GeneralAdminDept/GeneralAdminDept";
import ComputerIt from "./components/ComputerIt/ComputerIt";
import AccountsDepartment from "./components/AccountsDepartment/AccountsDepartment";
import AuditDepartment from "./components/AuditDepartment/AuditDepartment";
import VehicleDepartment from "./components/VehicleDepartment/VehicleDepartment";
import EnvironmentDepartment from "./components/EnvironmentDepartment/EnvironmentDepartment";
import HandicapWelfareScheme from "./components/HandicapWelfareScheme/HandicapWelfareScheme";
import EncroachmentDepartment from "./components/EncroachmentDepartment/EncroachmentDepartment";
import EstateDepartment from "./components/EstateDepartment/EstateDepartment";
import TownPlanning from "./components/TownPlanning/TownPlanning";
import Nulm from "./components/Nulm/Nulm";
import Circular from "./components/Circular/Circular";
import TendersQuotations from "./components/TendersQuotations/TendersQuotations";
import Administration from "./components/Administration/Administration";
import PropertyTax from "./components/PropertyTax/PropertyTax";
import BirthCertificate from "./components/BirthCertificate/BirthCertificate";
import DeathCertificate from "./components/DeathCertificate/DeathCertificate";
import ETender from "./components/ETender/ETender";
import loaderimage from "./assets/loader_trans.gif";
import ContactUs from "./components/ContactUs/ContactUs";
import Departments from "./components/Departments/Departments";
import ElectricalDept from './components/ElectricalDept/ElectricalDept';
import EducationDept from './components/EducationDept/EducationDept';
import ElectionDept from './components/ElectionDept/ElectionDept';
import GardenDept from './components/GardenDept/GardenDept';
import LBTDept from './components/LBTDept/LBTDept';
import LegalDept from './components/LegalDept/LegalDept';
import MarketLicensingDept from "./components/MarketLicensingDept/MarketLicensingDept";
import MedicalHealthDept from "./components/MedicalHealthDept/MedicalHealthDept";
import MunicipalSecretaryDept from "./components/MunicipalSecretaryDept/MunicipalSecretaryDept";
import PropertyTaxDept from "./components/PropertyTaxDept/PropertyTaxDept";
import PublicHealthDept from "./components/PublicHealthDept/PublicHealthDept";
import PublicRelationshipDept from "./components/PublicRelationshipDept/PublicRelationshipDept";
import PublicWorksDept from "./components/PublicWorksDept/PublicWorksDept";
import SecurityDept from "./components/SecurityDept/SecurityDept";
import StoreDept from "./components/StoreDept/StoreDept";
import SolidWasteManagementDept from "./components/SolidWasteManagementDept/SolidWasteManagementDept";
import SportsDept from "./components/SportsDept/SportsDept";
import WaterSupplyDept from "./components/WaterSupplyDept/WaterSupplyDept";
import WomenChildDevelopment from "./components/WomenChildDevelopment/WomenChildDevelopment";
import WardOffice from "./components/WardOffice/WardOffice";
import TermsConditions from "./components/TermsConditions/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import HyperlinkPolicy from "./components/HyperlinkPolicy/HyperlinkPolicy";
import AccessibilityStatement from "./components/AccessibilityStatement/AccessibilityStatement";
import AnnualFinancialStatement from "./components/AnnualFinancialStatement/AnnualFinancialStatement";
import MunicipalMeeting from "./components/MunicipalMeeting/MunicipalMeeting";
import ElectedMember from "./components/ElectedMember/ElectedMember";
import SWMSystem from "./components/SWMSystem/SWMSystem";
import PressNote from "./components/PressNote/PressNote";
import PTDept from "./components/PTDept/PTDept";
import RTI from "./components/RTI/RTI";
import UpcomingProjects from "./components/UpcomingProjects/UpcomingProjects";
import Committee from "./components/Committee/Committee";
import Budget from "./components/Budget/Budget";
import Resolutions from "./components/Resolutions/Resolutions";
import ENews from "./components/ENews/ENews";
import Policies from "./components/Policies/Policies";
import Agenda from "./components/Agenda/Agenda";
import DeputyMayorOffice from "./components/DeputyMayorOffice/DeputyMayorOffice";
import MayorOffice from "./components/MayorOffice/MayorOffice";
import Quotations from "./components/Quotations/Quotations";
import StandingCommittee from "./components/StandingCommittee/StandingCommittee";
import SubjectCommittee from "./components/SubjectCommittee/SubjectCommittee";
import Authorities from "./components/Authorities/Authorities";
import WardCommittee from "./components/WardCommittee/WardCommittee";
import CustomerSupport from "./components/CustomerSupport/CustomerSupport";
import ScreenReader from "./components/ScreenReader/ScreenReader";
import ProactiveDisclosure from "./components/ProactiveDisclosure/ProactiveDisclosure";
import SubRti from "./components/SubRti/SubRti";
import RecordsDepartment from "./components/RecordsDepartment/RecordsDepartment"
import { useTranslation } from "react-i18next";
import FireDept from "./components/FireDept/FireDept";

function App() {
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(i18n.language);
  }, [i18n]);

  useEffect(() => {
    AOS.init({
      duration: 600,
      delay: 100,
      easing: "ease-in-out",
      once: true,
    });

    const timer = setTimeout(() => {
      setLoading(false);
      AOS.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const GlobalFontHandler = () => {
    const location = useLocation();

    useEffect(() => {
      const applyFontBasedOnLanguage = () => {
        const translatedText = document.querySelector("html").lang;
        if (translatedText === "mr") {
          applyFontFamily("Mukta, sans-serif");
        } else {
          applyFontFamily("");
        }
      };

      // Apply font family on route change
      applyFontBasedOnLanguage();
    }, [location]);

    return null; // This component doesn't render anything
  };

  const applyFontFamily = (font) => {
    document.body.style.fontFamily = font;
    document.documentElement.style.setProperty("--global-font-family", font);
    document.querySelectorAll("*").forEach((el) => {
      el.style.fontFamily = font;
    });
  };

  return (
    <>
      {loading ? (
        <div className="loader-container d-flex items-center">
          <img
            src={loaderimage}
            alt="Loading..."
            className="gif-loader"
            style={{ width: "130px", height: "130px" }}
          />
        </div>
      ) : (
        <>
          <GlobalFontHandler /> {/* Add the GlobalFontHandler here */}
          <Header data-aos="fade-down" />
          <StickyFeedback data-aos="fade-right" />
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home data-aos="fade-up" />} />
            <Route path="/screen-reader-access" element={<ScreenReader data-aos="fade-up" />} />

            {/* RTS */}
            <Route path="/rts-act-2015" element={<RTS data-aos="fade-up" />} />

            {/* About UMC */}
            <Route path="/location" element={<Location data-aos="fade-left" />} />
            <Route path="/history" element={<History data-aos="zoom-in" />} />
            <Route path="/commissioner" element={<Commissioner data-aos="fade-up" />} />
            <Route path="/tourism" element={<Tourism data-aos="fade-up" />} />

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
            <Route path="/computer-department" element={<ComputerIt data-aos="fade-left" />} />
            <Route path="/disaster-management-department" element={<DisasterManagement data-aos="fade-right" />} />
            <Route path="/education-department" element={<EducationDept />} />
            <Route path="/election-department" element={<ElectionDept />} />
            <Route path="/electrical-department" element={<ElectricalDept />} />
            <Route path="/encroachment-department" element={<EncroachmentDepartment data-aos="flip-right" />} />
            <Route path="/environment-department" element={<EnvironmentDepartment data-aos="zoom-in" />} />
            <Route path="/estate-department" element={<EstateDepartment data-aos="zoom-in" />} />
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
            <Route path="/security-department" element={<SecurityDept />} />
            <Route path="/solid-waste-management-department" element={<SolidWasteManagementDept />} />
            <Route path="/sports-department" element={<SportsDept />} />
            <Route path="/store-department" element={<StoreDept />} />
            <Route path="/town-planning-department" element={<TownPlanning data-aos="fade-left" />} />
            <Route path="/vehicle-department" element={<VehicleDepartment data-aos="flip-left" />} />
            <Route path="/water-supply-department" element={<WaterSupplyDept />} />
            <Route path="/women-and-child-department" element={<WomenChildDevelopment />} />
            <Route path="/records-department" element={<RecordsDepartment />} />
            <Route path="/fire-department" element={<FireDept />} />



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

            {/* Citizen Services */}
            <Route path="/press-note" element={<PressNote />} />
            <Route path="/property-tax-dept" element={<PTDept />} />
            <Route path="/rti" element={<RTI />} />
            <Route path="/solid-waste-management-system" element={<SWMSystem />} />
            <Route path="/tenders-and-quotations" element={<TendersQuotations data-aos="zoom-in-up" />} />

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
            <Route path="/proactive-disclosure" element={<ProactiveDisclosure />} />
            <Route path="/sub-rti" element={<SubRti />} />
          </Routes>
          <BottomSlider data-aos="fade-up" />
          <WhatsAppChat data-aos="fade-right" />
          <Footer data-aos="fade-down" />
        </>
      )}
    </>
  );
}

export default App;