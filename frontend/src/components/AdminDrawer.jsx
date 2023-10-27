import { useState } from "react";
import { Drawer } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HandymanIcon from "@mui/icons-material/Handyman";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import { useAuth } from "../AuthContext";
import { useActiveTab } from "../ActiveTabContext";
import { useActiveSubTab } from "../ActiveSubTabContext";
import axios from "axios";
import { Button, Modal, message } from "antd";

const AdminDrawer = () => {
  const [open, setOpen] = useState(false);
  const { activeTab, setActive } = useActiveTab();
  const { activeSubTab, setActiveSub } = useActiveSubTab();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLogout, setIsLogout] = useState(false);

  const handleItemClickAccount = (item) => {
    setActiveSub(item);
  };

  const handleLogout = async () => {
    setIsLogout(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/logout");

      if (response.status === 200) {
        message.success("Logout Successfull");
        setIsLogout(false);
        logout();
        navigate("/login");
        setActive("dashboard");
      }
    } catch (error) {
      console.log(error);
      setIsLogout(false);
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownUtilityOpen, setIsDropdownUtilityOpen] = useState(false);

  const handleItemClick = (item) => {
    setActive(item);
  };

  const handleAccountClick = (item) => {
    setActive(item);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUtilityClick = (item) => {
    setActive(item);
    setIsDropdownUtilityOpen(!isDropdownUtilityOpen);
  };

  const [logoutModal, setLogoutModal] = useState(false);
  const showLogoutConfirmationModal = () => {
    setLogoutModal(true);
    setOpen(false);
  };

  const handleOkLogout = () => {
    handleLogout();
  };

  const handleCancelLogout = () => {
    setLogoutModal(false);
  };

  return (
    <div className=" w-screen z-40 bg-main py-4 flex items-center justify-center fixed top-0">
      <div className="flex">
        <img className="w-10 h-10" src="/cityhalllogo.png" alt="" />
        <img className="w-10 h-10" src="/citclogo.png" alt="" />
      </div>
      <FontAwesomeIcon
        icon={faBars}
        style={{ color: "#ffffff" }}
        onClick={() => setOpen(true)}
        className="flex absolute right-0 mr-10 h-7 w-7 cursor-pointer"
      />
      <Modal
        title="Logout Confirmation"
        onCancel={handleCancelLogout}
        open={logoutModal}
        footer={[
          <Button key="cancel" onClick={handleCancelLogout}>
            Cancel
          </Button>,
          <Button
            loading={isLogout}
            key="ok"
            className="bg-red-700 text-white"
            onClick={handleOkLogout}
          >
            {isLogout ? "Logging out" : "Logout"}
          </Button>,
        ]}
      >
        <p className="flex text-xl items-center justify-center gap-4">
          Are you sure you want to logout?
        </p>
      </Modal>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: { width: "80%", backgroundColor: "#1E2772", color: "white" },
        }}
      >
        <div className="w-full flex gap-4 items-center justify-center py-4 px-3 my-2">
          <img className="w-1/3 h-[95%]" src="/cityhalllogo.png" alt="" />
          <img className="w-1/3 h-[95%]" src="/citclogo.png" alt="" />
        </div>

        <hr className="mx-7 mb-8" />
        <ul className="flex flex-col justify-center items-start gap-4 px-5 lg:ml-4">
          <li
            className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
              activeTab === "dashboard"
                ? "bg-white text-main font-semibold"
                : ""
            }`}
            onClick={() => handleItemClick("dashboard")}
          >
            <DashboardIcon></DashboardIcon>
            <label
              className="cursor-pointer"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Dashboard
            </label>
          </li>
          <li
            className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
              activeTab === "walkIn-entry"
                ? "bg-white text-main font-semibold"
                : ""
            }`}
            onClick={() => handleItemClick("walkIn-entry")}
          >
            <DirectionsWalkIcon></DirectionsWalkIcon>
            <label
              className="cursor-pointer"
              onClick={() => {
                navigate("/walk-in-request");
              }}
            >
              Walk-In Entry
            </label>
          </li>
          <li
            className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
              activeTab === "service-request"
                ? "bg-white text-main font-semibold"
                : ""
            }`}
            onClick={() => handleItemClick("service-request")}
          >
            <HandymanIcon></HandymanIcon>
            <label
              className="cursor-pointer"
              onClick={() => {
                navigate("/service-request");
              }}
            >
              Service Request
            </label>
          </li>
          <li
            className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-300 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
              activeTab === "service-task"
                ? "bg-white text-main font-semibold"
                : ""
            }`}
            onClick={() => handleItemClick("service-task")}
          >
            <AssignmentIcon></AssignmentIcon>
            <label
              className="cursor-pointer"
              onClick={() => {
                navigate("/service-task");
              }}
            >
              Service Task
            </label>
          </li>
          <li
            className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-300 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
              activeTab === "threshold-log"
                ? "bg-white text-main font-semibold"
                : ""
            }`}
            onClick={() => handleItemClick("threshold-log")}
          >
            <DataThresholdingIcon></DataThresholdingIcon>
            <label
              className="cursor-pointer"
              onClick={() => {
                navigate("/threshold-log");
              }}
            >
              Threshold Log
            </label>
          </li>
          <li
            className={`flex gap-3 items-center relative w-full py-3 px-2 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
              activeTab === "utilitySettings"
                ? "bg-white text-main font-semibold"
                : ""
            }`}
            onClick={() => handleUtilityClick("utilitySettings")}
          >
            <FontAwesomeIcon icon={faGear} className="h-5" />
            Utility Settings
            <div
              className={`absolute  top-10 left-0 w-full bg-white border rounded-lg shadow-lg p-3 ${
                isDropdownUtilityOpen ? "" : "hidden"
              }`}
            >
              {/* Dropdown Tabs */}
              <div className="flex flex-col gap-2">
                <button
                  className={`block text-left px-3 py-2 w-full rounded-lg hover:bg-main hover:text-white ${
                    activeSubTab === "departments"
                      ? "bg-main text-white font-medium"
                      : ""
                  }`}
                  onClick={() => {
                    handleItemClickAccount("departments");
                    navigate("/admin/departments");
                  }}
                >
                  Departments/Office
                </button>
                <button
                  className={`block text-left px-3 py-2 w-full rounded-lg hover:bg-main hover:text-white ${
                    activeSubTab === "categories"
                      ? "bg-main text-white font-medium"
                      : ""
                  }`}
                  onClick={() => {
                    // Handle tab click (e.g., navigate to a different page)
                    handleItemClickAccount("categories");
                    navigate("/admin/categories");
                  }}
                >
                  Categories
                </button>
                <button
                  className={`block text-left px-3 py-2 w-full rounded-lg hover:bg-main hover:text-white ${
                    activeSubTab === "natureOfRequests"
                      ? "bg-main text-white font-medium"
                      : ""
                  }`}
                  onClick={() => {
                    // Handle tab click (e.g., navigate to a different page)
                    handleItemClickAccount("natureOfRequests");
                    navigate("/admin/nature-of-requests");
                  }}
                >
                  Nature of Requests
                </button>
                <button
                  className={`block text-left px-3 py-2 w-full rounded-lg hover:bg-main hover:text-white ${
                    activeSubTab === "auditLog"
                      ? "bg-main text-white font-medium"
                      : ""
                  }`}
                  onClick={() => {
                    // Handle tab click (e.g., navigate to a different page)
                    handleItemClickAccount("auditLog");
                    navigate("/admin/audit-log");
                  }}
                >
                  Audit Log
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div className="flex flex-col mt-auto mb-10">
          <hr className="mx-7 mb-5" />
          <div className="flex flex-col  lg:mx-2 ">
            <ul className="flex flex-col justify-center items-start gap-3 px-5">
              <li
                className={`flex gap-3 w-full cursor-pointer items-center relative py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
                  activeTab === "account"
                    ? "bg-white text-main font-semibold"
                    : ""
                }`}
                onClick={() => handleAccountClick("account")}
              >
                <FontAwesomeIcon icon={faUser} className="h-5" />
                Account
                <div
                  className={`absolute top-10 left-0 w-full bg-white border rounded-lg shadow-lg p-3 ${
                    isDropdownOpen ? "" : "hidden"
                  }`}
                >
                  {/* Dropdown Tabs */}
                  <div className="">
                    <button
                      className={`block text-left px-3 py-2 w-full rounded-lg hover:bg-main hover:text-white ${
                        activeSubTab === "accountSub"
                          ? "bg-main text-white font-medium"
                          : ""
                      }`}
                      onClick={() => {
                        handleItemClickAccount("accountSub");
                        navigate("/admin/account");
                      }}
                    >
                      Account
                    </button>
                    <button
                      className={`block text-left px-3 py-2 w-full rounded-lg hover:bg-main hover:text-white ${
                        activeSubTab === "userstList"
                          ? "bg-main text-white font-medium"
                          : ""
                      }`}
                      onClick={() => {
                        // Handle tab click (e.g., navigate to a different page)
                        handleItemClickAccount("userstList");
                        navigate("/users-list");
                      }}
                    >
                      Users List
                    </button>
                  </div>
                </div>
              </li>
              <li
                onClick={showLogoutConfirmationModal}
                className="flex gap-3 items-center py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold"
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="h-5" />
                <Link>Logout</Link>
              </li>
            </ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default AdminDrawer;
