import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodePullRequest,
  faList,
  faClipboard,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";
import { useActiveTab } from "../ActiveTabContext";
import axios from "axios";
import { message } from "antd";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { activeTab, setActive } = useActiveTab();

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/logout");

      if (response.status === 200) {
        message.success("Logout Successfull");
        logout();
        navigate("/login");
        setActive("request");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemClick = (item) => {
    setActive(item);
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

  const isScreenWidth1366 = windowWidth === 1366;

  return (
    <div
      className={`sidebar flex flex-col bg-main h-screen w-[17%] font-sans text-white text-lg  fixed top-0 left-0`}
    >
      <div className="w-full flex gap-4 items-center justify-center py-4 px-3 my-2">
        <img className="w-1/3 h-[95%]" src="/cityhalllogo.png" alt="" />
        <img className="w-1/3 h-[95%]" src="/citclogo.png" alt="" />
      </div>

      <hr className="mx-7 mb-8" />
      <ul
        className={`flex flex-col  ${
          isScreenWidth1366 ? "text-sm" : "text-base"
        }  justify-center items-start gap-4 px-4 lg:ml-4`}
      >
        <li
          className={`flex gap-3 w-full items-center py-3 px-2 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "request" ? "bg-white text-main font-semibold" : ""
          }`}
          onClick={() => handleItemClick("request")}
        >
          <FontAwesomeIcon
            icon={faCodePullRequest}
            className={`${isScreenWidth1366 ? "h-3" : "h-5"}`}
          />
          <Link to={"/request"}>Request Services</Link>
        </li>
        <li
          className={`flex gap-3 w-full items-center py-3 px-2 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "current-requests"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("current-requests")}
        >
          <FontAwesomeIcon
            icon={faList}
            className={`${isScreenWidth1366 ? "h-3" : "h-5"}`}
          />
          <Link to={"/current-requests"}>Current Requests</Link>
        </li>
        <li
          className={`flex gap-3 w-full items-center py-3 px-2 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
            activeTab === "transactions"
              ? "bg-white text-main font-semibold"
              : ""
          }`}
          onClick={() => handleItemClick("transactions")}
        >
          <FontAwesomeIcon
            icon={faClipboard}
            className={`${isScreenWidth1366 ? "h-3" : "h-5"}`}
          />
          <Link to={"/transactions"}>Service Transaction</Link>
        </li>
      </ul>

      <div className="flex flex-col mt-auto mb-10">
        <hr className="mx-7 mb-5" />
        <div className="flex flex-col   ">
          <ul
            className={`flex flex-col  ${
              isScreenWidth1366 ? "text-sm" : "text-base"
            }  justify-center items-start gap-2 px-4 lg:ml-4`}
          >
            <li
              className={`flex gap-3 w-full items-center py-3 px-2 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
                activeTab === "account"
                  ? "bg-white text-main font-semibold"
                  : ""
              }`}
              onClick={() => handleItemClick("account")}
            >
              <FontAwesomeIcon
                icon={faUser}
                className={`${isScreenWidth1366 ? "h-3" : "h-5"}`}
              />
              <Link to={"/account"}>Account</Link>
            </li>
            <li
              onClick={handleLogout}
              className="flex gap-3 items-center py-3 px-2 rounded-lg w-full hover:bg-white hover:text-main hover:font-semibold"
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

export default Sidebar;
