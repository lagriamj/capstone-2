import { useState } from "react";
import { Drawer } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodePullRequest,
  faList,
  faClipboard,
  faUser,
  faRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";
import { useActiveTab } from "../ActiveTabContext";
import axios from "axios";
import { Button, Modal, message } from "antd";

const DrawerComponent = () => {
  const [open, setOpen] = useState(false);
  const { activeTab, setActive } = useActiveTab();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLogout, setIsLogout] = useState(false);

  const handleItemClick = (item) => {
    setActive(item);
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
    <div className=" w-screen bg-main py-4 flex items-center justify-center fixed top-0">
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
        <div className="sidebar flex flex-col bg-main h-screen w-full font-sans text-white text-lg">
          <div className="w-full flex gap-4 items-center justify-center py-4 px-3 mb-5">
            <img className="w-1/3 h-[95%]" src="/cityhalllogo.png" alt="" />
            <img className="w-1/3 h-[95%]" src="/citclogo.png" alt="" />
          </div>

          <hr className="mx-7 mb-8" />
          <ul className="flex flex-col justify-center items-start gap-4 px-5">
            <li
              className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
                activeTab === "request"
                  ? "bg-white text-main font-semibold"
                  : ""
              }`}
              onClick={() => handleItemClick("request")}
            >
              <FontAwesomeIcon icon={faCodePullRequest} className="h-5" />
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
              className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
                activeTab === "current-requests"
                  ? "bg-white text-main font-semibold"
                  : ""
              }`}
              onClick={() => handleItemClick("current-requests")}
            >
              <FontAwesomeIcon icon={faList} className="h-5" />
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
              className={`flex gap-3 items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
                activeTab === "transactions"
                  ? "bg-white text-main font-semibold"
                  : ""
              }`}
              onClick={() => handleItemClick("transactions")}
            >
              <FontAwesomeIcon icon={faClipboard} className="h-5" />
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
            <div className="flex flex-col">
              <ul className="flex flex-col justify-center items-start gap-3 px-5">
                <li
                  className={`flex gap-3 w-full items-center py-3 px-4 rounded-lg hover:bg-white hover:text-main hover:font-semibold ${
                    activeTab === "account"
                      ? "bg-white text-main font-semibold"
                      : ""
                  }`}
                  onClick={() => handleItemClick("account")}
                >
                  <FontAwesomeIcon icon={faUser} className="h-5" />
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
                  className="flex gap-3 items-center py-3 px-4 rounded-lg w-full hover:bg-white hover:text-main hover:font-semibold"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="h-5" />
                  <Link>Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerComponent;
