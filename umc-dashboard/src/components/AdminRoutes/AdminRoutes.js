import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AddGeneralAdminDepartment from "../GenAdminDept/AddGeneralAdminDepartment";
import AddGeneralYear from "../GenAdminDept/AddGeneralYear";
import AddDepartmentData from "../DepartmentData/AddDepartmentData";
import AddYear from "../DepartmentData/AddYear";
import api from "../api";

function AdminRoutes({ department }) {
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
    <div>
      <Routes>
        {department === "General Admin Department" ? (
          <>
            <Route
              path="/add-general-department"
              element={
                <AddGeneralAdminDepartment
                  fetchDepartmentsData={fetchDepartmentsData}
                />
              }
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
              path="*"
              element={<Navigate to="/add-general-department" />}
            />
          </>
        ) : (
          <>
            {departments
              .filter((dept) => dept?.department_name === department)
              .map((dept) => (
                <Route
                  key={dept.department_name}
                  path={`/add-${dept.department_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  element={
                    <AddDepartmentData
                      departmentId={"" || dept.id}
                      fetchDepartments={fetchDepartments}
                      fetchDepartmentData={fetchDepartmentData}
                    />
                  }
                />
              ))}

            {departmentData
              .filter((data) => data.department_name === department)
              .map((data) =>
                data?.heading_link ? (
                  <Route
                    key={data?.heading_link}
                    path={`/add-${data?.heading_link.replace(/^\//, "")}`}
                    element={<AddYear />}
                  />
                ) : null
              )}

            <Route
              path="*"
              element={
                <Navigate
                  to={`/add-${department.toLowerCase().replace(/\s+/g, "-")}`}
                />
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default AdminRoutes;
