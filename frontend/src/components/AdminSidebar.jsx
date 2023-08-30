import React, { useState } from "react";
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

const AdminSidebar = () => {
  const [active, setActive] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate;

  const handleItemClick = (item) => {
    setActive((prevActive) => (prevActive === item ? null : item));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar flex flex-col bg-main h-screen w-[17%] font-sans text-white text-lg fixed top-0 left-0">
      <div className="w-full flex gap-4 items-center justify-center py-4 px-3 mb-5">
        <img className="w-1/3 h-[95%]" src="/cityhalllogo.png" alt="" />
        <img className="w-1/3 h-[95%]" src="/citclogo.png" alt="" />
      </div>

      <hr className="mx-7 mb-8" />
      <ul className="flex flex-col justify-center items-start gap-4 px-5 lg:ml-5">
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            active === "dashboard" ? "bg-white text-main font-semibold" : ""
          }`}
          onClick={() => handleItemClick("dashboard")}
        >
          <DashboardIcon></DashboardIcon>
          <Link to={"/dashboard"}>Dashboard</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            active === "service-request"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("service-request")}
        >
          <HandymanIcon></HandymanIcon>
          <Link to={"/service-request"}>Service Request</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            active === "receive-service"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("receive-service")}
        >
          <MarkAsUnreadIcon></MarkAsUnreadIcon>
          <Link to={"/receive-service"}>Receive Service</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            active === "service-task" ? "bg-white text-main font-semibold" : ""
          }`}
          onClick={() => handleItemClick("service-task")}
        >
          <AssignmentIcon></AssignmentIcon>
          <Link to={"/service-task"}>Service Task</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            active === "service-transaction"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("service-transaction")}
        >
          <WorkHistoryIcon></WorkHistoryIcon>
          <Link to={"/service-transaction"}>Service Transaction</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            active === "recommendation"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("recommendation")}
        >
          <RecommendIcon></RecommendIcon>
          <Link to={"/recommendation"}>Recommendation</Link>
        </li>
        <li
          className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            active === "utility-settings"
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
              className={`flex gap-3 w-full items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
                active === "account" ? "bg-white text-main font-semibold" : ""
              }`}
              onClick={() => handleItemClick("account")}
            >
              <FontAwesomeIcon icon={faUser} className="h-5" />
              <Link to={"/admin/account"}>Account</Link>
            </li>
            <li
              onClick={handleLogout}
              className="flex gap-3 items-center py-3 px-4 rounded-lg w-full hover:bg-white hover:text-main hover:font-semibold"
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
