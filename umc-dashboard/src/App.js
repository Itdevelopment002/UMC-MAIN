import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import "./assets/css/bootstrap-datetimepicker.min.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/dataTables.bootstrap4.min.css";
import "./assets/css/font-awesome.min.css";
import "./assets/css/fullcalendar.min.css";
import "./assets/css/select2.min.css";
import "./assets/css/tagsinput.css";
import loaderimage from "./assets/img/loader_trans.gif";
// aniket

import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import MainMenu from "./components/MainMenu/MainMenu";
import AddMainMenu from "./components/MainMenu/AddMainMenu";
import MinisterDetails from "./components/MinisterDetails/MinisterDetails";
import AddMinisterDetails from "./components/MinisterDetails/AddMinisterDetails";
import Slider from "./components/Slider/Slider";
import AddSlider from "./components/Slider/AddSlider";
import CurrentUpdate from "./components/CurrentUpdate/CurrentUpdate";
import AddCurrentUpdate from "./components/CurrentUpdate/AddCurrentUpdate";
import UMCNews from "./components/UMCNews/UMCNews";
import AddUMCNews from "./components/UMCNews/AddUMCNews";
import Initiatives from "./components/Initiatives/Initiatives";
import AddInitiatives from "./components/Initiatives/AddInitiatives";
import EServices from "./components/EServices/EServices";
import AddEServices from "./components/EServices/AddEServices";
import Information from "./components/Information/Information";
import AddInformation from "./components/Information/AddInformation";
import CitizeServices from "./components/CitizenServices/CitizenServices";
import AddCitizeServices from "./components/CitizenServices/AddCitizenServices";
import HomeVideo from "./components/HomeVideo/HomeVideo";
import AddHomeVideo from "./components/HomeVideo/AddHomeVideo";
import HomeGallery from "./components/HomeGallery/HomeGallery";
import AddHomeGallery from "./components/HomeGallery/AddHomeGallery";
import CitizenCommunication from "./components/CitizenCommunication/CitizenCommunication";
import AddPortalServices from "./components/CitizenCommunication/AddPortalServices";
import AddEmergencyServices from "./components/CitizenCommunication/AddEmergencyServices";
import HomeService1 from "./components/HomeService1/HomeService1";
import AddHomeService1 from "./components/HomeService1/AddHomeService1";
import HomeServices2 from "./components/HomeServices2/HomeServices2";
import AddHomeServices2 from "./components/HomeServices2/AddHomeServices2";
import BottomSlider from "./components/BottomSlider/BottomSlider";
import AddBottomSlider from "./components/BottomSlider/AddBottomSlider";
import SolidWasteSystem from "./components/SolidWasteSystem/SolidWasteSystem";
import AddSolidWasteSystem from "./components/SolidWasteSystem/AddSolidWasteSystem";
import PressNote from "./components/PressNote/PressNote";
import AddPressNote from "./components/PressNote/AddPressNote";
import PropertyTaxDept from "./components/PropertyTaxDept/PropertyTaxDept";
import AddPropertyTaxDept from "./components/PropertyTaxDept/AddPropertyTaxDept";
import EmpInfo from "./components/EmployeeInfo/EmployeeInfo";
import AddEmpInfo from "./components/EmployeeInfo/AddEmployeeInfo";
import Location from "./components/Location/Location";
import AddDataTable1 from "./components/Location/AddDataTable1";
import AddDataTable2 from "./components/Location/AddDataTable2";
import AddDataTable3 from "./components/Location/AddDataTable3";
import AddDataTable4 from "./components/Location/AddDataTable4";
import AddCommissionerData from "./components/Commissioner/AddCommissionerData";
import Commissioner from "./components/Commissioner/Commissioner";
import AddAddtCommissionerData from "./components/AddtCommissioner/AddAddtCommissionerData";
import AddtCommissioner from "./components/AddtCommissioner/AddtCommissioner";
import AddAsstCommissionerData from "./components/AsstCommissioner/AddAsstCommissionerData";
import AsstCommissioner from "./components/AsstCommissioner/AsstCommissioner";
import AddDeptCommissionerData from "./components/DeptCommissioner/AddDeptCommissionerData";
import DeptCommissioner from "./components/DeptCommissioner/DeptCommissioner";
import UmcHistory from "./components/UmcHistory/UmcHistory";
import AddHistoryImage from "./components/UmcHistory/AddHistoryImage";
import Tourism from "./components/Tourism/Tourism";
import AddTourism from "./components/Tourism/AddTourism";
import AdministrativeStructure from "./components/AdministrativeStructure/AdministrativeStructure";
import AddStructureTab1 from "./components/AdministrativeStructure/AddStructureTab1";
import AddStructureTab2 from "./components/AdministrativeStructure/AddStructureTab2";
import AddStructureTab3 from "./components/AdministrativeStructure/AddStructureTab3";
import AddStructureTab4 from "./components/AdministrativeStructure/AddStructureTab4";
import Administration from "./components/Administration/Administration";
import AddAdministration from "./components/Administration/AddAdministration";
import Annual from "./components/AnnualFinancial/AnnualFinance";
import AddAnnual from "./components/AnnualFinancial/AddAnnualFinance";
import ElectedMember from "./components/ElectedMember/ElectedMember";
import AddElectedMember from "./components/ElectedMember/AddElectedMember";
import ENews from "./components/eNews/eNews";
import AddeNews from "./components/eNews/AddeNews";
import MuncipalMeeting from "./components/MuncipalMeeting/MuncipalMeeting";
import AddMuncipalMeeting from "./components/MuncipalMeeting/AddMuncipalMeeting";
import Agenda from "./components/Agenda/Agenda";
import AddAgenda from "./components/Agenda/AddAgenda";
import Budget from "./components/Budget/Budget";
import AddBudget from "./components/Budget/AddBudget";
import UmcCommittee from "./components/UmcCommittee/UmcCommitttee";
import AddStandingCommittee from "./components/UmcCommittee/AddStandingCommittee";
import AddWardCommittee from "./components/UmcCommittee/AddWardCommittee";
import AddWomenCommittee from "./components/UmcCommittee/AddWomenCommittee";
import Policies from "./components/Policies/Policies";
import AddPolicies from "./components/Policies/AddPolicies";
import Resolutions from "./components/Resolution/Resolution";
import AddResolution from "./components/Resolution/AddResolution";
import WardOffice from "./components/WardOffice/WardOffice";
import AddWardOffice from "./components/WardOffice/AddWardOffice";
import DepartmentPage from "./components/DepartmentPage/DepartmentPage";
import AddDepartmentPage from "./components/DepartmentPage/AddDepartmentPage";
import DepartmentInformation from "./components/DepartmentInformation/DepartmentInformation";
import AddDepartmentBanner from "./components/DepartmentInformation/AddDepartmentBanner";
import AddDeptDescription from "./components/DepartmentInformation/AddDeptDescription";
import AddHodDetails from "./components/DepartmentInformation/AddHodDetails";
import AddDeptPdfs from "./components/DepartmentInformation/AddDeptPdfs";
import AuditReport from "./components/AuditReport/AuditReport";
import AddAuditReport from "./components/AuditReport/AddAuditReport";
import Tenders from "./components/Tenders/Tenders";
import AddTenders from "./components/Tenders/AddTenders";
import RightToService from "./components/RightToService/RightToService";
import AddRightToService from "./components/RightToService/AddRightToService";
import Circulars from "./components/Circulars/Circulars";
import AddCirculars from "./components/Circulars/AddCirculars";
import OnlineHomeServices from "./components/OnlineHomeServices/OnlineHomeServices";
import AddOnlineHomeServices from "./components/OnlineHomeServices/AddOnlineHomeServices";
import PhotosGallery from "./components/PhotosGallery/PhotosGallery";
import AddCategory from "./components/PhotosGallery/AddCategory";
import AddCategoryImage from "./components/PhotosGallery/AddCategoryImages";
import VideoGallery from "./components/VideoGallery/VideoGallery";
import AddVideoCategory from "./components/VideoGallery/AddVideoCategory";
import AddCategoryVideos from "./components/VideoGallery/AddCategoryVideos";
import HomeProjects from "./components/HomeProjects/HomeProjects";
import AddHomeProjects from "./components/HomeProjects/AddHomeProjects";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import AddProjectCategory from "./components/ProjectDetails/AddProjectCategory";
import AddProjectDescription from "./components/ProjectDetails/AddProjectDescription";
import RTI from "./components/RTI/RTI";
import AddRTI from "./components/RTI/AddRTI";
import ProactiveDisclosure from "./components/ProactiveDisclosure/ProactiveDisclosure";
import AddProactiveDisclosure from "./components/ProactiveDisclosure/AddProactiveDisclosure";
import SubRti from "./components/SubRti/SubRti";
import AddSubRti from "./components/SubRti/AddSubRti";
import Recruitment from "./components/Recruitment/Recruitment";
import AddRecruitment from "./components/Recruitment/AddRecruitment";
import Banner from "./components/Banner/Banner";
import AddBanner from "./components/Banner/AddBanner";
import ScreenReader from "./components/ScreenReader/ScreenReader";
import AddScreenReader from "./components/ScreenReader/AddScreenReader";
import ContactUs from "./components/ContactUs/ContactUs";
import AddContact from "./components/ContactUs/AddContact";
import AddWard from "./components/ContactUs/AddWard";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy";
import AddPrivacyPolicy from "./components/PrivacyPolicy/AddPrivacyPolicy";
import HyperlinkPolicy from "./components/HyperlinkPolicy/HyperlinkPolicy";
import AddHyperlinkPolicy from "./components/HyperlinkPolicy/AddHyperlinkPolicy";
import Celebration from "./components/Celebration/Celebration";
import Footer from "./components/Footer/Footer";
import AddContactInfo from "./components/Footer/AddContactInfo";
import AddQuickLinks from "./components/Footer/AddQuickLinks";
import AddHelp from "./components/Footer/AddHelp";
import AddOnlineServices from "./components/Footer/AddOnlineServices";
import ViewProfile from "./components/Profile/ViewProfile";
import EditProfile from "./components/Profile/EditProfile";
import AddTableHeading from "./components/AdministrativeStructure/AddTableHeading";
import AddUsers from "./components/Users/AddUsers";
import Users from "./components/Users/Users";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import CodeVerification from "./components/CodeVerification/CodeVerification";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import api from "../src/components/api";
import { jwtDecode } from "jwt-decode";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const LOGOUT_TIME = 20 * 60 * 1000;
  const navigate = useNavigate();

  const handleAutoLogout = () => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date().getTime();
      if (currentTime - loginTime > LOGOUT_TIME) {
        handleLogout();
        navigate("/");
      }
    }
  };

  const handleUserActivity = () => {
    localStorage.setItem("loginTime", new Date().getTime());
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoLogout();
    }, 1000);

    return () => clearInterval(interval);
    //eslint-disable-next-line
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setLoading(true);
    setIsAuthenticated(true);
    localStorage.setItem("loginTime", new Date().getTime());
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout", {});
      localStorage.removeItem("authToken");
      localStorage.removeItem("lastVisitedRoute");
      localStorage.removeItem("loginTime");
      setUserData({});
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [location]);

  useEffect(() => {
    const savedRoute = localStorage.getItem("lastVisitedRoute");
    if (savedRoute && savedRoute !== location.pathname) {
      window.location.href = savedRoute;
    }
    //eslint-disable-next-line
  }, []);

  return (
    <>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password-verification" element={<CodeVerification />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
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
              <Header onLogout={handleLogout} userDepartment={userData} />
              <div>
                <Sidebar user={userData} />
                <div>
                  <Routes>

                    <Route path="/" element={<Navigate to="/home" replace />} />

                    {userData?.role === "Superadmin" && (
                      <>
                        {/* Header */}
                        <Route path="/home" element={<MainMenu />} />
                        <Route path="/add-main-menu" element={<AddMainMenu />} />

                        {/* Home */}
                        <Route path="/minister" element={<MinisterDetails />} />
                        <Route path="/add-minister" element={<AddMinisterDetails />} />
                        <Route path="/slider" element={<Slider />} />
                        <Route path="/add-slider" element={<AddSlider />} />
                        <Route path="/current-update" element={<CurrentUpdate />} />
                        <Route path="/add-current-update" element={<AddCurrentUpdate />} />
                        <Route path="/umc-news" element={<UMCNews />} />
                        <Route path="/add-umc-news" element={<AddUMCNews />} />
                        <Route path="/initiatives" element={<Initiatives />} />
                        <Route path="/add-initiatives" element={<AddInitiatives />} />
                        <Route path="/eservices" element={<EServices />} />
                        <Route path="/add-eservices" element={<AddEServices />} />
                        <Route path="/information" element={<Information />} />
                        <Route path="/add-information" element={<AddInformation />} />
                        <Route path="/citizen-services" element={<CitizeServices />} />
                        <Route path="/add-citizen-services" element={<AddCitizeServices />} />
                        <Route path="/home-video" element={<HomeVideo />} />
                        <Route path="/add-home-video" element={<AddHomeVideo />} />
                        <Route path="/home-gallery" element={<HomeGallery />} />
                        <Route path="/add-home-gallery" element={<AddHomeGallery />} />
                        <Route path="/citizen-communication" element={<CitizenCommunication />} />
                        <Route path="/add-portal-services" element={<AddPortalServices />} />
                        <Route path="/add-emergency-services" element={<AddEmergencyServices />} />
                        <Route path="/home-services1" element={<HomeService1 />} />
                        <Route path="/add-home-services1" element={<AddHomeService1 />} />
                        <Route path="/home-services2" element={<HomeServices2 />} />
                        <Route path="/add-home-services2" element={<AddHomeServices2 />} />
                        <Route path="/bottom-slider" element={<BottomSlider />} />
                        <Route path="/add-bottom-slider" element={<AddBottomSlider />} />
                        <Route path="/swms" element={<SolidWasteSystem />} />
                        <Route path="/add-swms" element={<AddSolidWasteSystem />} />
                        <Route path="/press-note" element={<PressNote />} />
                        <Route path="/add-press-note" element={<AddPressNote />} />
                        <Route path="/property-tax-department" element={<PropertyTaxDept />} />
                        <Route path="/add-property-tax-department" element={<AddPropertyTaxDept />} />
                        <Route path="/emp-info" element={<EmpInfo />} />
                        <Route path="/add-emp-info" element={<AddEmpInfo />} />

                        {/* About UMC */}
                        <Route path="/location" element={<Location />} />
                        <Route path="/add-datatable1" element={<AddDataTable1 />} />
                        <Route path="/add-datatable2" element={<AddDataTable2 />} />
                        <Route path="/add-datatable3" element={<AddDataTable3 />} />
                        <Route path="/add-datatable4" element={<AddDataTable4 />} />
                        <Route path="/commissioner" element={<Commissioner />} />
                        <Route path="/add-commissioner-data" element={<AddCommissionerData />} />
                        <Route path="/additional-commissioner" element={<AddtCommissioner />} />
                        <Route path="/add-addt-commissioner-data" element={<AddAddtCommissionerData />} />
                        <Route path="/deputy-commissioner" element={<DeptCommissioner />} />
                        <Route path="/add-dept-commissioner-data" element={<AddDeptCommissionerData />} />
                        <Route path="/assistant-commissioner" element={<AsstCommissioner />} />
                        <Route path="/add-asst-commissioner-data" element={<AddAsstCommissionerData />} />
                        <Route path="/history" element={<UmcHistory />} />
                        <Route path="/add-historyImage" element={<AddHistoryImage />} />
                        <Route path="/tourism" element={<Tourism />} />
                        <Route path="/add-tourism" element={<AddTourism />} />

                        {/* Administrative Wings */}
                        <Route path="/administrative-structure" element={<AdministrativeStructure />} />
                        <Route path="/add-table-heading" element={<AddTableHeading />} />
                        <Route path="/add-structure-tab1" element={<AddStructureTab1 />} />
                        <Route path="/add-structure-tab2" element={<AddStructureTab2 />} />
                        <Route path="/add-structure-tab3" element={<AddStructureTab3 />} />
                        <Route path="/add-structure-tab4" element={<AddStructureTab4 />} />

                        {/* Corporation */}
                        <Route path="/adminstration" element={<Administration />} />
                        <Route path="/add-adminstration" element={<AddAdministration />} />
                        <Route path="/annual-financial-statement" element={<Annual />} />
                        <Route path="/add-annual-financial-statement" element={<AddAnnual />} />
                        <Route path="/elected-member" element={<ElectedMember />} />
                        <Route path="/add-elected-member" element={<AddElectedMember />} />
                        <Route path="/enews-letter" element={<ENews />} />
                        <Route path="/add-enews-letter" element={<AddeNews />} />
                        <Route path="/muncipal-meeting" element={<MuncipalMeeting />} />
                        <Route path="/add-muncipal-meeting" element={<AddMuncipalMeeting />} />
                        <Route path="/agenda" element={<Agenda />} />
                        <Route path="/add-agenda" element={<AddAgenda />} />
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/add-budget" element={<AddBudget />} />
                        <Route path="/umc-committee" element={<UmcCommittee />} />
                        <Route path="/add-standing-committee" element={<AddStandingCommittee />} />
                        <Route path="/add-ward-committee" element={<AddWardCommittee />} />
                        <Route path="/add-women-committee" element={<AddWomenCommittee />} />
                        <Route path="/policies" element={<Policies />} />
                        <Route path="/add-policies" element={<AddPolicies />} />
                        <Route path="/resolution" element={<Resolutions />} />
                        <Route path="/add-resolution" element={<AddResolution />} />
                        <Route path="/ward-office" element={<WardOffice />} />
                        <Route path="/add-ward-office" element={<AddWardOffice />} />

                        {/* Departments */}
                        <Route path="/departments" element={<DepartmentPage />} />
                        <Route path="/add-departments" element={<AddDepartmentPage />} />
                        <Route path="/department-information" element={<DepartmentInformation />} />
                        <Route path="/add-department-banner" element={<AddDepartmentBanner />} />
                        <Route path="/add-department-description" element={<AddDeptDescription />} />
                        <Route path="/add-hod-details" element={<AddHodDetails />} />
                        <Route path="/add-department-pdfs" element={<AddDeptPdfs />} />
                        <Route path="/audit-report" element={<AuditReport />} />
                        <Route path="/add-audit-report" element={<AddAuditReport />} />

                        {/* Citizen Services */}
                        <Route path="/tenders-quotations" element={<Tenders />} />
                        <Route path="/add-tenders-quotations" element={<AddTenders />} />

                        {/* RTS */}
                        <Route path="/rts" element={<RightToService />} />
                        <Route path="/add-rts" element={<AddRightToService />} />

                        {/* Circulars */}
                        <Route path="/circulars" element={<Circulars />} />
                        <Route path="/add-circulars" element={<AddCirculars />} />

                        {/* Online Services */}
                        <Route path="/online-home-services" element={<OnlineHomeServices />} />
                        <Route path="/add-online-home-services" element={<AddOnlineHomeServices />} />

                        {/* Gallery */}
                        <Route path="/photo-gallery" element={<PhotosGallery />} />
                        <Route path="/add-category" element={<AddCategory />} />
                        <Route path="/add-category-images" element={<AddCategoryImage />} />
                        <Route path="/video-gallery" element={<VideoGallery />} />
                        <Route path="/add-video-category" element={<AddVideoCategory />} />
                        <Route path="/add-category-videos" element={<AddCategoryVideos />} />

                        {/* Upcoming Projects */}
                        <Route path="/home-projects" element={<HomeProjects />} />
                        <Route path="/add-home-projects" element={<AddHomeProjects />} />
                        <Route path="/project-details" element={<ProjectDetails />} />
                        <Route path="/add-project-category" element={<AddProjectCategory />} />
                        <Route path="/add-project-description" element={<AddProjectDescription />} />

                        {/* RTI */}
                        <Route path="/rti" element={<RTI />} />
                        <Route path="/add-rti" element={<AddRTI />} />
                        <Route path="/proactive-disclosure" element={<ProactiveDisclosure />} />
                        <Route path="/add-proactive-disclosure" element={<AddProactiveDisclosure />} />
                        <Route path="/sub-rti" element={<SubRti />} />
                        <Route path="/add-sub-rti" element={<AddSubRti />} />

                        {/* Recruitment */}
                        <Route path="/recruitment" element={<Recruitment />} />
                        <Route path="/add-recruitment" element={<AddRecruitment />} />

                        {/* Banner */}
                        <Route path="/banner" element={<Banner />} />
                        <Route path="/add-banner" element={<AddBanner />} />

                        {/* Screen Reader Access */}
                        <Route path="/screen-reader-access" element={<ScreenReader />} />
                        <Route path="/add-screen-reader-access" element={<AddScreenReader />} />

                        {/* Contact Us */}
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/add-contact-info" element={<AddContact />} />
                        <Route path="/add-ward-info" element={<AddWard />} />

                        {/* Privacy Policy */}
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/add-privacy-policy" element={<AddPrivacyPolicy />} />

                        {/* Hyperlink Policy */}
                        <Route path="/hyperlink-policy" element={<HyperlinkPolicy />} />
                        <Route path="/add-hyperlink-policy" element={<AddHyperlinkPolicy />} />

                        {/* Celebration */}
                        <Route path="/celebration" element={<Celebration />} />

                        {/* Footer */}
                        <Route path="/footer" element={<Footer />} />
                        <Route path="/add-contact" element={<AddContactInfo />} />
                        <Route path="/add-quick-links" element={<AddQuickLinks />} />
                        <Route path="/add-help" element={<AddHelp />} />
                        <Route path="/add-online-services" element={<AddOnlineServices />} />

                        {/* Profile */}
                        <Route path="/users" element={<Users />} />
                        <Route path="/add-users" element={<AddUsers />} />
                        <Route path="/view-profile" element={<ViewProfile onLogout={handleLogout} />} />
                        <Route path="/edit-profile" element={<EditProfile />} />

                        {/* Last Visited */}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                      </>
                    )}

                    {userData?.role === "Admin" && (
                      <>
                        <Route path="/department-information" element={<DepartmentInformation />} />
                        <Route path="/add-department-banner" element={<AddDepartmentBanner />} />
                        <Route path="/add-department-description" element={<AddDeptDescription />} />
                        <Route path="/add-hod-details" element={<AddHodDetails />} />
                        <Route path="/add-department-pdfs" element={<AddDeptPdfs />} />
                        <Route path="/view-profile" element={<ViewProfile onLogout={handleLogout} />} />
                        <Route path="/edit-profile" element={<EditProfile />} />

                        {userData?.permission?.includes("Audit Department") && (
                          <>
                            <Route path="/audit-report" element={<AuditReport />} />
                            <Route path="/add-audit-report" element={<AddAuditReport />} />
                          </>
                        )}

                        <Route path="*" element={<Navigate to="/department-information" replace />} />

                      </>
                    )}

                  </Routes>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;