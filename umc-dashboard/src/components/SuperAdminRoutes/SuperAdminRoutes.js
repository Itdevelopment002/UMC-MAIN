import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Slider from "../Slider/Slider";
import AddSlider from "../Slider/AddSlider";
import MainMenu from "../MainMenu/MainMenu";
import Contact from "../Contact/Contact";
import Notifications from "../Notifications/Notifications";
import Users from "../Users/Users";
import AddUsers from "../Users/AddUsers";
import PropertyHolder from "../PropertyHolder/PropertyHolder";
import AddPropertyHolder from "../PropertyHolder/AddPropertyHolder";
import MuncipalProperties from "../MuncipalProperties/MuncipalProperties";
import AddMuncipalProperties from "../MuncipalProperties/AddMuncipalProperties";
import Schools from "../Schools/Schools";
import AddSchools from "../Schools/AddSchools";
import Garden from "../Garden/Garden";
import AddGarden from "../Garden/AddGarden";
import AddTender from "../Tender/AddTender";
import Tender from "../Tender/Tender";
import News from "../News/News";
import AddNews from "../News/AddNews";
import PhotoGallery from "../PhotoGallery/PhotoGallery";
import AddPhotoGallery from "../PhotoGallery/AddPhotoGallery";
import AddServices from "../Services/AddServices";
import Services from "../Services/Services";
import Electric from "../Electric/Electric";
import AddElectric from "../Electric/AddElectric";
import Roads from "../Roads/Roads";
import AddRoads from "../Roads/AddRoads";
import TreeCensus from "../TreeCensus/TreeCensus";
import AddTreeCensus from "../TreeCensus/AddTreeCensus";
import PondsAndTalao from "../PondsAndTalao/PondsAndTalao";
import AddPondsAndTalao from "../PondsAndTalao/AddPondsAndTalao";
import FireStation from "../FireStation/FireStation";
import AddFireStation from "../FireStation/AddFireStation";
import PrivateHospital from "../PrivateHospital/PrivateHospital";
import AddPrivateHospital from "../PrivateHospital/AddPrivateHospital";
import Health from "../Health/Health";
import History from "../History/History";
import AddHistory from "../History/AddHistory";
import AddCo from "../History/AddCo";
import Wards from "../Wards/Wards";
import AddWards from "../Wards/AddWards";
import ElectedWings from "../ElectedWings/ElectedWings";
import AddElectedWings from "../ElectedWings/AddElectedWings";
import AddFunctions from "../Functions/AddFunctions";
import Functions from "../Functions/Functions";
import AddAwards from "../Awards/AddAwards";
import AddAwardImages from "../Awards/AddAwardImages";
import Awards from "../Awards/Awards";
import AddPreviousOfficers from "../PreviousOfficers/AddPreviousOfficers";
import PreviousOfficers from "../PreviousOfficers/PreviousOfficers";
import AddPreviousPresidents from "../PreviousPresidents/AddPreviousPresidents";
import PreviousPresidents from "../PreviousPresidents/PreviousPresidents";
import AddGeneralAdminDepartment from "../GenAdminDept/AddGeneralAdminDepartment";
import AddGeneralYear from "../GenAdminDept/AddGeneralYear";
import PublicDisclosure from "../PublicDisclosure/PublicDisclosure";
import CitizenCharter from "../CitizenCharter/CitizenCharter";
import AddRtsPdf from "../Rts/AddRtsPdf";
import AddRts from "../Rts/AddRts";
import Rts from "../Rts/Rts";
import AddMainMenu from "../MainMenu/AddMainMenu";
import HomeVideos from "../HomeVideos/HomeVideos";
import AddHomeVideos from "../HomeVideos/AddHomeVideos";
import GovWebsiteLink from "../GovWebsiteLink/GovWebsiteLink";
import AddGovtWebsiteLink from "../GovWebsiteLink/AddGovtWebsiteLink";
import Departments from "../Departments/Departments";
import AddDepartments from "../Departments/AddDepartments";
import AddPondsAndTalaoImages from "../PondsAndTalao/AddPondsAndTalaoImages";
import TermsAndConditions from "../TermsAndConditions/TermsAndConditions";
import AddTermsAndConditions from "../TermsAndConditions/AddTermsAndConditions";
import AddPrivacyPolicy from "../PrivacyPolicy/AddPrivacyPolicy";
import PrivacyPolicy from "../PrivacyPolicy/PrivacyPolicy";
import Publications from "../Publications/Publications";
import AddPublications from "../Publications/AddPublications";
import Downloads from "../Downloads/Downloads";
import AddDevelopmentDescription from "../DevelopmentPlan/AddDevelopmentDescription";
import AddDevelopmentPdf from "../DevelopmentPlan/AddDevelopmentPdf";
import DevelopmentPlan from "../DevelopmentPlan/DevelopmentPlan";
import AddDepartmentData from "../DepartmentData/AddDepartmentData";
import AddYear from "../DepartmentData/AddYear";
import api from "../api";
import MinisterDetails from "../MinisterDetails/MinisterDetails";
import AddMinisterDetails from "../MinisterDetails/AddMinisterDetails";
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
        <Route path="/add-user" element={<AddUsers />} />
        <Route path="/user" element={<Users />} />
        <Route path="/add-privacy-policy" element={<AddPrivacyPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route
          path="/add-terms-and-conditions"
          element={<AddTermsAndConditions />}
        />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/property-holder" element={<PropertyHolder />} />
        <Route path="/add-property-holder" element={<AddPropertyHolder />} />
        <Route path="/muncipal-properties" element={<MuncipalProperties />} />
        <Route
          path="/add-muncipal-properties"
          element={<AddMuncipalProperties />}
        />
        <Route path="/schools" element={<Schools />} />
        <Route path="/add-schools" element={<AddSchools />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/add-garden" element={<AddGarden />} />
        <Route path="/add-tenders" element={<AddTender />} />
        <Route path="/tenders" element={<Tender />} />
        <Route path="/news" element={<News />} />
        <Route path="/add-news" element={<AddNews />} />
        <Route path="/photo-gallery" element={<PhotoGallery />} />
        <Route path="/add-photos-gallery" element={<AddPhotoGallery />} />
        <Route path="/add-services" element={<AddServices />} />
        <Route path="/services" element={<Services />} />
        <Route path="/electric" element={<Electric />} />
        <Route path="/add-electric" element={<AddElectric />} />
        <Route path="/roads" element={<Roads />} />
        <Route path="/add-roads" element={<AddRoads />} />
        <Route path="/tree-census" element={<TreeCensus />} />
        <Route path="/add-tree-census" element={<AddTreeCensus />} />
        <Route path="/ponds-talao" element={<PondsAndTalao />} />
        <Route path="/add-ponds-talao" element={<AddPondsAndTalao />} />
        <Route path="/fire-station" element={<FireStation />} />
        <Route path="/add-fire-station" element={<AddFireStation />} />
        <Route path="/hospital" element={<PrivateHospital />} />
        <Route path="/add-hospital" element={<AddPrivateHospital />} />
        <Route path="/health" element={<Health />} />
        <Route path="/history" element={<History />} />
        <Route path="/add-co" element={<AddCo />} />
        <Route path="/add-history" element={<AddHistory />} />
        <Route path="/wards" element={<Wards />} />
        <Route path="/add-wards" element={<AddWards />} />
        <Route path="/elected-wings" element={<ElectedWings />} />
        <Route path="/add-elected-wings" element={<AddElectedWings />} />
        <Route path="/functions" element={<Functions />} />
        <Route path="/add-functions" element={<AddFunctions />} />
        <Route path="/add-awards" element={<AddAwards />} />
        <Route path="/add-award-images" element={<AddAwardImages />} />
        <Route path="/awards" element={<Awards />} />
        <Route
          path="/add-previous-officers"
          element={<AddPreviousOfficers />}
        />
        <Route path="/previous-officers" element={<PreviousOfficers />} />
        <Route
          path="/add-previous-presidents"
          element={<AddPreviousPresidents />}
        />
        <Route path="/previous-presidents" element={<PreviousPresidents />} />
        <Route
          path="/add-general-department"
          element={<AddGeneralAdminDepartment fetchDepartmentsData={fetchDepartmentsData} />}
        />
        {departmentDatas && departmentDatas.length > 0 ? (
          departmentDatas.map((data) =>
            data?.heading_link ? (
              <Route
                key={data?.heading_link}
                path={`/add-${data?.heading_link.replace(/^\//, "")}`}
                element={<AddGeneralYear />}
              />
            ) : null
          )
        ) : (
          <>Loding...</>
        )}
        <Route
          path="/public-disclosure"
          element={
            <PublicDisclosure
              fetchDepartments={fetchDepartments}
              fetchDepartmentData={fetchDepartmentData}
            />
          }
        />
        <Route path="/citizen-charter" element={<CitizenCharter />} />
        <Route path="/add-rts-pdf" element={<AddRtsPdf />} />
        <Route path="/add-rts" element={<AddRts />} />
        <Route path="/rts" element={<Rts />} />
        <Route path="/home-videos" element={<HomeVideos />} />
        <Route path="/add-home-videos" element={<AddHomeVideos />} />
        <Route path="/gov-website-link" element={<GovWebsiteLink />} />
        <Route path="/add-gov-website-link" element={<AddGovtWebsiteLink />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/add-departments" element={<AddDepartments />} />
        <Route path="/add-pond-images" element={<AddPondsAndTalaoImages />} />
        <Route path="/official-publications" element={<Publications />} />
        <Route
          path="/add-official-publications"
          element={<AddPublications />}
        />
        <Route path="/downloads" element={<Downloads />} />
        <Route
          path="/add-development-plan-description"
          element={<AddDevelopmentDescription />}
        />
        <Route
          path="/add-development-plan-pdf"
          element={<AddDevelopmentPdf />}
        />
        <Route path="/development-plan" element={<DevelopmentPlan />} />
        {departments.map((department) =>
          department.department_name !== "General Admin Department" ? (
            <>
              <Route
                path={`/add-${department.department_name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                element={
                  <AddDepartmentData
                    fetchDepartments={fetchDepartments}
                    fetchDepartmentData={fetchDepartmentData}
                  />
                }
              />
            </>
          ) : null
        )}
        {departmentData && departmentData.length > 0 ? (
          departmentData.map((data) =>
            data?.heading_link ? (
              <Route
                key={data?.heading_link}
                path={`/add-${data?.heading_link.replace(/^\//, "")}`}
                element={<AddYear fetchDepartmentDatas={fetchDepartmentData} />}
              />
            ) : null
          )
        ) : (
          <>Loding...</>
        )}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
  );
}

export default SuperAdminRoutes;
