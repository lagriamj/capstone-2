/* eslint-disable no-undef */
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightFromBracket,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HandymanIcon from "@mui/icons-material/Handyman";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useActiveTab } from "../ActiveTabContext";
import { useEffect, useState } from "react";
import { useActiveSubTab } from "../ActiveSubTabContext";
import axios from "axios";
import { Button, Modal, message } from "antd";

const AdminSidebar = () => {
  const { activeTab, setActive } = useActiveTab();
  const { activeSubTab, setActiveSub } = useActiveSubTab();
  const [isLogout, setIsLogout] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isScreenWidth1366 = windowWidth <= 1366;

  const [logoutModal, setLogoutModal] = useState(false);
  const showLogoutConfirmationModal = () => {
    setLogoutModal(true);
  };

  const handleOkLogout = () => {
    handleLogout();
  };

  const handleCancelLogout = () => {
    setLogoutModal(false);
  };

  return (
    <div
      className={`sidebar flex flex-col bg-main h-screen w-[17%] font-sans overflow-auto text-white ${
        isScreenWidth1366 ? "text-sm" : "text-lg"
      } fixed top-0 left-0`}
    >
      <Modal
        title="Confirm Logout"
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
        <p className="flex items-center justify-center gap-4">
          Are you sure you want to logout?
        </p>
      </Modal>
      <div className="w-full flex gap-4 items-center justify-center py-4 px-3 my-2">
        <img className="w-1/3 h-[95%]" src="/cityhalllogo.png" alt="" />
        <img className="w-1/3 h-[95%]" src="/citclogo.png" alt="" />
      </div>

      <hr className="mx-7 mb-8" />
      <ul className="flex flex-col justify-center items-start gap-2 px-5 lg:ml-4 mediumLg:ml-0">
        <li
          className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "dashboard" ? "bg-white text-main font-semibold" : ""
          }`}
          onClick={() => handleItemClick("dashboard")}
        >
          <DashboardIcon
            style={{
              fontSize: isScreenWidth1366 ? "1.2rem" : "",
            }}
          ></DashboardIcon>
          <Link to={"/dashboard"}>Dashboard</Link>
        </li>
        <li
          className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "service-request"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("service-request")}
        >
          <HandymanIcon
            style={{
              fontSize: isScreenWidth1366 ? "1.2rem" : "",
            }}
          ></HandymanIcon>
          <Link to={"/service-request"}>Service Request</Link>
        </li>
        {/* <li
          className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "receive-service"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("receive-service")}
        >
          <MarkAsUnreadIcon
            style={{
              fontSize: isScreenWidth1366 ? "1.2rem" : "",
            }}
          ></MarkAsUnreadIcon>
          <Link to={"/receive-service"}>Receive Service</Link>
          </li> */}
        <li
          className={`flex gap-3 items-center w-full py-3 px-2 rounded-lg transition duration-300 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "service-task"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("service-task")}
        >
          <AssignmentIcon
            style={{
              fontSize: isScreenWidth1366 ? "1.2rem" : "",
            }}
          ></AssignmentIcon>
          <Link to={"/service-task"}>Service Task</Link>
        </li>
        {/* <li
          className={`flex gap-3 items-center w-full py-3 px-2 whitespace-nowrap rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "service-transaction"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("service-transaction")}
        >
          <WorkHistoryIcon
            style={{
              fontSize: isScreenWidth1366 ? "1.2rem" : "",
            }}
          ></WorkHistoryIcon>
          <Link to={"/service-transaction"}>Service Transaction</Link>
        </li>
          */}
        <li
          className={`flex gap-3 items-center relative w-full py-3 px-2 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "utilitySettings"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleUtilityClick("utilitySettings")}
        >
          <FontAwesomeIcon
            icon={faGear}
            className={`${isScreenWidth1366 ? "h-4" : "h-5"}`}
          />
          Utility Settings
          <div
            className={`absolute z-50 top-10 left-0 w-full bg-white border rounded-lg shadow-lg p-3 ${
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

      <div className="flex flex-col mt-auto  mb-10">
        <hr className="mx-7 mt-4 mb-5" />
        <div className="flex flex-col  lg:mx-2  mediumLg:mx-0">
          <ul className="flex flex-col justify-center items-start gap-3 px-5">
            <li
              className={`flex gap-3 w-full cursor-pointer items-center relative py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
                activeTab === "account"
                  ? "bg-white text-main font-semibold"
                  : ""
              }`}
              onClick={() => handleAccountClick("account")}
            >
              <FontAwesomeIcon
                icon={faUser}
                className={`${isScreenWidth1366 ? "h-4" : "h-5"}`}
              />
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
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className={`${isScreenWidth1366 ? "h-3" : "h-5"}`}
              />
              <Link>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
