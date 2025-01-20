import React, { useState, useEffect } from "react";
import img from "../../assets/img/user.jpg";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Header.css";
import api from "../api";
import { formatDistanceToNow } from "date-fns";

const Header = ({ onLogout, userDepartment }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // eslint-disable-next-line
  const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth > 990);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const notificationsToShow = showAll
    ? notifications
    : notifications.slice(0, 5);

  const fetchNotify = async () => {
    try {
      const response = await api.get("/notification");
      const data = response.data.reverse();
      const filteredNotifications = data.filter(
        (notification) => notification.role === userDepartment
      );

      setNotifications(filteredNotifications);

      const unreadCount = filteredNotifications.filter(
        (notification) => notification.readed === 0
      ).length;

      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (userDepartment) {
      fetchNotify();
      const interval = setInterval(fetchNotify, 3000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [userDepartment]);

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notification/${id}`);
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      fetchNotify();
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/update/${id}`, { readed: 1 });
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, readed: 1 } : notification
      );
      setNotifications(updatedNotifications);
      setUnreadCount(
        updatedNotifications.filter((notification) => notification.readed === 0)
          .length
      );
    } catch (error) {
      console.error("Error updating notification status", error);
    }
  };
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
        setIsNotificationDropdownOpen(false);
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
              KBMC
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
            <li className="nav-item dropdown d-none d-sm-block">
              <Link
                to="#."
                className="dropdown-toggle nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsNotificationDropdownOpen((prev) => !prev);
                  setIsUserDropdownOpen(false);
                }}
              >
                <i className="fa fa-bell-o"></i>
                <span className="badge badge-pill bg-danger float-right">
                  {unreadCount}
                </span>
              </Link>
              {isNotificationDropdownOpen && (
                <div className="dropdown-menu notifications show notification-keep-visible">
                  <div className="topnav-dropdown-header">
                    <span>Notifications</span>
                  </div>
                  <div className="drop-scroll">
                    <ul className="notification-list">
                      {notificationsToShow.map((notification) => (
                        <li
                          key={notification.id}
                          className={`notification-message ${
                            notification.readed === 0 ? "unread" : ""
                          }`}
                        >
                          <Link
                            to="#."
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <div className="media">
                              <span className="avatar">
                                <img
                                  alt="Notification"
                                  src={notification.avatar || img}
                                  className="img-fluid"
                                  style={{ width: "40px", height: "40px" }}
                                />
                              </span>
                              <div className="media-body">
                                <p className="noti-details">
                                  <span className="noti-title">
                                    {notification.heading}
                                  </span>
                                  : {notification.description}
                                </p>
                                <p className="noti-time">
                                  <span className="notification-time">
                                    {formatDistanceToNow(
                                      new Date(notification.created_at),
                                      { addSuffix: true }
                                    )}
                                  </span>
                                </p>
                              </div>
                              <button
                                className="btn-close"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification.id);
                                }}
                              >
                                &times;
                              </button>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="topnav-dropdown-footer">
                    <Link to="#." onClick={() => setShowAll((prev) => !prev)}>
                      {showAll ? "Show Less" : "View All Notifications"}
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* User Profile with Online Status */}
            <li className="nav-item dropdown d-none d-sm-block">
              <Link
                to="#."
                className="dropdown-toggle nav-link user-link"
                onClick={(e) => {
                  e.preventDefault();
                  setIsUserDropdownOpen((prev) => !prev);
                  setIsNotificationDropdownOpen(false);
                }}
              >
                <span className="user-img">
                  <img
                    className="rounded-circle"
                    src={img}
                    width="24"
                    alt="Admin"
                  />
                  <span className="status online"></span>{" "}
                  
                  {/* Online status dot */}
                </span>
               
               <span className="mx-1">{userDepartment}</span>{" "}
                <i className="fa fa-angle-down ml-1"></i>
              </Link>
              {isUserDropdownOpen && (
                <div className="dropdown-menu show dropdown-keep-visible">
                  <Link className="dropdown-item" to="#.">
                    My Profile
                  </Link>
                  <Link className="dropdown-item" to="#.">
                    Edit Profile
                  </Link>
                  <Link className="dropdown-item" to="#.">
                    Settings
                  </Link>
                  <Link className="dropdown-item" onClick={onLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </li>

            {/* Mobile user menu, only visible on small screens */}
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
                  <Link className="dropdown-item" to="#.">
                    My Profile
                  </Link>
                  <Link className="dropdown-item" to="#.">
                    Edit Profile
                  </Link>
                  <Link className="dropdown-item" to="#.">
                    Settings
                  </Link>
                  <Link className="dropdown-item" onClick={onLogout}>
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
        userDepartment={userDepartment}
      />
    </>
  );
};

export default Header;
