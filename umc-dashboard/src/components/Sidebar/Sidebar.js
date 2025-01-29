import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { BiSliderAlt } from "react-icons/bi";
import { MdMiscellaneousServices } from "react-icons/md";
import { GrServices } from "react-icons/gr";
import { ImNewspaper } from "react-icons/im";
import { GrGallery } from "react-icons/gr";
import { FaLink } from "react-icons/fa";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { BiSolidWidget } from "react-icons/bi";
import { SiDeutschepost } from "react-icons/si";
import { IoPersonAdd } from "react-icons/io5";
import { MdPrivacyTip } from "react-icons/md";
import { BiMessageSquareError } from "react-icons/bi";
import { MdContactMail } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { MdOutlineCorporateFare } from "react-icons/md";
import { FaPersonCirclePlus } from "react-icons/fa6";
import { PiComputerTowerBold } from "react-icons/pi";
import { GoChecklist } from "react-icons/go";
import { BsPersonFillCheck } from "react-icons/bs";
import { MdOutlineDatasetLinked } from "react-icons/md";

const Sidebar = ({ isOpen, closeSidebar, userDepartment }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [activeItem, setActiveItem] = useState("/");

  const toggleSubmenu = (menuId) => {
    setOpenSubmenu((prevId) => (prevId === menuId ? null : menuId));
  };

  const handleItemClick = (path) => {
    setActiveItem(path);
    if (isOpen) {
      closeSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay opened" onClick={closeSidebar} />
      )}

      {/* Sidebar component */}
      <div className={`sidebar ${isOpen ? "opened" : ""}`}>
        <div className="sidebar-inner">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              {userDepartment === "Admin" && (
                <>
                  <li
                    className={activeItem === "/" ? "active" : ""}
                    onClick={() => handleItemClick("/")}
                  >
                    <Link to="/home">
                      <i className="fa fa-dashboard"></i>Header
                    </Link>
                  </li>
                  <li className="submenu">
                    <Link to="#." onClick={() => toggleSubmenu("home")}>
                      <i className="fa">
                        <FaHome />
                      </i>{" "}
                      <span>Home </span>{" "}
                      <span
                        className={`menu-arrow ${openSubmenu === "home" ? "rotate" : ""
                          }`}
                      ></span>
                    </Link>
                    <ul className={openSubmenu === "home" ? "open" : ""}>
                      <li
                        className={activeItem === "/minister" ? "active" : ""}
                        onClick={() => handleItemClick("/minister")}
                      >
                        <Link to="/minister">
                          Ministers
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/slider" ? "active" : ""}
                        onClick={() => handleItemClick("/slider")}
                      >
                        <Link to="/slider">
                          Slider
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/current-update" ? "active" : ""}
                        onClick={() => handleItemClick("/current-update")}
                      >
                        <Link to="/current-update">
                          Current Update
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/umc-news" ? "active" : ""}
                        onClick={() => handleItemClick("/umc-news")}
                      >
                        <Link to="/umc-news">
                          UMC News
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/initiatives" ? "active" : ""}
                        onClick={() => handleItemClick("/initiatives")}
                      >
                        <Link to="/initiatives">
                          Initiatives-Programme
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/eservices" ? "active" : ""}
                        onClick={() => handleItemClick("/eservices")}
                      >
                        <Link to="/eservices">
                          e-Services
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/information" ? "active" : ""}
                        onClick={() => handleItemClick("/information")}
                      >
                        <Link to="/information">
                          Information
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/projects" ? "active" : ""}
                        onClick={() => handleItemClick("/projects")}
                      >
                        <Link to="/projects">
                          Upcoming Projects
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/citizen services" ? "active" : ""}
                        onClick={() => handleItemClick("/citizen services")}
                      >
                        <Link to="/citizen-services">
                          Citizen Services
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/home-video" ? "active" : ""}
                        onClick={() => handleItemClick("/home-video")}
                      >
                        <Link to="/home-video">
                          Home Video
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/home-gallery" ? "active" : ""}
                        onClick={() => handleItemClick("/home-gallery")}
                      >
                        <Link to="/home-gallery">
                          Home Gallery
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/citizen-communication" ? "active" : ""}
                        onClick={() => handleItemClick("/citizen-communication")}
                      >
                        <Link to="/citizen-communication">
                          Citizen Communication
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/home-services1" ? "active" : ""}
                        onClick={() => handleItemClick("/home-services1")}
                      >
                        <Link to="/home-services1">
                          Home Service 1
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/home-services2" ? "active" : ""}
                        onClick={() => handleItemClick("/home-services2")}
                      >
                        <Link to="/home-services2">
                          Home Service 2
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/bottom-slider" ? "active" : ""}
                        onClick={() => handleItemClick("/bottom-slider")}
                      >
                        <Link to="/bottom-slider">
                          Bottom Slider
                        </Link>
                      </li>
                      {/* <li
                        className={activeItem === "/swms" ? "active" : ""}
                        onClick={() => handleItemClick("/swms")}
                      >
                        <Link to="/swms">
                          Solid Waste Management System
                        </Link>
                      </li> */}
                      <li
                        className={activeItem === "/press-note" ? "active" : ""}
                        onClick={() => handleItemClick("/press-note")}
                      >
                        <Link to="/press-note">
                          Press Note
                        </Link>
                      </li>
                      {/* <li
                        className={activeItem === "/property-tax-department" ? "active" : ""}
                        onClick={() => handleItemClick("/property-tax-department")}
                      >
                        <Link to="/property-tax-department">
                          Property Tax Department
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/rti" ? "active" : ""}
                        onClick={() => handleItemClick("/rti")}
                      >
                        <Link to="/rti">
                          Right to Information
                        </Link>
                      </li> */}
                    </ul>
                  </li>
                  <li className="submenu">
                    <Link to="#." onClick={() => toggleSubmenu("about")}>
                      <i className="fa">
                        <BsFillMenuButtonWideFill />
                      </i>{" "}
                      <span>About UMC </span>{" "}
                      <span
                        className={`menu-arrow ${openSubmenu === "about" ? "rotate" : ""
                          }`}
                      ></span>
                    </Link>
                    <ul className={openSubmenu === "about" ? "open" : ""}>
                      <li
                        className={activeItem === "/location" ? "active" : ""}
                        onClick={() => handleItemClick("/location")}
                      >
                        <Link to="/location">
                          Location
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/commissioner" ? "active" : ""}
                        onClick={() => handleItemClick("/commissioner")}
                      >
                        <Link to="/commissioner">
                          Commissioner
                        </Link>
                      </li>

                      <li
                        className={activeItem === "/history" ? "active" : ""}
                        onClick={() => handleItemClick("/history")}
                      >
                        <Link to="/history">
                          History
                        </Link>
                      </li>

                      <li
                        className={activeItem === "/tourism" ? "active" : ""}
                        onClick={() => handleItemClick("/tourism")}
                      >
                        <Link to="/tourism">
                          Tourism
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="submenu">
                    <Link to="#." onClick={() => toggleSubmenu("corporation")}>
                      <i className="fa">
                        <MdOutlineCorporateFare />
                      </i>{" "}
                      <span>Corporation </span>{" "}
                      <span
                        className={`menu-arrow ${openSubmenu === "corporation" ? "rotate" : ""
                          }`}
                      ></span>
                    </Link>
                    <ul className={openSubmenu === "corporation" ? "open" : ""}>
                      <li
                        className={activeItem === "/adminstration" ? "active" : ""}
                        onClick={() => handleItemClick("/adminstration")}
                      >
                        <Link to="/adminstration">
                          Administration
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/annual" ? "active" : ""}
                        onClick={() => handleItemClick("/annual")}
                      >
                        <Link to="/annual">
                          Annual Financial
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/elected-member" ? "active" : ""}
                        onClick={() => handleItemClick("/elected-member")}
                      >
                        <Link to="/elected-member">
                          Elected Member
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/enews-letter" ? "active" : ""}
                        onClick={() => handleItemClick("/enews-letter")}
                      >
                        <Link to="/enews-letter">
                          e-News Letter
                        </Link>
                      </li>
                      
                      <li
                        className={activeItem === "/muncipal-meeting" ? "active" : ""}
                        onClick={() => handleItemClick("/muncipal-meeting")}
                      >
                        <Link to="/muncipal-meeting">
                          Muncipal Meeting
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/agenda" ? "active" : ""}
                        onClick={() => handleItemClick("/agenda")}
                      >
                        <Link to="/agenda">
                          UMC Agenda
                        </Link>
                      </li>
                      {/* <li
                        className={activeItem === "/budgets" ? "active" : ""}
                        onClick={() => handleItemClick("/budgets")}
                      >
                        <Link to="/budgets">
                          UMC Budget
                        </Link>
                      </li> */}
                      <li
                        className={activeItem === "/policies" ? "active" : ""}
                        onClick={() => handleItemClick("/policies")}
                      >
                        <Link to="/policies">
                          UMC Policies
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/resolution" ? "active" : ""}
                        onClick={() => handleItemClick("/resolution")}
                      >
                        <Link to="/resolution">
                          UMC Resolution
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/ward-office" ? "active" : ""}
                        onClick={() => handleItemClick("/ward-office")}
                      >
                        <Link to="/ward-office">
                          Ward Office
                        </Link>
                      </li>
                      
                    </ul>
                  </li>
                  <li className="submenu">
                    <Link to="#." onClick={() => toggleSubmenu("departments")}>
                      <i className="fa fa-calendar-check-o"></i>{" "}
                      <span>Departments </span>{" "}
                      <span
                        className={`menu-arrow ${openSubmenu === "departments" ? "rotate" : ""
                          }`}
                      ></span>
                    </Link>
                    <ul className={openSubmenu === "departments" ? "open" : ""}>
                      <li
                        className={activeItem === "/departments" ? "active" : ""}
                        onClick={() => handleItemClick("/departments")}
                      >
                        <Link to="/departments">
                          Departments Page
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/department-information" ? "active" : ""}
                        onClick={() => handleItemClick("/department-information")}
                      >
                        <Link to="/department-information">
                          Department Information
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="submenu">
                    <Link to="#." onClick={() => toggleSubmenu("citizen-services")}>
                      <i className="fa">
                        <GrServices />
                      </i>{" "}
                      <span>Citizen Services </span>{" "}
                      <span
                        className={`menu-arrow ${openSubmenu === "citizen-services" ? "rotate" : ""
                          }`}
                      ></span>
                    </Link>
                    <ul className={openSubmenu === "citizen-services" ? "open" : ""}>
                      <li
                        className={activeItem === "/tenders-quotations" ? "active" : ""}
                        onClick={() => handleItemClick("/tenders-quotations")}
                      >
                        <Link to="/tenders-quotations">
                          Tenders and Quotations
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li
                    className={activeItem === "/rts" ? "active" : ""}
                    onClick={() => handleItemClick("/rts")}
                  >
                    <Link to="/rts">
                      <i className="fa">
                        <BsPersonFillCheck />
                      </i>{" "}
                      Right to Service
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/recruitment" ? "active" : ""}
                    onClick={() => handleItemClick("/recruitment")}
                  >
                    <Link to="/recruitment">
                      <i className="fa">
                        <FaPersonCirclePlus />
                      </i>{" "}
                      Recruitment
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/contact-us" ? "active" : ""}
                    onClick={() => handleItemClick("/contact-us")}
                  >
                    <Link to="/contact-us">
                      <i className="fa">
                        <MdContactMail />
                      </i>{" "}
                      Contact Us
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/privacy-policy" ? "active" : ""}
                    onClick={() => handleItemClick("/privacy-policy")}
                  >
                    <Link to="/privacy-policy">
                      <i className="fa">
                        <MdPrivacyTip />
                      </i>{" "}
                      Privacy Policy
                    </Link>
                  </li>
                  {/* <li
                    className={activeItem === "/hyperlink-policy" ? "active" : ""}
                    onClick={() => handleItemClick("/hyperlink-policy")}
                  >
                    <Link to="/hyperlink-policy">
                      <i className="fa">
                        <MdOutlineDatasetLinked />
                      </i>{" "}
                      Hyperlink Policy
                    </Link>
                  </li> */}
                  <li
                    className={activeItem === "/footer" ? "active" : ""}
                    onClick={() => handleItemClick("/footer")}
                  >
                    <Link to="/footer">
                      <i className="fa">
                        <PiComputerTowerBold />
                      </i>{" "}
                      Footer
                    </Link>
                  </li>



                  {/* <li
                    className={activeItem === "/services" ? "active" : ""}
                    onClick={() => handleItemClick("/services")}
                  >
                    <Link to="/services">
                      <i className="fa">
                        <MdMiscellaneousServices />
                      </i>{" "}
                      Services
                    </Link>
                  </li> */}
                </>
              )}
              {/* <li className="submenu">
                <Link to="#." onClick={() => toggleSubmenu("subservices")}>
                  <i className="fa">
                    <GrServices />
                  </i>{" "}
                  <span>Sub Services </span>{" "}
                  <span
                    className={`menu-arrow ${
                      openSubmenu === "subservices" ? "rotate" : ""
                    }`}
                  ></span>
                </Link>
                <ul className={openSubmenu === "subservices" ? "open" : ""}>
                  <li
                    className={
                      activeItem === "/public-disclosure" ? "active" : ""
                    }
                    onClick={() => handleItemClick("/public-disclosure")}
                  >
                    <Link to="/public-disclosure">Public Disclosure</Link>
                  </li>
                  {userDepartment === "Admin" && (
                  <li
                    className={
                      activeItem === "/citizen-charter" ? "active" : ""
                    }
                    onClick={() => handleItemClick("/citizen-charter")}
                  >
                    <Link to="/citizen-charter">Citizen Charter</Link>
                  </li>
                )}
                  {userDepartment === "Admin" && (
                  <li
                    className={activeItem === "/rts" ? "active" : ""}
                    onClick={() => handleItemClick("/rts")}
                  >
                    <Link to="/rts">Right to Service</Link>
                  </li>
                  )}
                  {userDepartment === "Admin" && (
                  <li
                    className={
                      activeItem === "/development-plan" ? "active" : ""
                    }
                    onClick={() => handleItemClick("/development-plan")}
                  >
                    <Link
                     to="/development-plan">Development Plan</Link>
                  </li>
                  )}
                  {userDepartment === "Admin" && (
                  <li
                    className={activeItem === "/downloads" ? "active" : ""}
                    onClick={() => handleItemClick("/downloads")}
                  >
                    <Link to="/downloads" onClick={handleItemClick}>
                      Downloads
                    </Link>
                  </li>
                  )}
                  {userDepartment === "Admin" && (
                  <li
                    className={activeItem === "#" ? "active" : ""}
                    onClick={() => handleItemClick("#")}
                  >
                    <Link to="#" onClick={handleItemClick}>
                      City Map
                    </Link>
                  </li>
                  )}
                  {userDepartment === "Admin" && (
                  <li
                    className={activeItem === "/elected-wings" ? "active" : ""}
                    onClick={() => handleItemClick("/elected-wings")}
                  >
                    <Link to="/elected-wings" onClick={handleItemClick}>
                      Elected Wing
                    </Link>
                  </li>
                  )}
                  {userDepartment === "Admin" && (
                  <li
                    className={
                      activeItem === "/official-publications" ? "active" : ""
                    }
                    onClick={() => handleItemClick("/official-publications")}
                  >
                    <Link to="/official-publications" onClick={handleItemClick}>
                      Official Publications
                    </Link>
                  </li>
                  )}
                </ul>
              </li>
              {userDepartment === "Admin" && (
                <>
                  <li
                    className={activeItem === "/home-videos" ? "active" : ""}
                    onClick={() => handleItemClick("/home-videos")}
                  >
                    <Link to="/home-videos">
                      <i className="fa fa-video-camera camera"></i> Home Video
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/news" ? "active" : ""}
                    onClick={() => handleItemClick("/news")}
                  >
                    <Link to="/news">
                      <i className="fa">
                        <ImNewspaper />
                      </i>{" "}
                      News Update
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/tenders" ? "active" : ""}
                    onClick={() => handleItemClick("/tenders")}
                  >
                    <Link to="/tenders">
                      <i className="fa fa-calendar"></i> Tenders
                    </Link>
                  </li>
                  <li className="submenu">
                    <Link to="#." onClick={() => toggleSubmenu("gallery")}>
                      <i className="fa">
                        <GrGallery />
                      </i>{" "}
                      <span>Gallery </span>{" "}
                      <span
                        className={`menu-arrow ${
                          openSubmenu === "gallery" ? "rotate" : ""
                        }`}
                      ></span>
                    </Link>
                    <ul className={openSubmenu === "gallery" ? "open" : ""}>
                      <li
                        className={
                          activeItem === "/photo-gallery" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/photo-gallery")}
                      >
                        <Link to="/photo-gallery">Photo Gallery</Link>
                      </li>
                    </ul>
                  </li>
                  <li
                    className={
                      activeItem === "/gov-website-link" ? "active" : ""
                    }
                    onClick={() => handleItemClick("/gov-website-link")}
                  >
                    <Link to="/gov-website-link">
                      <i className="fa ">
                        <FaLink />
                      </i>
                      Govt. Website Links
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/departments" ? "active" : ""}
                    onClick={() => handleItemClick("/departments")}
                  >
                    <Link to="/departments">
                      <i className="fa fa-calendar-check-o"></i>Departments
                    </Link>
                  </li>

                  
                  <li className="submenu">
                    <Link to="#." onClick={() => toggleSubmenu("aboutkbmc")}>
                      <i className="fa">
                        <BsFillMenuButtonWideFill />
                      </i>{" "}
                      <span> About KBMC</span>{" "}
                      <span
                        className={`menu-arrow ${
                          openSubmenu === "aboutkbmc" ? "rotate" : ""
                        }`}
                      ></span>
                    </Link>
                    <ul className={openSubmenu === "aboutkbmc" ? "open" : ""}>
                      <li
                        className={activeItem === "/history" ? "active" : ""}
                        onClick={() => handleItemClick("/history")}
                      >
                        <Link to="/history">History</Link>
                      </li>
                      <li
                        className={activeItem === "/wards" ? "active" : ""}
                        onClick={() => handleItemClick("/wards")}
                      >
                        <Link to="/wards">Wards</Link>
                      </li>
                      <li
                        className={
                          activeItem === "/elected-wings" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/elected-wings")}
                      >
                        <Link to="/elected-wings">Elected Wings</Link>
                      </li>
                      <li
                        className={activeItem === "/functions" ? "active" : ""}
                        onClick={() => handleItemClick("/functions")}
                      >
                        <Link to="/functions">Functions</Link>
                      </li>
                      <li
                        className={
                          activeItem === "/previous-officers" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/previous-officers")}
                      >
                        <Link to="/previous-officers">
                          Previous Chief officers of the council
                        </Link>
                      </li>
                      <li
                        className={
                          activeItem === "/previous-presidents" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/previous-presidents")}
                      >
                        <Link
                          to="/previous-presidents"
                          onClick={handleItemClick}
                        >
                          Previous Presidents
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/awards" ? "active" : ""}
                        onClick={() => handleItemClick("/awards")}
                      >
                        <Link to="/awards" onClick={handleItemClick}>
                          Awards
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="submenu">
                    <Link to="#." onClick={() => toggleSubmenu("cityprofile")}>
                      <i className="">
                        <BiSolidWidget />
                      </i>{" "}
                      <span> City Profile</span>{" "}
                      <span
                        className={`menu-arrow ${
                          openSubmenu === "cityprofile" ? "rotate" : ""
                        }`}
                      ></span>
                    </Link>
                    <ul className={openSubmenu === "cityprofile" ? "open" : ""}>
                      <li
                        className={
                          activeItem === "/property-holder" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/property-holder")}
                      >
                        <Link to="/property-holder">Property Holder</Link>
                      </li>
                      <li
                        className={
                          activeItem === "/muncipal-properties" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/muncipal-properties")}
                      >
                        <Link to="/muncipal-properties">
                          Muncipal Properties
                        </Link>
                      </li>
                      <li
                        className={activeItem === "/schools" ? "active" : ""}
                        onClick={() => handleItemClick("/schools")}
                      >
                        <Link to="/schools">Schools</Link>
                      </li>
                      <li
                        className={activeItem === "/garden" ? "active" : ""}
                        onClick={() => handleItemClick("/garden")}
                      >
                        <Link to="/garden">Gardens</Link>
                      </li>
                      <li
                        className={activeItem === "/electric" ? "active" : ""}
                        onClick={() => handleItemClick("/electric")}
                      >
                        <Link to="/electric">Electric</Link>
                      </li>
                      <li
                        className={activeItem === "/roads" ? "active" : ""}
                        onClick={() => handleItemClick("/roads")}
                      >
                        <Link to="/roads">Roads</Link>
                      </li>
                      <li
                        className={
                          activeItem === "/tree-census" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/tree-census")}
                      >
                        <Link to="/tree-census">Tree Census</Link>
                      </li>
                      <li
                        className={activeItem === "/health" ? "active" : ""}
                        onClick={() => handleItemClick("/health")}
                      >
                        <Link to="/health">Health</Link>
                      </li>
                      <li
                        className={
                          activeItem === "/ponds-talao" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/ponds-talao")}
                      >
                        <Link to="/ponds-talao">Ponds / Talao</Link>
                      </li>
                      <li
                        className={
                          activeItem === "/fire-station" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/fire-station")}
                      >
                        <Link to="/fire-station">Fire Station</Link>
                      </li>
                      <li
                        className={
                          activeItem === "/hospital" ? "active" : ""
                        }
                        onClick={() => handleItemClick("/hospital")}
                      >
                        <Link to="/hospital" onClick={handleItemClick}>
                          Hospital
                        </Link>
                      </li>
                    </ul>
                  </li>
                
                  <li
                    className={activeItem === "/user" ? "active" : ""}
                    onClick={() => handleItemClick("/user")}
                  >
                    <Link to="/user">
                      <i className="fa">
                        <IoPersonAdd />
                      </i>
                      Add User
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/privacy-policy" ? "active" : ""}
                    onClick={() => handleItemClick("/privacy-policy")}
                  >
                    <Link to="/privacy-policy">
                      <i className="fa">
                        <MdPrivacyTip />
                      </i>
                      Privacy Policy
                    </Link>
                  </li>
                  <li
                    className={
                      activeItem === "/terms-conditions" ? "active" : ""
                    }
                    onClick={() => handleItemClick("/terms-conditions")}
                  >
                    <Link to="/terms-and-conditions">
                      <i className="fa">
                        <BiMessageSquareError />
                      </i>
                      Terms & Conditions
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/contact-us" ? "active" : ""}
                    onClick={() => handleItemClick("/contact-us")}
                  >
                    <Link to="/contact-us">
                      <i className="fa">
                        <MdContactMail />
                      </i>
                      Contact Us{" "}
                    </Link>
                  </li>
                  <li
                    className={activeItem === "/notification" ? "active" : ""}
                    onClick={() => handleItemClick("/notification")}
                  >
                    <Link to="/notifications">
                      <i className="fa">
                        <MdNotificationsActive />
                      </i>
                      Notifications{" "}
                    </Link>
                  </li>
                </>
              )} */}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;