import React, { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const MainMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newSubMenu, setNewSubMenu] = useState("");
  const [newSubLink, setNewSubLink] = useState("");

  const fetchMenuData = async () => {
    try {
      const response = await api.get("/main-menus");
      setMenuData(response.data);
    } catch (error) {
      console.error("Error fetching menu data:", error);
      toast.error("Error fetching main menu data!");
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const handleEditClick = (menu) => {
    setSelectedMenu({ ...menu, subMenus: [...menu.subMenus] });
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedMenu.mainMenu || !selectedMenu.mainMenuLink) {
      alert("Please fill in the Main Menu and Main Menu Link fields.");
      return;
    }

    try {
      const payload = {
        mainMenu: selectedMenu.mainMenu,
        mainMenuLink: selectedMenu.mainMenuLink,
        subMenus: selectedMenu.subMenus.map((sub) => ({
          subMenu: sub.subMenu,
          subLink: sub.subLink,
        })),
      };

      await api.put(`/update-main-menu/${selectedMenu.id}`, payload);

      setShowEditModal(false);
      fetchMenuData();
      toast.success("Main menu updated successfully!");
    } catch (error) {
      console.error("Error updating menu:", error);
      toast.error("Error updating main menu!");
    }
  };

  const handleAddSubMenu = () => {
    if (newSubMenu && newSubLink) {
      setSelectedMenu((prev) => ({
        ...prev,
        subMenus: [
          ...prev.subMenus,
          { subMenu: newSubMenu, subLink: newSubLink },
        ],
      }));
      setNewSubMenu("");
      setNewSubLink("");
    }
  };

  const handleSubMenuChange = (index, field, value) => {
    setSelectedMenu((prev) => {
      const updatedSubMenus = prev.subMenus.map((sub, i) =>
        i === index ? { ...sub, [field]: value } : sub
      );
      return { ...prev, subMenus: updatedSubMenus };
    });
  };

  const handleDeleteSubMenu = (index) => {
    setSelectedMenu((prev) => ({
      ...prev,
      subMenus: prev.subMenus.filter((_, i) => i !== index),
    }));
  };

  const handleDeleteClick = (menu) => {
    setSelectedMenu(menu);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/delete-main-menu/${selectedMenu.id}`);
      setShowDeleteModal(false);
      fetchMenuData();
      toast.success("Main menu deleted successfully!");
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Error deleting main menu!");
    }
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
                Main Menu
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-sm-4 col-3">
                      <h4 className="page-title">Main Menu</h4>
                    </div>
                    <div className="col-sm-8 col-9 text-right m-b-20">
                      <Link
                        to="/add-main-menu"
                        className="btn btn-primary btn-rounded float-right"
                      >
                        <i className="fa fa-plus"></i> Add Main Menu
                      </Link>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered m-b-0">
                      <thead>
                        <tr>
                          <th width="10%">Sr. No.</th>
                          <th>Main Menu</th>
                          <th>Main Menu Link</th>
                          <th>Sub Menu</th>
                          <th>Sub Menu Link</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menuData.map((item, index) => (
                          <React.Fragment key={item.mainMenuId}>
                            <tr>
                              <td>{index + 1}</td>
                              <td>{item.mainMenu}</td>
                              <td>{item.mainMenuLink}</td>
                              <td>
                                {item.subMenus && item.subMenus.length > 0
                                  ? item.subMenus[0].subMenu
                                  : "-"}
                              </td>
                              <td>
                                {item.subMenus && item.subMenus.length > 0
                                  ? item.subMenus[0].subLink
                                  : "-"}
                              </td>
                              <td
                                rowSpan={
                                  item.subMenus && item.subMenus.length > 0
                                    ? item.subMenus.length
                                    : 1
                                }
                              >
                                <button
                                  className="btn btn-success btn-sm m-t-10"
                                  onClick={() => handleEditClick(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  variant="danger"
                                  className="btn btn-danger btn-sm m-t-10"
                                  onClick={() => handleDeleteClick(item)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>

                            {item.subMenus &&
                              item.subMenus.length > 1 &&
                              item.subMenus.slice(1).map((sub, subIndex) => (
                                <tr key={sub.subMenuId}>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td>{sub.subMenu}</td>
                                  <td>{sub.subLink}</td>
                                </tr>
                              ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showEditModal && (
            <div
              className="modal fade show"
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Main Menu</h5>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label style={{ fontWeight: "bold" }}>Main Menu</label>
                      <input
                        className="form-control form-control-md"
                        type="text"
                        value={selectedMenu?.mainMenu || ""}
                        onChange={(e) =>
                          setSelectedMenu((prev) => ({
                            ...prev,
                            mainMenu: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: "bold" }}>
                        Main Menu Link
                      </label>
                      <input
                        className="form-control form-control-md"
                        type="text"
                        value={selectedMenu?.mainMenuLink || ""}
                        onChange={(e) =>
                          setSelectedMenu((prev) => ({
                            ...prev,
                            mainMenuLink: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: "bold" }}>Sub Menus</label>
                      <ul>
                        {selectedMenu?.subMenus.map((subMenu, index) => (
                          <li key={index} className="mb-2">
                            <input
                              className="form-control form-control-md mb-1"
                              type="text"
                              placeholder="Edit Sub Menu"
                              value={subMenu.subMenu}
                              onChange={(e) =>
                                handleSubMenuChange(
                                  index,
                                  "subMenu",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              className="form-control form-control-md"
                              type="text"
                              placeholder="Edit Sub Link"
                              value={subMenu.subLink}
                              onChange={(e) =>
                                handleSubMenuChange(
                                  index,
                                  "subLink",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              onClick={() => handleDeleteSubMenu(index)}
                              className="mt-2 btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                      <input
                        type="text"
                        placeholder="New Sub menu name"
                        value={newSubMenu}
                        onChange={(e) => setNewSubMenu(e.target.value)}
                        className="mt-2 form-control form-control-md"
                      />
                      <input
                        type="text"
                        placeholder="New Sub menu link"
                        value={newSubLink}
                        onChange={(e) => setNewSubLink(e.target.value)}
                        className="mt-2 form-control form-control-md"
                      />
                      <button
                        onClick={handleAddSubMenu}
                        className="mt-2 btn btn-primary btn-sm"
                      >
                        Add Sub Menu
                      </button>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div
              className="modal fade show"
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body text-center">
                    <h5>Are you sure you want to delete this menu?</h5>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MainMenu;
