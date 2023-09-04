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
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import RecommendIcon from "@mui/icons-material/Recommend";
import { useActiveTab } from "../ActiveTabContext";
import { useState } from "react";
import { useActiveSubTab } from "../ActiveSubTabContext";

const AdminSidebar = () => {
  const { activeTab, setActive } = useActiveTab();
  const { activeSubTab, setActiveSub } = useActiveSubTab();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleItemClickAccount = (item) => {
    setActiveSub(item);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
    setActive("dashboard");
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleItemClick = (item) => {
    setActive(item);
  };

  const handleAccountClick = (item) => {
    setActive(item);
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sidebar flex flex-col bg-main h-screen w-[17%] font-sans overflow-auto text-white text-lg fixed top-0 left-0">
      <div className="w-full flex gap-4 items-center justify-center py-4 px-3 mb-5">
        <img className="w-1/3 h-[95%]" src="/cityhalllogo.png" alt="" />
        <img className="w-1/3 h-[95%]" src="/citclogo.png" alt="" />
      </div>

      <hr className="mx-7 mb-8" />
      <ul className="flex flex-col justify-center items-start gap-4 px-5 lg:ml-5">
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "dashboard" ? "bg-white text-main font-semibold" : ""
          }`}
          onClick={() => handleItemClick("dashboard")}
        >
          <DashboardIcon></DashboardIcon>
          <Link to={"/dashboard"}>Dashboard</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "service-request"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("service-request")}
        >
          <HandymanIcon></HandymanIcon>
          <Link to={"/service-request"}>Service Request</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "receive-service"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("receive-service")}
        >
          <MarkAsUnreadIcon></MarkAsUnreadIcon>
          <Link to={"/receive-service"}>Receive Service</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "service-task"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("service-task")}
        >
          <AssignmentIcon></AssignmentIcon>
          <Link to={"/service-task"}>Service Task</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "service-transaction"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("service-transaction")}
        >
          <WorkHistoryIcon></WorkHistoryIcon>
          <Link to={"/service-transaction"}>Service Transaction</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "recommendation"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("recommendation")}
        >
          <RecommendIcon></RecommendIcon>
          <Link to={"/recommendation"}>Recommendation</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "utility-settings"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("utility-settings")}
        >
          <FontAwesomeIcon icon={faGear} className="h-5" />
          <Link to={"/utility-settings"}>Utility Settings</Link>
        </li>
      </ul>

      <div className="flex flex-col mt-auto mb-10">
        <hr className="mx-7 mb-5" />
        <div className="flex flex-col  lg:mx-5 ">
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
              onClick={handleLogout}
              className="flex gap-3 items-center py-3 px-4 rounded-lg w-full transition duration-200 ease-in-out hover:bg-white hover:text-main hover:font-semibold"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="h-5" />
              <Link>Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
