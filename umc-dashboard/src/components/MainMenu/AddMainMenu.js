import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const AddMainMenu = () => {
  const initialMenuItems = [
    { mainMenu: "", mainMenuLink: "", language_code: "", subMenus: [], errors: {} },
  ];
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    menuItems.forEach((item, index) => {
      const itemErrors = {};
      if (!item.language_code.trim()) {
        itemErrors.language_code = "Language selection is required";
      }
      if (!item.mainMenu.trim()) {
        itemErrors.mainMenu = "Main Menu name is required.";
      }
      if (!item.mainMenuLink.trim()) {
        itemErrors.mainMenuLink = "Main Menu link is required.";
      }
      item.subMenus.forEach((subMenu, subIndex) => {
        const subErrors = {};
        if (!subMenu.subMenu.trim()) {
          subErrors.subMenu = "Sub Menu name is required.";
        }
        if (!subMenu.subLink.trim()) {
          subErrors.subLink = "Sub Menu link is required.";
        }
        if (Object.keys(subErrors).length > 0) {
          itemErrors.subMenus = itemErrors.subMenus || [];
          itemErrors.subMenus[subIndex] = subErrors;
        }
      });
      if (Object.keys(itemErrors).length > 0) {
        errors[index] = itemErrors;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const response = await api.post("/add-main-menu", { menuItems });

      if (response.status === 200 || response.status === 201) {
        toast.success("Menu added successfully!", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            navigate("/");
            setMenuItems(initialMenuItems);
          }
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        Array.isArray(error.response.data.errors)
      ) {
        error.response.data.errors.forEach((err) => {
          const message = typeof err === "string" ? err : err.message || "Validation error";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to add main menu. Try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }

      console.error("Error adding main menu:", error);
    }
  };

  const handleAddMoreSubMenu = (index) => {
    const errors = formErrors[index];
    if (errors?.mainMenuLink) {
      return;
    }

    const newMenuItems = [...menuItems];
    newMenuItems[index].subMenus.push({ subMenu: "", subLink: "", language_code: "" });
    newMenuItems[index].mainMenuLink = "#";
    newMenuItems[index].isDisabled = true;

    setMenuItems(newMenuItems);
  };

  const handleInputChange = (index, field, value) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index][field] = value;
    setMenuItems(newMenuItems);
    const errors = { ...formErrors };
    if (errors[index]?.[field]) {
      delete errors[index][field];
      setFormErrors(errors);
    }
  };

  const handleSubMenuChange = (index, subIndex, field, value) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index].subMenus[subIndex][field] = value;
    setMenuItems(newMenuItems);
    const errors = { ...formErrors };
    if (errors[index]?.subMenus?.[subIndex]?.[field]) {
      delete errors[index].subMenus[subIndex][field];
      setFormErrors(errors);
    }
  };

  const handleDeleteSubMenu = (index, subIndex) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index].subMenus.splice(subIndex, 1);
    setMenuItems(newMenuItems);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/home">Main Menu</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add Main Menu
            </li>
          </ol>
          <div className="row">
            <div className="col-lg-12">
              <div className="card-box">
                <div className="card-block">
                  <div className="row">
                    <div className="col-12">
                      <h4 className="page-title">Add Main Menu</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    {menuItems.map((item, index) => (
                      <div key={index}>
                        <div className="form-group row">
                          <label className="col-form-label col-md-2">
                            Select Language <span className="text-danger">*</span>
                          </label>
                          <div className="col-md-4">
                            <select
                              className={`form-control form-control-md m-t-10${formErrors[index]?.language_code ? "is-invalid" : ""
                                }`}
                              value={item.language_code}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "language_code",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Language</option>
                              <option value="en">English</option>
                              <option value="mr">Marathi</option>
                            </select>
                            {formErrors[index]?.language_code && (
                              <small className="text-danger">
                                {formErrors[index].language_code}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-form-label col-md-2 m-t-10">
                            Main Menu <span className="text-danger">*</span>
                          </label>
                          <div className="col-md-3">
                            <input
                              type="text"
                              placeholder="Enter Main menu name"
                              className={`form-control form-control-md m-t-10${formErrors[index]?.mainMenu ? "is-invalid" : ""
                                }`}
                              value={item.mainMenu}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "mainMenu",
                                  e.target.value
                                )
                              }
                            />
                            {formErrors[index]?.mainMenu && (
                              <small className="text-danger">
                                {formErrors[index].mainMenu}
                              </small>
                            )}
                          </div>
                          <div className="col-md-3">
                            <input
                              type="text"
                              placeholder="Enter Main menu link"
                              className={`form-control form-control-md m-t-10${formErrors[index]?.mainMenuLink
                                ? "is-invalid"
                                : ""
                                }`}
                              value={item.mainMenuLink}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "mainMenuLink",
                                  e.target.value
                                )
                              }
                              disabled={item.isDisabled}
                            />
                            {formErrors[index]?.mainMenuLink && (
                              <small className="text-danger">
                                {formErrors[index].mainMenuLink}
                              </small>
                            )}
                          </div>
                        </div>
                        {item.subMenus.map((subMenu, subIndex) => (
                          <div className="form-group row" key={subIndex}>
                            <label className="col-form-label col-md-2 m-t-10">
                              Sub Menu <span className="text-danger">*</span>
                            </label>
                            <div className="col-md-3">
                              <input
                                type="text"
                                placeholder="Enter Sub menu name"
                                className={`form-control m-t-10 ${formErrors[index]?.subMenus[subIndex]?.subMenu
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                value={subMenu.subMenu}
                                onChange={(e) =>
                                  handleSubMenuChange(
                                    index,
                                    subIndex,
                                    "subMenu",
                                    e.target.value
                                  )
                                }
                              />
                              {formErrors[index]?.subMenus?.[subIndex]
                                ?.subMenu && (
                                  <small className="text-danger">
                                    {formErrors[index].subMenus[subIndex].subMenu}
                                  </small>
                                )}
                            </div>
                            <div className="col-md-3">
                              <input
                                type="text"
                                placeholder="Enter Sub menu link"
                                className={`form-control m-t-10 ${formErrors[index]?.subMenus[subIndex]?.subLink
                                  ? "is-invalid"
                                  : ""
                                  }`}
                                value={subMenu.subLink}
                                onChange={(e) =>
                                  handleSubMenuChange(
                                    index,
                                    subIndex,
                                    "subLink",
                                    e.target.value
                                  )
                                }
                              />
                              {formErrors[index]?.subMenus?.[subIndex]
                                ?.subLink && (
                                  <small className="text-danger">
                                    {formErrors[index].subMenus[subIndex].subLink}
                                  </small>
                                )}
                            </div>
                            <div className="col-md-1">
                              <button
                                type="button"
                                className="btn btn-danger m-t-10"
                                onClick={() =>
                                  handleDeleteSubMenu(index, subIndex)
                                }
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="form-group row">
                          <div className="col-md-2"></div>
                          <div className="col-md-4">
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => handleAddMoreSubMenu(index)}
                              disabled={
                                !item.mainMenu.trim() ||
                                item.mainMenuLink !== "#"
                              }
                            >
                              <i className="fa fa-plus"></i> Add Sub menu
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <input
                      type="submit"
                      className="btn btn-primary btn-sm"
                      value="Submit"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>

  );
};

export default AddMainMenu;
