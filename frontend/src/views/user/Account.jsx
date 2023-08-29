import React from "react";
import DrawerComponent from "../../components/DrawerComponent";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { message, Modal, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import PropagateLoader from "react-spinners/PropagateLoader";

const Account = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isLargeScreen = windowWidth >= 1024;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userFirstName, setFirstName] = useState("");
  const [userLastName, setLastName] = useState("");
  const [userEmail, setEmail] = useState("");
  const { userID } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSavingChanges, setIsSavingChange] = useState(false);

  const showModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/account?userID=${userID}`
      );

      console.log("API Response:", response.data.results);

      const user = response.data.results[0];

      setUserData(user);
      setFirstName(user.userFirstName);
      setLastName(user.userLastName);
      setEmail(user.userEmail);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setIsSavingChange(true);

    const userPassword = e.target.userCurrentPassword.value;
    const newPassword = e.target.userNewPassword.value;
    const userFirstName = e.target.EditedUserFirstName.value;
    const userLastName = e.target.EditedUserLastName.value;
    const userEmail = e.target.EditedUserEmail.value;

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/change-password",
        {
          userID, // You need to pass the user ID here if required by your API
          userPassword,
          newPassword,
          userFirstName,
          userLastName,
          userEmail,
        }
      );

      const data = response.data;
      console.log(data);

      message.success("Details updated successfully");
      setIsModalVisible(false);
      setCurrentPassword("");
      setNewPassword("");
      setFirstName();
      setLastName("");
      setEmail("");
      fetchData();
      setIsSavingChange(false);
    } catch (err) {
      setIsSavingChange(false);
      console.error("Password change failed:", err);
      message.error(
        "Password change failed. Please check your current password."
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-200 h-screen lg:pl-16 lg:pb-10 ">
      {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
      <div className="lg:w-[80%] w-[90%] min-h-[90vh]  mt-10 lg:mt-10 h-4/5 pb-10 bg-white shadow-xl self-center lg:ml-80 border-0 border-gray-400   rounded-3xl flex flex-col items-center font-sans">
        <h1 className=" text-3xl text-center my-10 font-bold ">
          Account Details
        </h1>
        <form
          action=""
          className=" w-11/12 h-auto  justify-center"
          onSubmit={handlePasswordChange}
        >
          <div className="flex lg:gap-10 gap-4 items-center my-4 flex-col lg:flex-row">
            <div className="lg:w-1/4 w-[80%]">
              <div className="flex flex-col">
                <label className="font-semibold text-lg ">Government ID</label>
                <input
                  type="text"
                  name="userGovernmentID"
                  id="userGovernmentID"
                  value={userData?.userGovernmentID || ""}
                  className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
            <div className="lg:w-1/4 w-[80%]">
              <div className="flex flex-col">
                <label className="font-semibold text-lg ">Typed:</label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={userData?.role || ""}
                  className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex lg:gap-10 gap-4 items-center flex-col lg:flex-row ">
            <div className="lg:w-1/4 w-[80%]  ">
              <div className="flex flex-col">
                <label className="font-semibold text-lg ">First Name:</label>
                <input
                  type="text"
                  name="userFirstName"
                  id="userFirstName"
                  value={userData?.userFirstName || ""}
                  className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
            <div className="lg:w-1/4 w-[80%]">
              <div className="flex flex-col">
                <label className="font-semibold text-lg ">Email:</label>
                <input
                  type="text"
                  name="userEmail"
                  id="userEmail"
                  value={userData?.userEmail || ""}
                  className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex lg:gap-10 gap-4 items-center my-4 flex-col lg:flex-row">
            <div className="lg:w-1/4 w-[80%]">
              <div className="flex flex-col">
                <label className="font-semibold text-lg ">Last Name:</label>
                <input
                  type="text"
                  name="userLastName"
                  id="userLastName"
                  value={userData?.userLastName || ""}
                  className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
            <div className="lg:w-1/4 w-[80%]">
              <div className="flex flex-col">
                <label className="font-semibold text-lg ">Contact:</label>
                <input
                  type="text"
                  name="userContactNumber"
                  id="userContactNumber"
                  value={userData?.userContactNumber || ""}
                  className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                  readOnly
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={showModal}
            className="bg-main text-white px-4 py-3 rounded-lg text-xl mt-10 lg:mr-auto"
          >
            Update Details
          </button>
        </form>
        <Modal
          title="Update Account Details"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <form
            action=""
            className=" w-full h-auto  justify-center font-sans"
            onSubmit={handlePasswordChange}
          >
            <div className="flex lg:gap-10 gap-4 items-center my-4 flex-col lg:flex-row font-sans">
              <div className="lg:w-1/2 w-[80%]">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg ">
                    Government ID
                  </label>
                  <input
                    type="text"
                    name="userGovernmentID"
                    id="userGovernmentID"
                    value={userData?.userGovernmentID || ""}
                    className="w-full border-2 border-gray-400 bg-gray-200 cursor-not-allowed rounded-md py-2 px-4 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
              <div className="lg:w-1/2 w-[80%]">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg ">Typed:</label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    value={userData?.role || ""}
                    className="w-full border-2 border-gray-400 bg-gray-200 cursor-not-allowed rounded-md py-2 px-4 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="flex lg:gap-10 gap-4 items-center flex-col lg:flex-row ">
              <div className="lg:w-1/2 w-[80%]  ">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg ">First Name:</label>
                  <input
                    type="text"
                    name="EditedUserFirstName"
                    id="EditedUserFirstName"
                    className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                    value={userFirstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="lg:w-1/2 w-[80%]">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg ">Email:</label>
                  <input
                    type="email"
                    name="EditedUserEmail"
                    id="EditedUserEmail"
                    className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                    value={userEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex lg:gap-10 gap-4 items-center my-4 flex-col lg:flex-row">
              <div className="lg:w-1/2 w-[80%]">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg ">Last Name:</label>
                  <input
                    type="text"
                    name="EditedUserLastName"
                    id="EditedUserLastName"
                    className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                    value={userLastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="lg:w-1/2 w-[80%]">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg ">
                    Current Password:
                  </label>
                  <input
                    type="password"
                    name="userCurrentPassword"
                    id="userCurrentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex lg:gap-10 gap-4 items-center my-4 flex-col lg:flex-row">
              <div className="lg:w-1/2 w-[80%]">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg ">Contact:</label>
                  <input
                    type="text"
                    name="userContactNumber"
                    id="userContactNumber"
                    value={userData?.userContactNumber || ""}
                    className="w-full border-2 border-gray-400 bg-gray-200 cursor-not-allowed rounded-md py-2 px-4 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
              <div className="lg:w-1/2 w-[80%]">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg ">
                    New Password:
                  </label>
                  <input
                    type="password"
                    name="userNewPassword"
                    id="userNewPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full border-2 border-gray-400 py-2 rounded-md px-4 focus:outline-none ${
                      currentPassword === ""
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={currentPassword === ""}
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-main text-white  py-3 rounded-lg text-lg mt-4 w-40 h-18 "
            >
              {isSavingChanges ? (
                <PropagateLoader color="#FFFFFF" className="mb-3" />
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Account;
