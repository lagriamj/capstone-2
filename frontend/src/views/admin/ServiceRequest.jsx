import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteModal from "../../components/NoteModal";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useActiveTab } from "../../ActiveTabContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  notification,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import AdminDrawer from "../../components/AdminDrawer";
import AdminSidebar from "../../components/AdminSidebar";

const ServiceRequest = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isLargeScreen = windowWidth >= 1024;
  const { setActive } = useActiveTab();
  const [loading, setLoading] = useState(false);
  const [office, setOffice] = useState("");
  const [division, setDivision] = useState("");
  const [author, setAuthor] = useState("");
  const { userID, fullName } = useAuth();
  console.log("userID:", userID);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      dateProcured: date.$y,
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
            The service request can only be processed if the date procured is
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

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/getOfficeAndDivision/${userID}`)
      .then((response) => {
        setOffice(response.data.office);
        setDivision(response.data.division);
      })
      .catch((error) => {
        console.log(error);
      });

    form.setFieldsValue({
      reqOffice: office,
      division: division,
      dateRequested: daytime,
      authorizedBy: author,
      dateProcured: dateP,
    });
  }, [userID, office, division, daytime, author, dateP]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/office-list")
      .then((response) => {
        const officeList = response.data.results;
        const matchingNature = officeList.find(
          (item) => item.office === office
        );

        if (matchingNature) {
          setAuthor(matchingNature.head);
        } else {
          console.log("Matching office not found.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [office]);

  const handleNewActiveTab = () => {
    setActive("service-task");
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
  }, []);

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
        <title>Request</title>
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
                user_id: userID,
                fullName: fullName,
                reqOffice: office,
                division: division,
                natureOfRequest: "",
                modeOfRequest: "Online",
                unit: "",
                propertyNo: "",
                serialNo: "",
                authorizedBy: author,
                dateProcured: "N/A",
                specialIns: "",
                status: "Pending",
                assignedTo: "None",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">Office</label>
                    }
                    name={"reqOffice"}
                  >
                    <Input readOnly value={office} className="h-[40px]" />
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
                    <Input readOnly value={division} className="h-[40px]" />
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
                      value={natureValue} // Set the value of the Select component
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
                    Date Procured
                  </label>
                  <DatePicker
                    picker="year"
                    onChange={handleDatePickerChange}
                    onOpenChange={handleWarrantyNotif}
                    className="h-[40px] w-full flex items-center justify-center"
                  />
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
                <Col xs={24} lg={6}>
                  <Form.Item
                    label={
                      <label className="block text-sm font-bold">
                        Authorized By
                      </label>
                    }
                    name={"authorizedBy"}
                  >
                    <Input readOnly value={author} className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={"user_id"}>
                    <Input hidden />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={"fullName"}>
                    <Input hidden />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={"modeOfRequest"}>
                    <Input hidden />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={"dateProcured"}>
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

export default ServiceRequest;
