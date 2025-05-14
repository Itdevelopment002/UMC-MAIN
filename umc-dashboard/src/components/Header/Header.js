import React, { useState, useEffect } from "react";
import img from "../../assets/img/user.jpg";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Header.css";
import api, { baseURL } from "../api";
import { formatDistanceToNow } from "date-fns";
import headerlogo from '../../assets/img/adminheader.png'
import { FiLogOut } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import image from "../../assets/img/profile-image.jpg"

const Header = ({ onLogout, userDepartment }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState([]);
  // eslint-disable-next-line
  const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth > 990);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);


  const fetchUser = async () => {
    if (!userDepartment || !userDepartment.id) {
      return;
    }

    try {
      const response = await api.get(`/users/${userDepartment.id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userDepartment) {
      fetchUser();
    }
    //eslint-disable-next-line
  }, [userDepartment]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth > 990;
      setIsScreenLarge(isLarge);
      if (isLarge) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".dropdown-toggle") &&
        !event.target.closest(".dropdown-menu")
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <Link
        id="mobile_btn"
        className="mobile_btn float-left"
        to="#"
        onClick={(e) => {
          e.preventDefault();
          toggleSidebar();
        }}
      >
        <i className="fa fa-bars"></i>
      </Link>
      <div className="main-wrapper">
        <div className="header">
          <div className="header-left">
            <Link to="/home" className="logo">
              <img src={headerlogo} alt="UMC Logo" className="logo-image" />
            </Link>
          </div>

          <Link
            id="mobile_btn"
            className="mobile_btn float-left"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              toggleSidebar();
            }}
          >
            <i className="fa fa-bars"></i>
          </Link>
          <ul className="nav user-menu float-right">
            <li className="nav-item dropdown d-none d-sm-block mx-1">
              <Link
                to="#."
                className="dropdown-toggle nav-link user-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsUserDropdownOpen((prev) => !prev);
                }}
              >
                <span className="user-img">
                  <img
                    className="rounded-circle"
                    src={image}
                    width="30"
                    alt="Admin"
                    style={{ backgroundColor: "white" }}
                  />
                  <span className="status online"></span>
                </span>
                <span className="">{user?.fullname}</span>
                <i className="fa fa-angle-down ml-1"></i>
              </Link>
              {isUserDropdownOpen && (
                <div className="dropdown-menu show dropdown-keep-visible">
                  <Link className="dropdown-item" to="/view-profile">
                    <FaUser className="dropdown-icon" />
                    View Profile
                  </Link>

                  <Link className="dropdown-item" to="/edit-profile">
                    <FaEdit className="dropdown-icon" />
                    Edit Profile
                  </Link>
                  <Link className="dropdown-item" onClick={onLogout}>
                    <FiLogOut className="dropdown-icon" />
                    Logout
                  </Link>
                </div>
              )}
            </li>
            <div className="dropdown mobile-user-menu float-right d-block d-sm-none">
              <Link
                to="#."
                className="dropdown-toggle"
                onClick={(e) => {
                  e.preventDefault();
                  setIsUserDropdownOpen((prev) => !prev);
                }}
              >
                <i className="fa fa-ellipsis-v"></i>
              </Link>
              {isUserDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-right show mx-2 dropdown-keep-visible">
                  <Link className="dropdown-item" to="/view-profile">
                    <FaUser className="dropdown-icon" />
                    View Profile
                  </Link>

                  <Link className="dropdown-item" to="/edit-profile">
                    <FaEdit className="dropdown-icon" />
                    Edit Profile
                  </Link>

                  <Link className="dropdown-item" onClick={onLogout}>
                    <FiLogOut className="dropdown-icon" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        user={user}
      />
    </>
  );
};

export default Header;
