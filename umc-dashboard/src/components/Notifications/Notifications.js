import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [remark, setRemark] = useState("");

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/admin-notifications");
      const reversedData = response.data.reverse();
      setNotifications(reversedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      alert("Failed to fetch notifications. Please try again later.");
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleApprove = async (id, new_id, name, role, description) => {
    try {
      await api.put(`/edit_${name}/${new_id}`, { status: 1 });

      await api.delete(`/admin-notifications/${id}`);
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );

      const notificationData = {
        heading: "Approved",
        description: `${description} has been successfully approved.`,
        role: role,
        readed: 0,
      };

      await api.post("/notification", notificationData);
    } catch (error) {
      console.error("Error approving notification:", error);
      alert("Failed to approve notification. Please check the server logs.");
    }
  };

  const handleDisapprove = async (
    id,
    new_id,
    name,
    role,
    description,
    remark
  ) => {
    try {
      await api.put(`/edit_${name}/${new_id}`, { status: 0 });
      setSelectedNotification(id);
    } catch (error) {
      console.error("Error disapproving notification:", error);
      alert("Failed to disapprove notification. Please try again.");
    }
  };

  const handleModalClose = () => {
    setSelectedNotification(null);
    setRemark("");
  };

  const handleDisapproveSubmit = async () => {
    try {
      const selectedNotificationData = notifications.find(
        (notification) => notification.id === selectedNotification
      );

      if (!selectedNotificationData) {
        alert("Notification data not found.");
        return;
      }

      const { role, description } = selectedNotificationData;

      await api.put(`/admin-notifications/${selectedNotification}`, { remark });

      await fetchNotifications();

      const notificationData = {
        heading: "Rejected",
        description: `${description} has been rejected. Remark: ${remark}`,
        role: role,
        readed: 0,
      };

      await api.post("/notification", notificationData);

      setNotifications(
        notifications.map((notification) =>
          notification.id === selectedNotification
            ? { ...notification, remark }
            : notification
        )
      );

      handleModalClose();
    } catch (error) {
      console.error("Error updating remark and sending notification:", error);
      alert("Failed to update remark and send notification. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-GB", options);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Invalid Time";
    const [hours, minutes, seconds] = timeString.split(":");
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const formattedHours = now.getHours() % 12 || 12;
    return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Notifications
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Notifications</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Remark</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notifications.map((notification, index) => (
                          <tr key={notification.id}>
                            <td>{index + 1}</td>
                            <td>{notification.description}</td>
                            <td>{formatDate(notification.date)}</td>
                            <td>{formatTime(notification.time)}</td>
                            <td>{notification.remark}</td>
                            <td>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  handleApprove(
                                    notification.id,
                                    notification.new_id,
                                    notification.name,
                                    notification.role,
                                    notification.description
                                  )
                                }
                              >
                                Approve
                              </button>{" "}
                              <button
                                className="btn btn-danger btn-sm m-t-10"
                                onClick={() =>
                                  handleDisapprove(
                                    notification.id,
                                    notification.new_id,
                                    notification.name,
                                    notification.role,
                                    notification.description,
                                    notification.remark
                                  )
                                }
                              >
                                Disapprove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedNotification && (
            <div
              className="modal fade show"
              style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Disapprove Notification</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={handleModalClose}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="modal-body">
                    <label htmlFor="remark">Remark:</label>
                    <input
                      type="text"
                      id="remark"
                      className="form-control"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={handleModalClose}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleDisapproveSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
