import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import CurrentRequestModal from "../../components/CurrentRequestModal";
import { Popconfirm } from "antd";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { message, Skeleton, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RateModal from "../../components/RateModal";
import ReasonModal from "../../components/ReasonModal";

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

  const [selectedID, setSelectedID] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilters, setSelectedStatusFilters] =
    useState("no-status-selected");

  const [selectedSortOrder, setSelectedDateOrder] = useState("desc");
  const [isDateSortingDropdownOpen, setIsDateSortingDropdownOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const handleDateOrderChange = (order) => {
    setSelectedDateOrder(order);
    setIsDateSortingDropdownOpen(false);
  };

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 10);
    const defaultEndDate = new Date();
    const defaultStartDateString = defaultStartDate.toISOString().split("T")[0];
    const defaultEndDateString = defaultEndDate.toISOString().split("T")[0];

    setStartDate(defaultStartDateString);
    setEndDate(defaultEndDateString);
  }, []);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `http://127.0.0.1:8000/api/request-list/${userID}/${startDate}/${endDate}`;
      const result = await axios.get(url);
      setData(result.data.results);
      setLoading(false);

      const statusCounts = {
        Received: 0,
        "On Progress": 0,
        "To Release": 0,
      };

      result.data.results.forEach((item) => {
        if (item.status in statusCounts) {
          statusCounts[item.status]++;
        }
      });

      for (const status in statusCounts) {
        console.log(`Status: ${status}, Count: ${statusCounts[status]}`);
        if (statusCounts[status] > 0) {
          const requestIds = result.data.results
            .filter((item) => item.status === status)
            .map((item) => item.id); // Use request_id instead of id
          console.log(`${status} Request IDs: `, requestIds);
          showStatusNotification(status, statusCounts[status], requestIds); // Pass requestIds to the notification
        }
      }
    } catch (err) {
      console.log("Something went wrong:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (selectedStatusFilters.length === 0) {
    setSelectedStatusFilters(["no-status-selected"]);
  }

  console.log("ssss", selectedSortOrder);
  console.log("aa", selectedStatusFilters);

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
    await axios.put(`http://127.0.0.1:8000/api/closedNorate/${id}`);
    const newUserData = data.filter((item) => item.id !== id);
    setData(newUserData);
  };

  const handleCancel = (index) => {
    setOpen(false);
    const popconfirmVisibleCopy = [...popconfirmVisible];
    popconfirmVisibleCopy[index] = false;
    setPopconfirmVisible(popconfirmVisibleCopy);
  };

  const handleStatusCheckboxChange = (e) => {
    setIsStatusDropdownOpen(false);
    const selectedStatus = e.target.value;

    setSelectedStatusFilters((prevFilters) => {
      if (prevFilters.length === 1 && prevFilters[0] === selectedStatus) {
        return [];
      } else {
        return [selectedStatus];
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 10;

  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPage);

  useEffect(() => {
    if (selectedStatusFilters !== null) {
      setCurrentPage(1);
    }
  }, [selectedStatusFilters]);

  useEffect(() => {
    if (selectedSortOrder !== null) {
      setCurrentPage(1);
    }
  }, [selectedSortOrder]);

  useEffect(() => {
    if (searchQuery !== null) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const isLargeScreen = windowWidth >= 1024;

  const [pageInput, setPageInput] = useState("");

  const goToPage = () => {
    const pageNumber = parseInt(pageInput);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= npage) {
      setCurrentPage(pageNumber);
      setPageInput("");
    } else {
      message.error("Invalid page number. Please enter a valid page number.");
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputBlur = () => {
    goToPage();
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === "Enter") {
      goToPage();
    }
  };

  // Define a Set to keep track of unique statuses
  const uniqueStatusesRef = useRef(new Set());

  useEffect(() => {
    // Clear the unique statuses ref when the component unmounts
    return () => {
      uniqueStatusesRef.current.clear();
    };
  }, []);

  const showStatusNotification = (status, count, requestIds) => {
    let messageText = "";
    let descriptionText = "";
    let notificationStyle = {};

    switch (status) {
      case "Received":
        messageText = (
          <span className="text-white">{`E-${requestIds} Request is Received`}</span>
        );
        descriptionText = (
          <p className="text-white">
            Your {requestIds.join(", ")} request is being processed.
          </p>
        );
        notificationStyle = {
          backgroundColor: "#343467",
        };
        break;
      case "On Progress":
        messageText = (
          <span className="text-white">{`E-${requestIds} Request is On Progress`}</span>
        );
        descriptionText = (
          <p className="text-white">
            Your {requestIds.join(", ")} request is currently in progress.
          </p>
        );
        notificationStyle = {
          backgroundColor: "#343467",
        };
        break;
      case "To Release":
        messageText = (
          <span className="text-white">{`E-${requestIds} Request is To Release`}</span>
        );
        descriptionText = (
          <p className="text-white">
            Your {requestIds.join(", ")} request is ready for release.
          </p>
        );
        notificationStyle = {
          backgroundColor: "#343467",
        };
        break;
      case "To Rate":
        messageText = (
          <span className="text-white">{`E-${requestIds} Request is To Rate`}</span>
        );
        descriptionText = (
          <p className="text-white">
            Your {requestIds.join(", ")} request is ready for rating.
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
      if (!uniqueStatusesRef.current.has(status)) {
        notification.success({
          message: messageText,
          description: descriptionText,
          duration: 4,
          style: notificationStyle,
        });
        uniqueStatusesRef.current.add(status);
      }
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

  const totalRequests = data.length;

  const isScreenWidth1366 = windowWidth1366 === 1366;

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
              <h1 className="flex text-black items-center lg:text-2xl font-semibold ">
                Current Requests
              </h1>
              <div className="relative flex items-center lg:mr-auto lg:ml-4 ">
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`w-4 h-4 absolute ml-3 text-main`}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="border rounded-3xl bg-gray-100 text-black my-5 pl-12 pr-5 w-full focus:outline-none text-base h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="bg-secondary text-white ">
                    <th
                      className={`w-20 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      #
                    </th>
                    <th
                      className={`w-30 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Request ID
                    </th>
                    <th
                      className={`w-40  py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Date of Request
                    </th>
                    <th
                      className={`w-30  py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Mode
                    </th>
                    <th
                      className={`w-40 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Nature of Request
                    </th>
                    <th
                      className={`w-48  py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Assigned To
                    </th>
                    <th
                      className={`w-48py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider relative text-left whitespace-nowrap`}
                    >
                      Date Updated
                      <button
                        onClick={() =>
                          setIsDateSortingDropdownOpen(
                            !isDateSortingDropdownOpen
                          )
                        }
                        className="text-main focus:outline-none ml-2"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faFilter}
                          className={`large:h-4 large:w-4 w-3 h-3 text-white`}
                        />
                      </button>
                      {isDateSortingDropdownOpen && (
                        <div className="absolute top-8 right-0 flex flex-col text-black bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
                          <button
                            onClick={() => handleDateOrderChange("asc")}
                            className={`text-black font-medium py-2 px-4 rounded-lg ${
                              selectedSortOrder === "asc"
                                ? "bg-main text-white"
                                : ""
                            }`}
                          >
                            Ascending
                          </button>
                          <button
                            onClick={() => handleDateOrderChange("desc")}
                            className={`text-black font-medium py-2 px-4 rounded-lg ${
                              selectedSortOrder === "desc"
                                ? "bg-main text-white"
                                : ""
                            }`}
                          >
                            Descending
                          </button>
                        </div>
                      )}
                    </th>
                    <th
                      className={`w-36  pl-5py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Status
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setIsStatusDropdownOpen(!isStatusDropdownOpen)
                          }
                          className="text-main focus:outline-none ml-2"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faFilter}
                            className={`large:h-4 large:w-4 w-3 h-3 text-white`}
                          />
                        </button>
                        {isStatusDropdownOpen && (
                          <div className="absolute right-0 bg-white border text-black border-gray-200 py-2 mt-2 shadow-lg rounded-lg text-start">
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="Pending"
                                checked={selectedStatusFilters.includes(
                                  "Pending"
                                )}
                                onChange={handleStatusCheckboxChange}
                                className="mr-2"
                              />
                              Pending
                            </label>
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="Received"
                                checked={selectedStatusFilters.includes(
                                  "Received"
                                )}
                                onChange={handleStatusCheckboxChange}
                                className="mr-2"
                              />
                              Received
                            </label>
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="On Progress"
                                checked={selectedStatusFilters.includes(
                                  "On Progress"
                                )}
                                onChange={handleStatusCheckboxChange}
                                className="mr-2"
                              />
                              On Progress
                            </label>
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="toRelease"
                                checked={selectedStatusFilters.includes(
                                  "toRelease"
                                )}
                                onChange={handleStatusCheckboxChange}
                                className="mr-2"
                              />
                              To Release
                            </label>
                          </div>
                        )}
                      </div>
                    </th>
                    <th
                      className={`w-30  py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider  whitespace-nowrap text-left`}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="">
                      <td colSpan="8">
                        <Skeleton active />
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr className="h-[60vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No Records Yet.
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr className="h-[50vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No records found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    records.map((item, index) => (
                      <tr
                        className="border-b-2 border-x-2  lg:text-sm text-base border-gray-200 h-auto overflow-auto"
                        key={item.id}
                      >
                        <td
                          className={`px-3 py-2 large:py-3 text-gray-700 whitespace-nowrap text-left`}
                        >
                          {firstIndex + index + 1}
                        </td>
                        <td
                          className={`pr-3 py-2 large:py-3 text-gray-700 whitespace-nowrap text-left`}
                        >
                          E-{item.id}
                        </td>
                        <td
                          className={`pr-3 py-2 large:py-3 text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.dateRequested}
                        </td>
                        <td
                          className={`py-2 large:py-3 text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.modeOfRequest}
                        </td>
                        <td
                          className={` pr-5 py-2 large:py-3 text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.natureOfRequest}
                        </td>
                        <td
                          className={`py-2 large:py-3 text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.assignedTo}
                        </td>
                        <td
                          className={`py-2 large:py-3 text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.dateUpdated}
                        </td>
                        <td
                          className={`px-5 py-2 large:py-3 whitespace-nowrap text-center`}
                        >
                          <p
                            className={`rounded-xl py-2 px-3 ${
                              item.status === "Pending"
                                ? "bg-red-500 text-white"
                                : item.status === "Received"
                                ? "bg-orange-500 text-white"
                                : item.status === "On Progress"
                                ? "bg-yellow-500 text-white"
                                : item.status === "To Release"
                                ? "bg-green-500 text-white"
                                : item.status === "To Rate"
                                ? "bg-blue-600 text-white"
                                : item.status === "Closed"
                                ? "bg-gray-800 text-white"
                                : item.status === "Cancelled"
                                ? "bg-red-700 text-white"
                                : "bg-main text-white"
                            }`}
                          >
                            {item.status}
                          </p>
                        </td>
                        <td
                          className={`px-2 py-2 large:py-3 text-gray-700 flex gap-1 `}
                        >
                          {item.status === "To Rate" ? (
                            <button
                              className={`text-white ${
                                isScreenWidth1366 ? "text-xs" : " text-base"
                              } font-medium bg-gray-800 py-2 px-4 rounded-lg`}
                              onClick={() =>
                                handleStarIconClick(
                                  item.id,
                                  item.user_id,
                                  item.reqOffice
                                )
                              }
                            >
                              Rate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenModalClick(item.id)}
                              className={`text-white ${
                                isScreenWidth1366 ? "text-xs" : " text-base"
                              } font-medium bg-blue-600 py-2 px-4 rounded-lg`}
                            >
                              View
                            </button>
                          )}

                          {item.status === "Received" ||
                          item.status === "On Progress" ||
                          item.status === "To Release" ? (
                            <button
                              className={`text-white ${
                                isScreenWidth1366 ? "text-xs" : " text-base"
                              } bg-gray-400 cursor-not-allowed py-2 px-4 rounded-lg`}
                              disabled
                            >
                              Cancel
                            </button>
                          ) : item.status === "To Rate" ? (
                            <Popconfirm
                              placement="left"
                              title="Confirmation"
                              description="Please confirm this action. This action cannot be undone."
                              open={popconfirmVisible[item.id]}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() => handleClosed(item.id)}
                              okButtonProps={{
                                color: "red",
                                className:
                                  "text-black border-1 border-gray-300",
                                size: "large",
                              }}
                              cancelButtonProps={{
                                size: "large",
                              }}
                              onCancel={() => handleCancel(item.id)}
                              okText="Yes"
                            >
                              <button
                                onClick={() => showPopconfirmInRate(item.id)}
                                className={`text-white ${
                                  isScreenWidth1366 ? "text-xs" : " text-base"
                                } font-medium bg-red-600 py-2 px-5 rounded-lg`}
                              >
                                Close
                              </button>
                            </Popconfirm>
                          ) : (
                            <button
                              onClick={() =>
                                handleOpenReasonModalClick(item.id)
                              }
                              className={`text-white ${
                                isScreenWidth1366 ? "text-xs" : " text-base"
                              } font-medium bg-red-600 py-2 px-4 rounded-lg`}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

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
                    onSubmit={handleReasonModalSubmit}
                  />
                )}
              </table>

              {isUpdateModalVisible && (
                <RateModal
                  isOpen={isUpdateModalVisible}
                  onClose={() => setUpdateModalVisible(false)}
                  id={selectedID} // Pass the selectedItemId as a prop
                  user_id={selectedUserId} // Pass the selectedUserId as a prop
                  office={selectedOffice}
                  isScreenWidth1366={isScreenWidth1366}
                />
              )}
            </div>
            <nav className={`  mt-2 px-4`}>
              <ul className="flex gap-2 items-center">
                <li className="flex-auto  mr-5 text-base font-bold">
                  Page {currentPage} of {npage} | Total: {totalRequests}
                </li>
                <li>
                  <a
                    href="#"
                    onClick={prePage}
                    className={`pagination-link bg-main flex items-center justify-center hover:bg-opacity-95 text-white font-bold py-3 px-4 rounded`}
                  >
                    <LeftOutlined
                      style={{
                        fontSize: isScreenWidth1366 ? ".8rem" : "",
                      }}
                    />
                  </a>
                </li>
                <li className="flex items-center">
                  <input
                    type="number"
                    placeholder="Page"
                    className={`border rounded-lg bg-gray-100  px-4 text-black w-24  text-center outline-none ${
                      isScreenWidth1366 ? "text-sm py-1" : "py-2"
                    }`}
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onBlur={handlePageInputBlur}
                    onKeyPress={handlePageInputKeyPress}
                  />
                </li>
                <li>
                  <a
                    href="#"
                    onClick={nextPage}
                    className={`pagination-link bg-main flex items-center justify-center hover:bg-opacity-95 text-white font-bold py-3 px-4 rounded`}
                  >
                    <RightOutlined
                      style={{
                        fontSize: isScreenWidth1366 ? ".8rem" : "",
                      }}
                    />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};
export default CurrentRequests;
