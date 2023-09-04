import DrawerComponent from "../../components/DrawerComponent";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { Button, message, Modal } from "antd";
import UpdateContactNumModal from "../../components/UpdateContactNumModal";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
  const [userNewContactNumber, setUserNewContactNumber] = useState("");
  const [userPasswordChecker, setUserPasswordChecker] = useState("");

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

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/change-password",
        {
          userID, // You need to pass the user ID here if required by your API
          currentPassword,
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

  const [modalMode, setModalMode] = useState("password");
  const [modalUpdateContact, setModalUpdateContact] = useState(false);

  const handleModalUpdateContact = () => {
    setModalUpdateContact(false);
    // You might also want to reset any necessary state values here
  };

  const handlePasswordCheck = async () => {
    setIsSavingChange(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/check-password",
        {
          password: userPasswordChecker,
          userID: userID,
        }
      );

      if (response.status === 200) {
        // Password is correct, update the UI mode
        setModalMode("contactNumber");
        setCurrentPassword("");
        setIsSavingChange(false);
      } else {
        // Handle incorrect password
        setIsSavingChange(false);
        message.error("Password is incorrect");
      }
    } catch (error) {
      // Handle API request error
      setIsSavingChange(false);
      message.error("Password is incorrect");
    }
  };

  const handleContactNumberUpdate = async (e) => {
    e.preventDefault();

    setIsSavingChange(true);
    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/update-contact",
        {
          newContactNumber: userNewContactNumber,
          userID: userID,
        }
      );

      if (response.status === 200) {
        setModalUpdateContact(false);
        message.success("Contact Number Updated Successfully");
        fetchData();
        setUserNewContactNumber("");
        setIsSavingChange(false);
      } else {
        setIsSavingChange(false);
        message.error("Contact Number Update Failed");
      }
    } catch (error) {
      setIsSavingChange(false);
      message.error("An error occurred while updating contact number");
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Account</title>
      </Helmet>
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
                  <label
                    className="font-semibold text-lg "
                    htmlFor="governmentID"
                  >
                    Government ID
                  </label>
                  <input
                    type="text"
                    name="governmentID"
                    id="governmentID"
                    value={userData?.userGovernmentID || ""}
                    className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
              <div className="lg:w-1/4 w-[80%]">
                <div className="flex flex-col">
                  <label className="font-semibold text-lg " htmlFor="userRole">
                    Typed:
                  </label>
                  <input
                    type="text"
                    name="userRole"
                    id="userRole"
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
                  <label
                    className="font-semibold text-lg "
                    htmlFor="userFirstName"
                  >
                    First Name:
                  </label>
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
                  <label className="font-semibold text-lg " htmlFor="userEmail">
                    Email:
                  </label>
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
                  <label
                    className="font-semibold text-lg "
                    htmlFor="userLastName"
                  >
                    Last Name:
                  </label>
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
                  <div className="flex">
                    <label
                      className="font-semibold text-lg "
                      htmlFor="userNewContactNumber"
                    >
                      Contact:
                    </label>
                    <a
                      id="userNewContactNumber"
                      href=""
                      className="ml-14 text-sm mt-1 font-sans font-medium text-red-600 hover:opacity-90"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalUpdateContact(true);
                        setModalMode("password");
                      }}
                    >
                      *Update Contact Number
                    </a>
                    <UpdateContactNumModal
                      onOpen={modalUpdateContact}
                      onCancel={handleModalUpdateContact}
                      modalMode={modalMode}
                      handlePasswordCheck={handlePasswordCheck}
                      userPasswordChecker={userPasswordChecker}
                      setUserPasswordChecker={setUserPasswordChecker}
                      userNewContactNumber={userNewContactNumber}
                      setUserNewContactNumber={setUserNewContactNumber}
                      handleContactNumberUpdate={handleContactNumberUpdate}
                      isSavingChanges={isSavingChanges}
                    />
                  </div>
                  <input
                    type="text"
                    name="userNewContactNumber"
                    id="userNewContactNumber"
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
                    <label
                      className="font-semibold text-lg "
                      htmlFor="userGovernmentID"
                    >
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
                    <label className="font-semibold text-lg " htmlFor="role">
                      Typed:
                    </label>
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
                    <label
                      className="font-semibold text-lg "
                      htmlFor="EditedUserFirstName"
                    >
                      First Name:
                    </label>
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
                    <label
                      className="font-semibold text-lg "
                      htmlFor="EditedUserEmail"
                    >
                      Email:
                    </label>
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
                    <label
                      className="font-semibold text-lg "
                      htmlFor="EditedUserLastName"
                    >
                      Last Name:
                    </label>
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
                    <label
                      className="font-semibold text-lg "
                      htmlFor="userCurrentPassword"
                    >
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
                    <label
                      className="font-semibold text-lg "
                      htmlFor="userContactNumber"
                    >
                      Contact:
                    </label>
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
                    <label
                      className="font-semibold text-lg "
                      htmlFor="userNewPassword"
                    >
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
              <Button
                loading={isSavingChanges}
                type="primary"
                htmlType="submit"
                className="bg-main pt-5 w-40 rounded-lg h-14  pb-6 px-8 text-lg font-semibold mt-4 flex items-center justify-center"
              >
                {isSavingChanges ? "Saving Changes" : "Save Changes"}
              </Button>
            </form>
          </Modal>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Account;
