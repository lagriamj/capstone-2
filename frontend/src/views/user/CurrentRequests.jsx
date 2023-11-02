import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import CurrentRequestModal from "../../components/CurrentRequestModal";
import { Popconfirm } from "antd";
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { message, notification, Input, Table, Tag } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RateModal from "../../components/RateModal";
import ReasonModal from "../../components/ReasonModal";
import { useActiveTab } from "../../ActiveTabContext";

const CurrentRequests = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { userID } = useAuth();
  console.log("userID:", userID);
  const { userRole } = useAuth();
  const [selectedItemId, setSelectedItemId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  const [popconfirmVisible, setPopconfirmVisible] = useState([]);
  const location = useLocation();
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const { fullName } = useAuth();
  const { setActive } = useActiveTab();

  const [selectedID, setSelectedID] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  const handleOpenReasonModalClick = (id) => {
    setSelectedReason(id);
  };

  const handleCloseReasonModalClick = () => {
    setSelectedReason(null);
  };

  const handleReasonModalSubmit = () => {
    setIsReasonModalOpen(false);
    fetchData();
    message.success("Request Cancelled Successfully");
  };

  const handleStarIconClick = (id, user_id, office) => {
    setSelectedID(id);
    setSelectedUserId(user_id);
    setSelectedOffice(office);
    setUpdateModalVisible(true);
  };

  useEffect(() => {
    const locationState = location.state;

    if (locationState && locationState.successMessage) {
      setDisplaySuccessMessage(true);
      navigate("/current-requests");
      setActive("current-requests");
    }
  }, []);

  useEffect(() => {
    if (displaySuccessMessage) {
      const successMessage = message.success("Requested Successfully");

      setTimeout(() => {
        successMessage();
      }, 5000);
    }
  }, [displaySuccessMessage]);

  const handleOpenModalClick = (id) => {
    setSelectedItemId(id);
  };

  const handleCloseModalClick = () => {
    setSelectedItemId(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const defaultStartDate = new Date(endDate);
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    const defaultEndDate = new Date();
    const defaultStartDateString = defaultStartDate.toISOString().split("T")[0];
    const defaultEndDateString = defaultEndDate.toISOString().split("T")[0];

    setStartDate(defaultStartDateString);
    setEndDate(defaultEndDateString);
  }, []);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  let notificationDisplayed = false;
  let loopCount = 0; // Initialize the loop count

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/request-list/${userID}/${startDate}/${endDate}`;
      const result = await axios.get(url);
      setData(result.data.results);
      setLoading(false);

      if (loopCount === 1 && !notificationDisplayed) {
        const uniqueRequests = new Set();
        result.data.results.forEach((item) => {
          if (
            item.status !== "Cancelled" &&
            item.status !== "Closed" &&
            item.status !== "Purge"
          ) {
            uniqueRequests.add({
              requestCode: item.request_code,
              status: item.status,
              arta: item.arta,
              reasonDelay: item.reasonDelay,
              artaStatus: item.artaStatus,
            });
          }
        });

        uniqueRequests.forEach((request) => {
          showStatusNotification(
            request.requestCode,
            request.status,
            request.arta,
            request.artaStatus,
            request.reasonDelay
          );
        });
        notificationDisplayed = true;
      }
      loopCount++;
    } catch (err) {
      console.log("Something went wrong:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPopconfirmVisible(new Array(data.length).fill(false));
  }, [data]);

  const showPopconfirmInRate = (id) => {
    setOpen(true);
    const popconfirmVisibleCopy = [...popconfirmVisible];
    popconfirmVisibleCopy[id] = true;
    setPopconfirmVisible(popconfirmVisibleCopy);
    setTimeout(() => {
      setOpen(false);
      setPopconfirmVisible(false);
    }, 5000);
  };

  const handleClosed = (item) => {
    closedRequest(item);
    handleCancel(item);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  const closedRequest = async (id) => {
    console.log(id);
    await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/closedNorate/${id}`
    );
    const newUserData = data.filter((item) => item.id !== id);
    setData(newUserData);
  };

  const handleCancel = (index) => {
    setOpen(false);
    const popconfirmVisibleCopy = [...popconfirmVisible];
    popconfirmVisibleCopy[index] = false;
    setPopconfirmVisible(popconfirmVisibleCopy);
  };

  const isLargeScreen = windowWidth >= 1024;

  const uniqueStatusesRef = useRef(new Set());

  useEffect(() => {
    // Clear the unique statuses ref when the component unmounts
    return () => {
      uniqueStatusesRef.current.clear();
    };
  }, []);

  const showStatusNotification = (
    requestCode,
    status,
    artaDays,
    artaStatus,
    reasonDelay
  ) => {
    let messageText = "";
    let descriptionText = "";
    let notificationStyle = {};

    switch (status) {
      case "Received":
        messageText = (
          <span className="text-white">{`${requestCode} Request is Received`}</span>
        );
        descriptionText = (
          <p className="text-white">
            It will be completed within {artaDays} days.
          </p>
        );
        notificationStyle = {
          backgroundColor: "#343467",
        };
        break;
      case "On Progress":
        messageText = (
          <span className="text-white">{`${requestCode} Request is On Progress`}</span>
        );
        descriptionText = (
          <div>
            <p className="text-white">Completion Duration: {artaDays} days</p>
            {artaStatus == "Delay" && (
              <p className="text-white">Processing Status: {artaStatus}</p>
            )}
            {reasonDelay !== "n/a" && (
              <p className="text-white">Cause of Delay: {reasonDelay}</p>
            )}
          </div>
        );
        notificationStyle = {
          backgroundColor: "#343467",
        };
        break;
      case "To Release":
        messageText = (
          <span className="text-white">{`${requestCode} Request is To Release`}</span>
        );
        descriptionText = (
          <p className="text-white">
            It will be completed within {artaDays} days.
          </p>
        );
        notificationStyle = {
          backgroundColor: "#343467",
        };
        break;
      case "To Rate":
        messageText = (
          <span className="text-white">{`${requestCode} Request is To Rate`}</span>
        );
        descriptionText = (
          <p className="text-white">
            It will be completed within {artaDays} days.
          </p>
        );
        notificationStyle = {
          backgroundColor: "#343467",
        };
        break;
      default:
        break;
    }

    if (messageText) {
      notification.success({
        message: messageText,
        description: descriptionText,
        duration: 5,
        style: notificationStyle,
      });
    }
  };

  const [windowWidth1366, setWindowWidth1366] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth1366(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isScreenWidth1366 = windowWidth1366 === 1366;

  const [natureRequests, setNatureRequests] = useState("");
  const [natureReqOption, setNatureReqOption] = useState([]);

  useEffect(() => {
    fetchNature();
  }, []);

  const fetchNature = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/nature-list`)
      .then((response) => {
        setNatureRequests(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (Array.isArray(natureRequests)) {
      const dynamicFilters = natureRequests.map((natureRequest) => ({
        text: natureRequest.natureRequest,
        value: natureRequest.natureRequest,
      }));
      setNatureReqOption(dynamicFilters);
    }
  }, [natureRequests]);

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  const filteredRequests = data.filter((request) => {
    const searchTextLower = searchText.toLowerCase();

    const shouldIncludeRow = Object.values(request).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTextLower);
      } else if (typeof value === "number") {
        return value.toString().toLowerCase().includes(searchTextLower);
      } else if (value instanceof Date) {
        // Handle Date objects
        const formattedDate = value.toLocaleString();
        return formattedDate.toLowerCase().includes(searchTextLower);
      }
      return false;
    });

    return shouldIncludeRow;
  });

  const handleSearchBar = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const currentRequestsCol = [
    {
      title: "#",
      dataIndex: "#",
      key: "#",
      render: (text, record, index) => {
        const currentPage = pagination.current || 1;
        const calculatedIndex =
          (currentPage - 1) * pagination.pageSize + index + 1;
        return <span key={index}>{calculatedIndex}</span>;
      },
    },
    {
      title: "Request ID",
      dataIndex: "request_code",
      key: "request_code",
    },
    {
      title: "Date Requested",
      dataIndex: "dateRequested",
      key: "dateRequested",
      defaultSortOrder: "desc",
      sorter: (a, b) => {
        const dateA = new Date(a.dateRequested);
        const dateB = new Date(b.dateRequested);
        return dateA - dateB;
      },
    },
    {
      title: "Nature of Request",
      dataIndex: "natureOfRequest",
      key: "natureOfRequest",
      filters: natureReqOption,
      filterSearch: true,
      onFilter: (value, record) => record.natureOfRequest?.includes(value),
    },
    {
      title: "Mode",
      dataIndex: "modeOfRequest",
      key: "modeOfRequest",
      filters: [
        {
          text: "Online",
          value: "Online",
        },
        {
          text: "Walk-In",
          value: "Walk-In",
        },
      ],
      onFilter: (value, record) => record.modeOfRequest?.includes(value),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      key: "dateUpdated",
      sorter: (a, b) => {
        const dateA = new Date(a.dateUpdated);
        const dateB = new Date(b.dateUpdated);
        return dateA - dateB;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, index) => (
        <Tag
          key={index}
          className={`lg:text-base text-sm font-sans w-full text-center py-1 rounded-lg
            ${
              text === "Pending"
                ? "bg-red-500 text-white"
                : text === "Received"
                ? "bg-orange-500 text-white"
                : text === "On Progress"
                ? "bg-yellow-500 text-white"
                : text === "To Release"
                ? "bg-green-500 text-white"
                : text === "To Rate"
                ? "bg-blue-500 text-white"
                : text === "Closed"
                ? "bg-gray-800 text-white"
                : text === "Cancelled"
                ? "bg-red-700 text-white"
                : "bg-main text-white"
            }`}
        >
          {text}
        </Tag>
      ),
      filters: [
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Received",
          value: "Received",
        },
        {
          text: "On Progress",
          value: "On Progress",
        },
        {
          text: "To Release",
          value: "To Release",
        },
        {
          text: "To Rate",
          value: "To Rate",
        },
        {
          text: "Closed",
          value: "Closed",
        },
        {
          text: "Cancelled",
          value: "Cancelled",
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.status?.includes(value),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (index, record) => (
        <div className="flex gap-1 " key={index}>
          {record.status === "To Rate" ? (
            <button
              className={`text-white ${
                isScreenWidth1366 ? "text-xs" : " text-base"
              } font-medium bg-gray-800 py-2 px-4 rounded-lg`}
              onClick={() =>
                handleStarIconClick(
                  record.request_id,
                  record.user_id,
                  record.reqOffice
                )
              }
            >
              Rate
            </button>
          ) : (
            <button
              onClick={() => handleOpenModalClick(record.id)}
              className={`text-white ${
                isScreenWidth1366 ? "text-xs" : " text-base"
              } font-medium bg-blue-600 py-2 px-4 rounded-lg`}
            >
              View
            </button>
          )}

          {record.status === "Received" ||
          record.status === "On Progress" ||
          record.status === "To Release" ? (
            <button
              className={`text-white ${
                isScreenWidth1366 ? "text-xs" : " text-base"
              } bg-gray-400 cursor-not-allowed py-2 px-4 rounded-lg`}
              disabled
            >
              Cancel
            </button>
          ) : record.status === "To Rate" ? (
            <Popconfirm
              placement="left"
              title="Confirmation"
              description="Please confirm this action. This action cannot be undone."
              open={popconfirmVisible[record.id]}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleClosed(record.request_id)}
              okButtonProps={{
                color: "red",
                className: "text-black border-1 border-gray-300",
                size: "large",
              }}
              cancelButtonProps={{
                size: "large",
              }}
              onCancel={() => handleCancel(record.id)}
              okText="Yes"
            >
              <button
                onClick={() => showPopconfirmInRate(record.id)}
                className={`text-white ${
                  isScreenWidth1366 ? "text-xs" : " text-base"
                } font-medium bg-red-600 py-2 px-5 rounded-lg`}
              >
                Close
              </button>
            </Popconfirm>
          ) : (
            <button
              onClick={() => handleOpenReasonModalClick(record.id)}
              className={`text-white ${
                isScreenWidth1366 ? "text-xs" : " text-base"
              } font-medium bg-red-600 py-2 px-4 rounded-lg`}
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Current Requests</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col gotoLarge:px-6 large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto lg:ml-auto lg:mx-4 mt-20 lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <div className="flex lg:flex-col flex-row lg:gap-0 gap-2">
                <h1 className="flex text-black items-center lg:text-2xl font-semibold ">
                  Current Requests
                </h1>
                <span className="text-black mr-auto">
                  Total Requests: {data.length}
                </span>
              </div>

              <div className="relative flex items-center justify-center lg:mr-auto lg:ml-4 ">
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => handleSearchBar(e.target.value)}
                  className="my-4 h-12"
                />
              </div>
              <div className="flex items-center justify-center gap-4 mr-4 mb-4 lg:mb-0">
                <div className="flex lg:flex-row flex-col items-center text-black gap-2">
                  <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
                    <span className="font-semibold">From:</span>
                    <input
                      type="date"
                      className="p-2 w-36 outline-none border-none bg-transparent"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
                    <span className="font-semibold">To:</span>
                    <input
                      type="date"
                      className="p-2 w-36 outline-none border-none bg-transparent"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`overflow-auto h-auto shadow-xl  pb-5  rounded-lg w-full`}
            >
              <Table
                columns={currentRequestsCol}
                dataSource={filteredRequests}
                loading={{
                  indicator: <LoadingOutlined style={{ fontSize: 50 }} />,
                  spinning: loading,
                }}
                pagination={pagination}
                scroll={{ x: 1300 }}
                onChange={(newPagination) => setPagination(newPagination)}
                rowClassName={"p-0"}
                rowKey={(record) => record.id}
              />

              {selectedItemId && (
                <CurrentRequestModal
                  display={true}
                  itemData={data.find((item) => item.id === selectedItemId)}
                  onClose={handleCloseModalClick} // Pass the callback here
                  isLargeScreen={isLargeScreen}
                  isScreenWidth1366={isScreenWidth1366}
                />
              )}
              {selectedReason && (
                <ReasonModal
                  display={true}
                  itemData={data.find((item) => item.id === selectedReason)}
                  onClose={handleCloseReasonModalClick} // Pass the callback here
                  isLargeScreen={isLargeScreen}
                  role={userRole}
                  name={fullName}
                  onSubmit={handleReasonModalSubmit}
                />
              )}

              {isUpdateModalVisible && (
                <RateModal
                  isOpen={isUpdateModalVisible}
                  onClose={() => setUpdateModalVisible(false)}
                  id={selectedID} // Pass the selectedItemId as a prop
                  user_id={selectedUserId} // Pass the selectedUserId as a prop
                  office={selectedOffice}
                  role={userRole}
                  isScreenWidth1366={isScreenWidth1366}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};
export default CurrentRequests;
