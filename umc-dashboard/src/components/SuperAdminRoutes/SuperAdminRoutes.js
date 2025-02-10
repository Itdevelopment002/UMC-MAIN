import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainMenu from "../MainMenu/MainMenu";
import AddMainMenu from "../MainMenu/AddMainMenu";
import Slider from "../Slider/Slider";
import AddSlider from "../Slider/AddSlider";
import Contact from "../Contact/Contact";
import AddPrivacyPolicy from "../PrivacyPolicy/AddPrivacyPolicy";
import PrivacyPolicy from "../PrivacyPolicy/PrivacyPolicy";
import MinisterDetails from "../MinisterDetails/MinisterDetails";
import AddMinisterDetails from "../MinisterDetails/AddMinisterDetails";
import CitizeServices from "../CitizenServices/CitizenServices";
import AddCitizeServices from "../CitizenServices/AddCitizenServices";
import HomeVideo from "../HomeVideo/HomeVideo";
import AddHomeVideo from "../HomeVideo/AddHomeVideo";
import CurrentUpdate from "../CurrentUpdate/CurrentUpdate";
import AddCurrentUpdate from "../CurrentUpdate/AddCurrentUpdate";
import UMCNews from "../UMCNews/UMCNews";
import AddUMCNews from "../UMCNews/AddUMCNews";
import EServices from "../EServices/EServices";
import AddEServices from "../EServices/AddEServices";
import Initiatives from "../Initiatives/Initiatives";
import AddInitiatives from "../Initiatives/AddInitiatives";
import BottomSlider from "../BottomSlider/BottomSlider";
import AddBottomSlider from "../BottomSlider/AddBottomSlider";
import HomeServices2 from "../HomeServices2/HomeServices2";
import AddHomeServices2 from "../HomeServices2/AddHomeServices2";
import HomeGallery from "../HomeGallery/HomeGallery";
import AddHomeGallery from "../HomeGallery/AddHomeGallery";
import Footer from "../Footer/Footer";
import AddContactInfo from "../Footer/AddContactInfo";
import AddQuickLinks from "../Footer/AddQuickLinks";
import AddHelp from "../Footer/AddHelp";
import AddOnlineServices from "../Footer/AddOnlineServices";
import Information from "../Information/Information";
import AddInformation from "../Information/AddInformation";
import HomeProjects from "../Projects/HomeProjects";
import AddHomeProjects from "../Projects/AddHomeProjects";
import HomeService1 from "../HomeService1/HomeService1";
import AddHomeService1 from "../HomeService1/AddHomeService1";
import CitizenCommunication from "../CitizenCommunication/CitizenCommunication";
import AddPortalServices from "../CitizenCommunication/AddPortalServices";
import AddEmergencyServices from "../CitizenCommunication/AddEmergencyServices";
import AddDataTable1 from "../Location/AddDataTable1";
import AddDataTable2 from "../Location/AddDataTable2";
import AddDataTable3 from "../Location/AddDataTable3";
import AddDataTable4 from "../Location/AddDataTable4";
import Location from "../Location/Location";
import Commissioner from "../Commissioner/Commissioner";
import AddCommissionerDetails from "../Commissioner/AddCommissionerDetails";
import AddCommissionerDesc from "../Commissioner/AddCommissionerDesc";
import UmcHistory from "../UmcHistory/UmcHistory";
import AddHistoryImage from "../UmcHistory/AddHistoryImage";
import Tourism from "../Tourism/Tourism";
import AddTourism from "../Tourism/AddTourism";
import AddDepartmentPage from "../DepartmentPage/AddDepartmentPage";
import DepartmentPage from "../DepartmentPage/DepartmentPage";
import AddDepartmentBanner from "../DepartmentInformation/AddDepartmentBanner";
import AddHodDetails from "../DepartmentInformation/AddHodDetails";
import DepartmentInformation from "../DepartmentInformation/DepartmentInformation";
import AddDeptPdfs from "../DepartmentInformation/AddDeptPdfs";
import AddDeptDescription from "../DepartmentInformation/AddDeptDescription";
import AddAdministration from "../Administration/AddAdministration";
import Administration from "../Administration/Administration";
import Annual from "../AnnualFinancial/AnnualFinance";
import AddAnnual from "../AnnualFinancial/AddAnnualFinance";
import WardOffice from "../WardOffice/WardOffice";
import AddWardOffice from "../WardOffice/AddWardOffice";
import Resolutions from "../Resolution/Resolution";
import AddResolution from "../Resolution/AddResolution";
import Policies from "../Policies/Policies";
import AddPolicies from "../Policies/AddPolicies";
import Agenda from "../Agenda/Agenda";
import AddAgenda from "../Agenda/AddAgenda";
import ENews from "../eNews/eNews";
import AddeNews from "../eNews/AddeNews";
import ElectedMember from "../ElectedMember/ElectedMember";
import AddElectedMember from "../ElectedMember/AddElectedMember";
import Budget from "../Budget/Budget";
import AddBudget from "../Budget/AddBudget";
import MuncipalMeeting from "../MuncipalMeeting/MuncipalMeeting";
import AddMuncipalMeeting from "../MuncipalMeeting/AddMuncipalMeeting";
import AddHyperlinkPolicy from "../HyperlinkPolicy/AddHyperlinkPolicy";
import HyperlinkPolicy from "../HyperlinkPolicy/HyperlinkPolicy";
import AddRecruitment from "../Recruitment/AddRecruitment";
import Recruitment from "../Recruitment/Recruitment";
import ContactUs from "../ContactUs/ContactUs";
import AddContact from "../ContactUs/AddContact";
import AddWard from "../ContactUs/AddWard";
import AddRightToService from "../RightToService/AddRightToService";
import RightToService from "../RightToService/RightToService";
import SolidWasteSystem from "../SolidWasteSystem/SolidWasteSystem";
import AddSolidWasteSystem from "../SolidWasteSystem/AddSolidWasteSystem";
import Tenders from "../Tenders/Tenders";
import AddTenders from "../Tenders/AddTenders";
import PressNote from "../PressNote/PressNote";
import AddPressNote from "../PressNote/AddPressNote";
import PropertyTaxDept from "../PropertyTaxDept/PropertyTaxDept";
import AddPropertyTaxDept from "../PropertyTaxDept/AddPropertyTaxDept";
import RTI from "../RTI/RTI";
import AddRTI from "../RTI/AddRTI";
import AddWomenCommittee from "../UmcCommittee/AddWomenCommittee";
import AddWardCommittee from "../UmcCommittee/AddWardCommittee";
import AddStandingCommittee from "../UmcCommittee/AddStandingCommittee";
import UmcCommittee from "../UmcCommittee/UmcCommitttee";
import AddCirculars from "../Circulars/AddCirculars";
import Circulars from "../Circulars/Circulars";
import AddOnlineHomeServices from "../OnlineHomeServices/AddOnlineHomeServices";
import OnlineHomeServices from "../OnlineHomeServices/OnlineHomeServices";
import PhotosGallery from "../PhotosGallery/PhotosGalllery";
import AddCategory from "../PhotosGallery/AddCategory";
import AddCategoryImage from "../PhotosGallery/AddCategoryImages";
import VideoGallery from "../VideoGallery/VideoGallery";
import AddVideoCategory from "../VideoGallery/AddVideoCategory";
import AddCategoryVideos from "../VideoGallery/AddCategoryVideos";
import AddBanner from "../Banner/AddBanner";
import Banner from "../Banner/Banner";
import ViewProfile from "../Profile/ViewProfile";
import EditProfile from "../Profile/EditProfile";
import ScreenReader from "../ScreenReader/ScreenReader";
import AddScreenReader from "../ScreenReader/AddScreenReader";
import api from "../api";
import ProactiveDisclosure from "../ProactiveDisclosure/ProactiveDisclosure";
import AddProactiveDisclosure from "../ProactiveDisclosure/AddProactiveDisclosure";
import SubRti from "../SubRti/SubRti";
import AddSubRti from "../SubRti/AddSubRti";
import AddProjectImages from "../ProjectDetails/AddProjectImages";
import AddProjectCategory from "../ProjectDetails/AddProjectCategory";
import ProjectGallery from "../ProjectDetails/ProjectGallery";


function SuperAdminRoutes() {
  const [departments, setDepartments] = useState([]);
  const [departmentDatas, setDepartmentDatas] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/public_disclosure");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDepartmentsData = async () => {
    try {
      const response = await api.get("/generaladmindepartment");
      setDepartmentDatas(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDepartmentData = async () => {
    try {
      const response = await api.get("/department-datas");
      setDepartmentData(response.data);
    } catch (error) {
      console.error("Error fetching department data:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchDepartmentData();
    fetchDepartmentsData();
  }, []);

  return (
    <Routes>
      <Route path="/home" element={<MainMenu />} />
      <Route path="/add-main-menu" element={<AddMainMenu />} />
      <Route path="/slider" element={<Slider />} />
      <Route path="/add-slider" element={<AddSlider />} />
      <Route path="/minister" element={<MinisterDetails />} />
      <Route path="/add-minister" element={<AddMinisterDetails />} />
      <Route path="/citizen-services" element={<CitizeServices />} />
      <Route path="/add-citizen-services" element={<AddCitizeServices />} />
      <Route path="/home-video" element={<HomeVideo />} />
      <Route path="/add-home-video" element={<AddHomeVideo />} />
      <Route path="/current-update" element={<CurrentUpdate />} />
      <Route path="/add-current-update" element={<AddCurrentUpdate />} />
      <Route path="/umc-news" element={<UMCNews />} />
      <Route path="/add-umc-news" element={<AddUMCNews />} />
      <Route path="/eservices" element={<EServices />} />
      <Route path="/add-eservices" element={<AddEServices />} />
      <Route path="/initiatives" element={<Initiatives />} />
      <Route path="/add-initiatives" element={<AddInitiatives />} />
      <Route path="/bottom-slider" element={<BottomSlider />} />
      <Route path="/add-bottom-slider" element={<AddBottomSlider />} />
      <Route path="/home-services2" element={<HomeServices2 />} />
      <Route path="/add-home-services2" element={<AddHomeServices2 />} />
      <Route path="/home-gallery" element={<HomeGallery />} />
      <Route path="/add-home-gallery" element={<AddHomeGallery />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/add-quick-links" element={<AddQuickLinks />} />
      <Route path="/add-help" element={<AddHelp />} />
      <Route path="/add-online-services" element={<AddOnlineServices />} />
      <Route path="/information" element={<Information />} />
      <Route path="/add-information" element={<AddInformation />} />
      <Route path="/home-projects" element={<HomeProjects />} />
      <Route path="/add-home-projects" element={<AddHomeProjects />} />
      <Route path="/home-services1" element={<HomeService1 />} />
      <Route path="/add-home-services1" element={<AddHomeService1 />} />
      <Route path="/citizen-communication" element={<CitizenCommunication />} />
      <Route path="/add-portal-services" element={<AddPortalServices />} />
      <Route path="/add-emergency-services" element={<AddEmergencyServices />} />
      <Route path="/location" element={<Location />} />
      <Route path="/add-datatable1" element={<AddDataTable1 />} />
      <Route path="/add-datatable2" element={<AddDataTable2 />} />
      <Route path="/add-datatable3" element={<AddDataTable3 />} />
      <Route path="/add-datatable4" element={<AddDataTable4 />} />
      <Route path="/commissioner" element={<Commissioner />} />
      <Route path="/add-commissioner-details" element={<AddCommissionerDetails />} />
      <Route path="/add-commissioner-desc" element={<AddCommissionerDesc />} />
      <Route path="/history" element={<UmcHistory />} />
      <Route path="/add-historyImage" element={<AddHistoryImage />} />
      <Route path="/tourism" element={<Tourism />} />
      <Route path="/add-tourism" element={<AddTourism />} />
      <Route path="/departments" element={<DepartmentPage />} />
      <Route path="/add-departments" element={<AddDepartmentPage />} />
      <Route path="/department-information" element={<DepartmentInformation />} />
      <Route path="/add-department-banner" element={<AddDepartmentBanner />} />
      <Route path="/add-hod-details" element={<AddHodDetails />} />
      <Route path="/add-department-pdfs" element={<AddDeptPdfs />} />
      <Route path="/add-department-description" element={<AddDeptDescription />} />
      <Route path="/add-adminstration" element={<AddAdministration />} />
      <Route path="/adminstration" element={<Administration />} />
      <Route path="/annual-financial-statement" element={<Annual />} />
      <Route path="/add-annual-financial-statement" element={<AddAnnual />} />
      <Route path="/ward-office" element={<WardOffice />} />
      <Route path="/add-ward-office" element={<AddWardOffice />} />
      <Route path="/resolution" element={<Resolutions />} />
      <Route path="/add-resolution" element={<AddResolution />} />
      <Route path="/policies" element={<Policies />} />
      <Route path="/add-policies" element={<AddPolicies />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/add-agenda" element={<AddAgenda />} />
      <Route path="/enews-letter" element={<ENews />} />
      <Route path="/add-enews-letter" element={<AddeNews />} />
      <Route path="/elected-member" element={<ElectedMember />} />
      <Route path="/add-elected-member" element={<AddElectedMember />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/add-budget" element={<AddBudget />} />
      <Route path="/muncipal-meeting" element={<MuncipalMeeting />} />
      <Route path="/add-muncipal-meeting" element={<AddMuncipalMeeting />} />
      <Route path="/recruitment" element={<Recruitment />} />
      <Route path="/add-recruitment" element={<AddRecruitment />} />
      <Route path="/add-privacy-policy" element={<AddPrivacyPolicy />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/hyperlink-policy" element={<HyperlinkPolicy />} />
      <Route path="/add-hyperlink-policy" element={<AddHyperlinkPolicy />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/add-contact-info" element={<AddContact />} />
      <Route path="/add-ward-info" element={<AddWard />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/rts" element={<RightToService />} />
      <Route path="/add-rts" element={<AddRightToService />} />
      <Route path="/swms" element={<SolidWasteSystem />} />
      <Route path="/add-swms" element={<AddSolidWasteSystem />} />
      <Route path="/tenders-quotations" element={<Tenders />} />
      <Route path="/add-tenders-quotations" element={<AddTenders />} />
      <Route path="/press-note" element={<PressNote />} />
      <Route path="/add-press-note" element={<AddPressNote />} />
      <Route path="/property-tax-department" element={<PropertyTaxDept />} />
      <Route path="/add-property-tax-department" element={<AddPropertyTaxDept />} />
      <Route path="/rti" element={<RTI />} />
      <Route path="/add-rti" element={<AddRTI />} />
      <Route path="/umc-committee" element={<UmcCommittee />} />
      <Route path="/add-standing-committee" element={<AddStandingCommittee />} />
      <Route path="/add-women-committee" element={<AddWomenCommittee />} />
      <Route path="/add-ward-committee" element={<AddWardCommittee />} />
      <Route path="/circulars" element={<Circulars />} />
      <Route path="/add-circulars" element={<AddCirculars />} />
      <Route path="/online-home-services" element={<OnlineHomeServices />} />
      <Route path="/add-online-home-services" element={<AddOnlineHomeServices />} />
      <Route path="/photo-gallery" element={<PhotosGallery />} />
      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/add-category-images" element={<AddCategoryImage />} />
      <Route path="/video-gallery" element={<VideoGallery />} />
      <Route path="/add-video-category" element={<AddVideoCategory />} />
      <Route path="/add-category-videos" element={<AddCategoryVideos />} />
      <Route path="/banner" element={<Banner />} />
      <Route path="/add-banner" element={<AddBanner />} />
      <Route path="/add-contact" element={<AddContactInfo />} />
      <Route path="/view-profile/:id" element={<ViewProfile />} />
      <Route path="/edit-profile/:id" element={<EditProfile />} />
      <Route path="/screen-reader-access" element={<ScreenReader />} />
      <Route path="/add-screen-reader-access" element={<AddScreenReader />} />
      <Route path="/proactive-disclosure" element={<ProactiveDisclosure />} />
      <Route path="/add-proactive-disclosure" element={<AddProactiveDisclosure />} />
      <Route path="/sub-rti" element={<SubRti />} />
      <Route path="/add-sub-rti" element={<AddSubRti />} />
      <Route path="/project-details" element={<ProjectGallery />} />
      <Route path="/add-project-images" element={<AddProjectImages />} />
      <Route path="/add-project-category" element={<AddProjectCategory />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default SuperAdminRoutes;
