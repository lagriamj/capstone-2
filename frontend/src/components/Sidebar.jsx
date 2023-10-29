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
import { Button, Modal, message } from "antd";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { activeTab, setActive } = useActiveTab();
  const [isLogout, setIsLogout] = useState(false);

  const handleLogout = async () => {
    setIsLogout(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/logout`
      );

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
      className={`sidebar flex flex-col bg-main h-screen w-[17%] font-sans text-white text-lg  fixed top-0 left-0`}
    >
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
          <label
            className="cursor-pointer"
            onClick={() => {
              navigate("/request");
            }}
          >
            Request Services
          </label>
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
          <label
            className="cursor-pointer"
            onClick={() => {
              navigate("/current-requests");
            }}
          >
            Current Requests
          </label>
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
          <label
            className="cursor-pointer"
            onClick={() => {
              navigate("/transactions");
            }}
          >
            Transactions
          </label>
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
              <label
                className="cursor-pointer"
                onClick={() => {
                  navigate("/account");
                }}
              >
                Account
              </label>
            </li>
            <li
              onClick={showLogoutConfirmationModal}
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
