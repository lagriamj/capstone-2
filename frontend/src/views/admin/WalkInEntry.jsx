import { Helmet, HelmetProvider } from "react-helmet-async";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { useEffect, useState } from "react";
import NoteModal from "../../components/NoteModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Col,
  DatePicker,
  Input,
  Select,
  notification,
  Form,
  Row,
} from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useActiveTab } from "../../ActiveTabContext";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const WalkInEntry = () => {
  const { setActive } = useActiveTab();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
  const isLargeScreen = windowWidth >= 1024;

  const customFilterOption = (inputValue, option) =>
    option.value?.toLowerCase().includes(inputValue.toLowerCase());

  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { Option } = Select;

  const [natureValue, setNatureValue] = useState("");
  const [unitValue, setUnitValue] = useState("");

  const handleChangeNature = (value) => {
    setNatureValue(value);
  };

  const handleChangeUnit = (value) => {
    setUnitValue(value);
  };

  const [dateP, setDateP] = useState("");

  const handleDatePickerChange = (date) => {
    form.setFieldsValue({
      yearProcured: date.$y,
    });
    console.log(date.$y);
    setDateP(date.$y);
  };

  const handleWarrantyNotif = (status) => {
    if (status) {
      notification.warning({
        message: (
          <span className="text-white font-bold">
            Date must be under warranty
          </span>
        ),
        description: (
          <span className="text-white">
            The service request can only be processed if the year procured is
            under warranty.
          </span>
        ),
        style: {
          backgroundColor: "rgba(239, 68, 68, 1)",
        },
      });
    }
  };

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const daytime = new Date().toLocaleString(undefined, options);

  const handleNewActiveTab = () => {
    setActive("current-requests");
  };

  const checkCutOffTime = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/getCutOffTime"
      );
      const cutOffTime = new Date(response.data.cutOffTime);
      const currentDate = new Date();

      if (currentDate > cutOffTime) {
        const formattedCutOffDate = cutOffTime.toLocaleString();
        notification.error({
          message: "Cut-off time exceeded",
          description: `You cannot request service after the cut-off time (${formattedCutOffDate}).`,
          icon: <ExclamationCircleOutlined />, // Add the notification icon
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error fetching cut-off time:", error);
      return false;
    }
  };

  const onSubmitChange = async () => {
    const values = await form.validateFields();

    setLoading(true);

    try {
      const isCutOffTimeValid = await checkCutOffTime();

      if (isCutOffTimeValid) {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/add-request",
          values
        );
        const data = response.data;
        console.log(data);

        navigate("/service-task", {
          state: {
            successMessage: "Requested successfully.",
          },
        });
        handleNewActiveTab();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchNature();
    form.setFieldsValue({
      user_id: 1,
      dateRequested: daytime,
      modeOfRequest: "Walk-In",
      status: "Pending",
      assignedTo: "None",
      yearProcured: dateP || "N/A",
      approved: "yes-signature",
    });
  }, [dateP]);

  const fetchNature = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/api/nature-list");
      setData(result.data.results);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  const [units, setUnit] = useState([]);

  useEffect(() => {
    fetchUnit();
  }, []);

  const fetchUnit = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/api/category-list");
      setUnit(result.data.results);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  useEffect(() => {
    const resetCutOffTime = async () => {
      try {
        await axios.get("http://127.0.0.1:8000/api/reset-cut-off-time");
      } catch (error) {
        console.error("Error resetting cut-off time:", error);
      }
    };
    resetCutOffTime();
  }, []);
  return (
    <HelmetProvider>
      <Helmet>
        <title>Walk-In Entry</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col gotoLarge:px-6 large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={` w-[90%] lg:w-[80%] large:w-[85%] large:mt-20 shadow-xl  h-auto lg:ml-auto lg:mx-4 mt-20 lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="bg-secondary py-6 pl-4  text-white flex items-center justify-center">
              <h1 className=" mediumLg:text-xl text-lg text-left   font-medium italic ">
                CITC TECHNICAL SERVICE REQUEST SLIP
              </h1>
              <div className="font-normal mr-auto ml-6">
                <NoteModal display={true} />
              </div>
            </div>
            <Form
              form={form}
              onFinish={onSubmitChange}
              layout="vertical"
              className="relative p-6 text-lg"
              initialValues={{
                dateRequested: daytime,
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
                    name={"userGovernmentID"}
                  >
                    <Input className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">
                        Full Name
                      </label>
                    }
                    name={"fullName"}
                  >
                    <Input className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">Office</label>
                    }
                    name={"reqOffice"}
                  >
                    <Input className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">
                        Division
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
                      <label className="block text-sm font-bold">Date</label>
                    }
                    name="dateRequested"
                  >
                    <Input readOnly value={daytime} className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">Nature</label>
                    }
                    name="natureOfRequest"
                    rules={[
                      {
                        required: true,
                        message: "This field is required",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="h-[40px]"
                      filterOption={customFilterOption}
                      onChange={handleChangeNature}
                      value={natureValue}
                    >
                      {data.map((option, index) => (
                        <Option key={index} value={option.natureRequest}>
                          {option.natureOfRequest}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">Unit</label>
                    }
                    name="unit"
                    rules={[
                      {
                        required: true,
                        message: "This field is required",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      className="h-[40px]"
                      filterOption={customFilterOption}
                      onChange={handleChangeUnit}
                      value={unitValue} // Set the value of the Select component
                    >
                      {units.map((option, index) => (
                        <Option key={index} value={option.utilityCategory}>
                          {option.utilityCategory}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">
                        Property No.
                      </label>
                    }
                    name="propertyNo"
                  >
                    <Input className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">
                        Serial No.
                      </label>
                    }
                    rules={[
                      {
                        required: true,
                        message: "This field is required",
                      },
                    ]}
                    name="serialNo"
                  >
                    <Input className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  lg={6}
                  className="flex flex-col items-center justify-center pb-[30px] pt-[2px]"
                >
                  <label className="block text-sm font-bold mb-2 mr-auto text-black">
                    Year Procured
                  </label>
                  <DatePicker
                    picker="year"
                    onChange={handleDatePickerChange}
                    onOpenChange={handleWarrantyNotif}
                    className="h-[40px] w-full flex items-center justify-center"
                  />
                </Col>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">
                        Authorized By
                      </label>
                    }
                    name={"authorizedBy"}
                  >
                    <Input className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={24}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">
                        Special Instructions
                      </label>
                    }
                    rules={[
                      {
                        required: true,
                        message: "This field is required",
                      },
                    ]}
                    name="specialIns"
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item name={"user_id"}>
                    <Input hidden />
                  </Form.Item>
                </Col>

                <Col>
                  <Form.Item name={"modeOfRequest"}>
                    <Input hidden />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={"yearProcured"}>
                    <Input hidden />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={"status"}>
                    <Input hidden />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={"assignedTo"}>
                    <Input hidden />
                  </Form.Item>
                </Col>
              </Row>
              <div className="col-span-full flex lg:flex-row flex-col lg:gap-0 gap-4">
                <Button
                  loading={loading}
                  htmlType="submit"
                  className="bg-main h-14 text-lg font-sans font-semibold text-white hover:bg-opacity-90 hover:text-white flex gap-3 items-center rounded-lg ml-auto"
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: "#ffffff" }}
                  />
                  {loading ? "Requesting" : "Request Service"}
                </Button>
              </div>
              <p></p>
            </Form>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default WalkInEntry;
