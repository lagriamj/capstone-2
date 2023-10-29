import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button, Modal, Form, Input, Row, Col, Select, message } from "antd";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import UpdateSignature from "../../components/UpdateSignature";
import HeadSidebar from "../../components/HeadSidebar";
import HeadDrawer from "../../components/HeadDrawer";

const HeadAccount = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isLargeScreen = windowWidth >= 1024;
  const [currentPassword, setCurrentPassword] = useState("");
  const { userID } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSavingChanges, setIsSavingChange] = useState(false);
  const [userPasswordChecker, setUserPasswordChecker] = useState("");
  const { fullName } = useAuth();
  const [userSignature, setUserSignature] = useState(null);
  const { Option } = Select;
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/account?userID=${userID}`
      );

      console.log("API Response:", response.data.results);

      const user = response.data.results[0];
      setUserData(user);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userSignature]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePasswordChange = async () => {
    setIsSavingChange(true);
    const newFormData = await form.validateFields();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/change-password`,
        newFormData
      );

      const data = response.data;
      console.log(data);

      message.success("Details updated successfully");
      setIsModalVisible(false);
      setCurrentPassword("");
      fetchData();
      setIsSavingChange(false);
    } catch (err) {
      setIsSavingChange(false);
      console.error("Update failed:", err);
      console.log(err);
      message.error(err.response.data.message);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      userGovernmentID: userData?.userGovernmentID,
      role: userData?.role,
      userFirstName: userData?.userFirstName,
      userLastName: userData?.userLastName,
      userEmail: userData?.userEmail,
      userContactNumber: userData?.userContactNumber,
      office: userData?.office,
      division: userData?.division,
    });
  }, [userData]);

  const [modalMode, setModalMode] = useState("password");
  const [modalUpdateSignature, setModalUpdateSignature] = useState(false);

  const handleModalUpdateSignature = () => {
    setModalUpdateSignature(!modalUpdateSignature);
  };

  const handlePasswordCheck = async () => {
    setIsSavingChange(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/check-password`,
        {
          password: userPasswordChecker,
          userID: userID,
        }
      );
      setCurrentPassword("");
      if (response.status === 200) {
        // Password is correct, update the UI mode
        setModalMode("contactNumber");
        setUserPasswordChecker("");
        setIsSavingChange(false);
      } else {
        // Handle incorrect password
        setIsSavingChange(false);
        message.error("Password is incorrect");
        setUserPasswordChecker("");
      }
    } catch (error) {
      // Handle API request error
      setIsSavingChange(false);
      setCurrentPassword("");
      setUserPasswordChecker("");
      message.error("Password is incorrect");
    }
  };

  const [officeOptions, setOfficeOptions] = useState([]);

  const customFilterOption = (inputValue, option) =>
    option.value?.toLowerCase().includes(inputValue.toLowerCase());

  useEffect(() => {
    fetchOfficeList();
  }, []);

  const fetchOfficeList = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/office-list`
      );
      console.log(result.data.results);
      setOfficeOptions(result.data.results);
      console.log(officeOptions);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  useEffect(() => {
    fetchSignature();
  }, []);

  const fetchSignature = async () => {
    try {
      const timestamp = Date.now();
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/user-signatureInAccount/?userID=${userID}&timestamp=${timestamp}`,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "image/png/jpg/jpeg" });
      const dataUrl = URL.createObjectURL(blob);
      console.log("Fetched Signature Data:", dataUrl);
      setUserSignature(dataUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Account</title>
      </Helmet>
      <div
        className={`className="flex  flex-col gotoLarge:px-6 large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <HeadSidebar /> : <HeadDrawer />}
        <div className="flex flex-col items-center justify-center flex-grow  lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%]  large:h-[90vh]  h-auto lg:ml-auto lg:mx-4 mt-20 lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <h1 className="  lg:text-2xl mediumLg:text-4xl large:text-5xl text-3xl flex mr-auto  mt-10 mb-6 font-medium ">
              Account
            </h1>
            <h3 className="lg:text-lg mediumLg:text-xl large:text-2xl text-base">
              Review and update your account details.
            </h3>

            <p className=" w-full mt-5">
              Please make sure these details are up to date as they&apos;ll be
              used for your requests and communication with the admins
            </p>
            <div className="w-full h-auto   flex flex-col mt-5 rounded-md shadow-lg  text-white">
              <div className="bg-[#334D66] rounded-t-md h-[15vh] flex ">
                <div className="h-[15vh] lg:w-[10%] w-[30%] flex large:px-10 items-start large:pt-10 lg:pt-4 pt-6 justify-center ">
                  <FontAwesomeIcon
                    icon={faUserPen}
                    className="lg:h-14 lg:w-14 w-12 h-12 px-4"
                  />
                </div>
                <div className="large:pt-10 lg:pt-4 py-4  ">
                  <h1 className="large:text-3xl mediumLg:text-xl lg:text-lg lg:mb-0 large:mb-2 text-2xl">
                    {fullName}
                  </h1>
                  <p className=" w-full font-light text-sm">
                    Please make sure these details are up to date as
                    they&apos;ll be used for your requests and communication
                    with the admins
                  </p>
                </div>
              </div>
              <form
                action=""
                className="shadow-lg border-2 border-gray-200"
                onSubmit={handlePasswordChange}
              >
                <div className=" text-black grid lg:grid-cols-2 grid-cols-1 gap-y-4 p-10">
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <label htmlFor="userFirstName1">First Name:</label>
                    <input
                      type="text"
                      name="userFirstName1"
                      id="userFirstName1"
                      value={userData?.userFirstName || ""}
                      className="h-10 lg:w-[80%] w-full border-2 border-gray-200 rounded-md shadow-md px-3 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <label htmlFor="userLastName1">Last Name:</label>
                    <input
                      type="text"
                      name="userLastName1"
                      id="userLastName1"
                      value={userData?.userLastName || ""}
                      className="h-10 lg:w-[80%] w-full border-2 border-gray-200 rounded-md shadow-md px-3 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <label htmlFor="governmentID">Government ID:</label>
                    <input
                      type="text"
                      name="governmentID"
                      id="governmentID"
                      value={userData?.userGovernmentID || ""}
                      className="h-10 lg:w-[80%] w-full border-2 border-gray-200 rounded-md shadow-md px-3 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <label htmlFor="governmentID">Type:</label>
                    <input
                      type="text"
                      name="userRole"
                      id="userRole"
                      value={userData?.role || ""}
                      className="h-10 lg:w-[80%] w-full border-2 border-gray-200 rounded-md shadow-md px-3 outline-none "
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <label htmlFor="office1">Office:</label>
                    <input
                      type="text"
                      name="office1"
                      id="office1"
                      value={userData?.office || ""}
                      className="h-10 lg:w-[80%] w-full border-2 border-gray-200 rounded-md shadow-md px-3 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <label htmlFor="division1">Division:</label>
                    <input
                      type="text"
                      name="division1"
                      id="division1"
                      value={userData?.division || ""}
                      className="h-10 lg:w-[80%] w-full border-2 border-gray-200 rounded-md shadow-md px-3 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <label htmlFor="userEmail1">Email:</label>
                    <input
                      type="text"
                      name="userEmail"
                      id="userEmail1"
                      value={userData?.userEmail || ""}
                      className="h-10 lg:w-[80%] w-full border-2 border-gray-200 rounded-md shadow-md px-3 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <div className="flex">
                      <label htmlFor="userNewContactNumber1">Contact:</label>
                    </div>
                    <input
                      type="text"
                      name="userNewContactNumber"
                      id="userNewContactNumber"
                      value={userData?.userContactNumber || ""}
                      className="h-10 lg:w-[80%] w-full border-2 border-gray-200 rounded-md shadow-md px-3 outline-none"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col lg:pl-10 md:pl-10 pl-0">
                    <div className="flex">
                      <label htmlFor="signature">Signature:</label>
                      <a
                        id="signatureUp"
                        href=""
                        className="ml-14 text-sm mt-1 font-sans font-medium text-red-600 hover:opacity-90"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalUpdateSignature(true);
                          setModalMode("password");
                        }}
                      >
                        *Update Signature
                      </a>
                      <UpdateSignature
                        onOpen={modalUpdateSignature}
                        onCancel={handleModalUpdateSignature}
                        modalMode={modalMode}
                        handlePasswordCheck={handlePasswordCheck}
                        userPasswordChecker={userPasswordChecker}
                        setUserPasswordChecker={setUserPasswordChecker}
                        refreshSignature={fetchSignature}
                      />
                    </div>
                    {userSignature && (
                      <img
                        src={userSignature}
                        className="w-[40%] h-14"
                        alt="User Signature"
                      />
                    )}
                  </div>
                </div>

                <div className="flex pl-10 pr-16 py-6 items-center gap-x-4 text-black text-sm justify-end">
                  <p>Your data will be handled with care</p>
                  <button
                    type="button"
                    onClick={showModal}
                    className="bg-main text-white rounded-lg px-4 py-3 text-base"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>

            <Modal
              title="Update Account Details"
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
              width={isLargeScreen ? "70%" : "90%"}
            >
              <Form
                form={form}
                onFinish={handlePasswordChange}
                layout="vertical"
                initialValues={{
                  userID: userID,
                  userGovernmentID: userData?.userGovernmentID,
                  role: userData?.role,
                  userFirstName: userData?.userFirstName,
                  userLastName: userData?.userLastName,
                  userEmail: userData?.userEmail,
                  userContactNumber: userData?.userContactNumber,
                  office: userData?.office,
                  division: userData?.division,
                }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          Government ID
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: "This field is required",
                        },
                      ]}
                      name="userGovernmentID"
                    >
                      <Input className="h-[40px]" disabled />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">Role:</label>
                      }
                      rules={[
                        {
                          required: true,
                          message: "This field is required",
                        },
                      ]}
                      name="role"
                    >
                      <Select size="large" disabled>
                        <Option value="user">User</Option>
                        <Option value="admin">Admin</Option>
                        <Option value="head">Head</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          First Name:
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: "This field is required",
                        },
                      ]}
                      name="userFirstName"
                    >
                      <Input className="h-[40px]" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          Last Name:
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: "This field is required",
                        },
                      ]}
                      name="userLastName"
                    >
                      <Input className="h-[40px]" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          Email:
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: "This field is required",
                        },
                      ]}
                      name="userEmail"
                    >
                      <Input className="h-[40px]" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          Contact Number:
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: "This field is required",
                        },
                      ]}
                      name="userContactNumber"
                    >
                      <Input className="h-[40px]" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          Office:
                        </label>
                      }
                      rules={[
                        {
                          required: true,
                          message: "This field is required",
                        },
                      ]}
                      name="office"
                    >
                      <Select
                        size="large"
                        showSearch
                        filterOption={customFilterOption}
                      >
                        {officeOptions.map((option) => (
                          <Option key={option.id} value={option.office}>
                            {option.office}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          Division:
                        </label>
                      }
                      name="division"
                    >
                      <Input className="h-[40px]" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          Current Password:
                        </label>
                      }
                      name="currentPassword"
                    >
                      <Input
                        type="password"
                        className="h-[40px]"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6}>
                    <Form.Item
                      label={
                        <label className="block text-sm font-bold">
                          New Password:
                        </label>
                      }
                      name="newPassword"
                    >
                      <Input
                        type="password"
                        disabled={currentPassword === ""}
                        className="h-[40px]"
                      />
                    </Form.Item>
                  </Col>

                  <Col hidden>
                    <Form.Item name="userID">
                      <Input value={userID} />
                    </Form.Item>
                  </Col>
                </Row>
                <Button
                  loading={isSavingChanges}
                  type="primary"
                  htmlType="submit"
                  className="bg-main pt-5 w-40 rounded-lg h-14  pb-6 px-8 text-lg font-semibold mt-4 flex items-center justify-center"
                >
                  {isSavingChanges ? "Saving Changes" : "Save Changes"}
                </Button>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default HeadAccount;
