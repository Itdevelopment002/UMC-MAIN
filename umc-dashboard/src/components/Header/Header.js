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
const Header = ({ onLogout, userDepartment }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState([]);
  // eslint-disable-next-line
  const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth > 990);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  //eslint-disable-next-line
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
        (notification) => notification.role === userDepartment.department
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
            <li className="nav-item dropdown d-none d-sm-block">
              {/* <Link
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
              </Link> */}
              {isNotificationDropdownOpen && (
                <div className="dropdown-menu notifications show notification-keep-visible">
                  <div className="topnav-dropdown-header">
                    <span >Notifications</span>
                  </div>
                  <div className="drop-scroll">
                    <ul className="notification-list">
                      {notificationsToShow.map((notification) => (
                        <li
                          key={notification.id}
                          className={`notification-message ${notification.readed === 0 ? "unread" : ""
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
            <li className="nav-item dropdown d-none d-sm-block mx-1">
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
                    src={user?.userImage ? `${baseURL}/${user.userImage}` : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAMFBMVEXk5ueutLfY29ypr7Ln6ere4eK8wcPU19nq7O22u77b3t/Hy83R1NazuLvN0NK5vsDaM1loAAAE90lEQVR4nO2d25LbIAxAMYiLwZf//9viOG02jWMbkCNlR2f60N2++AwIEAiqlCAIgiAIgiAIgiAIgiAIgiAIgiAIlwMAStlolz/LD0D9QdUAWO2nlNxKStMQ7Xf6BDsk148m02XM7S+9S8PX+UDQqe82GXunv0kHgp/HbZXVZ/ZfoxP0m0b5Qa/DN+iAnc2hS44hp9jbgBq6My7LiDBQf+wBYN05lbVxLOfGAT2ed8k2nab+4vfA2S72sOHb1aYik5WJZ0+DVOHC1abOhaVNjpda2MUN+GqXrvO82gbi3lrsANMxm28K5soNG0f9+U9MLS7ZZqIWeACxzSXbRDYdDZo62U2m5yIDQ6tLthmY2ECzSmbkIRMao/9OCtQiCygNk5uG2mMBcBqGR9NAw9z/xExt0rgoe4Z+QAsOy8U4chl7vEd2lj4SuzSkMa9Q97PKXHkTk4hlLFrIZJwldQGPFzJ53qRNOVFDhjpoICFN/zeoczRcmUQaNHFGdMkrGkoZiJjxv0ybhEEDHmuVeYdWBtel079JhnKiQZ5mOuPpXERGZESmVAZ7nqEdmn+TzIkqmRJG0sOAiJlo5oUm6ZZGSXXJMYY4b0bOZ0hdoKYo470MbUkADKjDGfEZOupwRpqbLSAOZ8Qho1T4TTuaoPGChngPcAFvf4Z4llGo/Yz+HBAsVj+jXZjdbbDGM/qDM4zCmTv04a/QTjVnDi556YzRNIZFw+SmOVX8f0BPPpT9BaGqiUe7KIwaLUM/xzxoXQawqZ1baF2hUZczPNOWcTKqN73RsEQjz2NeqK9uoN6T2aL2eNOQnsq+o7KCfqTckn0LqCoZBgv/LaCi9HTke8ExFMaN6TnfpC0sP+OQj+0Aw/nG6akr/w6BmE7eb0xMQ/8noLw7oeM839D/CVjvzJ6OMW5gdjNrB7D6bWczWUVznPT3sNNsXton/2Yevs3kRo6edHtD4x9j+pJI2QRCUNYP0zQN3qrwFa8z7AEPqD+lltvjOa/kX97/8StYGsDaGHPfSsnN6ysn60AwjrNzKXc4HaNir7SIRJ0tXL8+mvMyOt9/O84pTV5bxbXvLY8ZDSnlptiQ2JptlueBJm/5+QSIw9oehxpPSksbTV4xGuWWt4xcwxF6Fso+1BYLEFTq2w/PRqeB2gfAox3Qjom0u4E6m7ucwzi6FMemwng/tjE9zZmT3c9Zqn3GvIj7qBAofY3KqjN9NEl4n3rh6MwfS0QhpqLnpar4zBYBqAnjPPaQ8QMjW9C4F7N26NO10w6EhFyVvctsL1wUBPuxZrkzXWaDfY3hBCZdNQ6g1jCftbmkCLXo6UJMmxH/GgpEGpfugkvCoHsql1tVLWZXA3/p8uXYBnEYIBjG/rPBe9uV3CWDZRMYuHQdTtxg1pS3gFFbj31LvhqMyzVEc+UW7dsDFGuYN7SWpGO8kIdG4wuVYKkFnmi7YAMfyZDPYxrKuQKjgFlpeAYRpS4elfr6Z7x32BCp3FADTf3hW7i6pgmf3r04R9XUyWGtvEVVwR3a9StsKpoG/REGNCrWAZiP/eHSl8+cyI99YVKcC+Be9Eel4u4AnzTmlcIhAPvZElRKdwVZ5TH/U/x0ILv18k8KH6lllPlvUJbWsNmS2aYsaEBzbpjSS2qetUzhigbrEfaLGIuGM9aDWaZIxhneFP2XYlHzpsRFEARBEARBoOAPhEhJogo6DqQAAAAASUVORK5CYII="}
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
