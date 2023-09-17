import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
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
import { message, Skeleton } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RateModal from "../../components/RateModal";
import ReasonModal from "../../components/ReasonModal";

const CurrentRequests = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { userID } = useAuth();
  console.log("userID:", userID);
  const [selectedItemId, setSelectedItemId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  const [popconfirmVisible, setPopconfirmVisible] = useState([]);
  const location = useLocation();
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSingleRequest, setIsSingleRequest] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

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
    setUpdateModalVisible(true); // Open the RateModal
  };

  useEffect(() => {
    const locationState = location.state;

    if (locationState && locationState.successMessage) {
      setDisplaySuccessMessage(true);
      navigate("/current-requests"); // Clear the location state from the URL
    }
  }, []);

  useEffect(() => {
    if (displaySuccessMessage) {
      // Display the success message using Ant Design message component
      const successMessage = message.success("Requested Successfully");

      // Close the message after a certain duration
      setTimeout(() => {
        successMessage(); // Close the message
      }, 5000); // Duration of 5 seconds
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get("http://127.0.0.1:8000/api/request-list", {
        params: {
          user_id: userID, // Pass the user_id from your component's state
        },
      });

      setData(result.data.results);
      setIsSingleRequest(result.data.results.length === 1);
      setLoading(false);
    } catch (err) {
      console.log("Something went wrong:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize popconfirmVisible state with false for each row
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

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);

  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [selectedModeFilters, setSelectedModeFilters] = useState([]);

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleStatusCheckboxChange = (e) => {
    const selectedStatus = e.target.value;

    setSelectedStatusFilters((prevFilters) => {
      if (prevFilters.length === 1 && prevFilters[0] === selectedStatus) {
        return []; // Unselect if the same option is clicked
      } else {
        return [selectedStatus];
      }
    });
  };

  const toggleModeDropdown = () => {
    setIsModeDropdownOpen(!isModeDropdownOpen);
  };

  const handleModeCheckboxChange = (e) => {
    const selectedMode = e.target.value;

    setSelectedModeFilters((prevFilters) => {
      if (prevFilters.length === 1 && prevFilters[0] === selectedMode) {
        return []; // Unselect if the same option is clicked
      } else {
        return [selectedMode];
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 10;

  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = data.slice(firstIndex, lastIndex);

  const npage = Math.ceil(data.length / recordsPage);
  //const numbers = [...Array(npage + 1).keys()].slice(1);

  const isLargeScreen = windowWidth >= 1024;
  const isWidth1920 = window.innerWidth === 1920;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((item) => {
    const matchesSearchQuery =
      item.natureOfRequest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modeOfRequest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dateRequested.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatusFilter =
      selectedStatusFilters.length === 0 ||
      selectedStatusFilters.includes(item.status);

    const matchesModeFilter =
      selectedModeFilters.length === 0 ||
      selectedModeFilters.includes(item.modeOfRequest);

    return matchesSearchQuery && matchesStatusFilter && matchesModeFilter;
  });

  const [selectedSortOrder, setSelectedSortOrder] = useState("asc");
  const [isSortOptionsVisible, setIsSortOptionsVisible] = useState(false);

  const toggleSortOptions = () => {
    setIsSortOptionsVisible(!isSortOptionsVisible);
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (a === b) return 0;

    if (selectedSortOrder === "asc") {
      // Use selectedSortOrder instead of dateUpdatedSortOrder
      return a.dateUpdated.localeCompare(b.dateUpdated);
    } else {
      return b.dateUpdated.localeCompare(a.dateUpdated);
    }
  });

  const handleSortOrderChange = (newOrder) => {
    setSelectedSortOrder(newOrder);
    setIsSortOptionsVisible(false); // Hide the options after selecting
  };

  const [pageInput, setPageInput] = useState("");

  const goToPage = () => {
    const pageNumber = parseInt(pageInput);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= npage) {
      setCurrentPage(pageNumber);
      setPageInput(""); // Clear the input field after changing the page
    } else {
      // Handle invalid page number input, e.g., show an error message to the user
      message.error("Invalid page number. Please enter a valid page number.");
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputBlur = () => {
    goToPage(); // Trigger page change when the input field loses focus
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === "Enter") {
      goToPage(); // Trigger page change when the Enter key is pressed
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

  return (
    <HelmetProvider>
      <Helmet>
        <title>Current Requests</title>
      </Helmet>
      <div
        className={`className="flex flex-col lg:flex-row bg-gray-200 ${
          isWidth1920
            ? "lg:pl-20"
            : isScreenWidth1366
            ? "lg:pl-[0.5rem]"
            : "lg:pl-[3.0rem]"
        } lg:pt-5 h-screen`}
      >
        {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
        <div className="flex flex-col lg:pb-10 bg-gray-200 gap-2 lg:w-full">
          <div
            className={`overflow-x-auto ${
              isWidth1920
                ? "lg:w-[84%]  lg:ml-[16.6rem]"
                : isScreenWidth1366
                ? "lg:w-[82%]  lg:ml-[14.5rem]"
                : "lg:w-[82%]  lg:ml-72"
            } w-[90%] lg:h-[90vh] relative mt-20 lg:mt-0 ml-5  h-[80vh] pb-10 bg-white shadow-xl    border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans`}
          >
            <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
              <h1
                className={`font-sans flex items-center justify-center  ${
                  isScreenWidth1366 ? "text-xl" : "lg:text-3xl text-xl"
                }  ml-5 mr-auto tracking-wide`}
              >
                Request
              </h1>
              <div className="relative flex items-center lg:mr-10 ">
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`${
                    isScreenWidth1366 ? "w-4 h-4" : "w-6 h-6"
                  } absolute ml-3 text-main`}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className={`border rounded-3xl bg-gray-100 text-black my-5 pl-12 pr-5 lg:w-full w-[90%] focus:outline-none ${
                    isScreenWidth1366 ? "text-sm h-10" : "text-xl h-14"
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div
              className={`overflow-auto h-screen ${
                isSingleRequest ? "h-screen" : ""
              } rounded-lg w-full`}
            >
              <table className="w-full ">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="border-b-2 border-gray-100">
                    <th
                      className={`w-20 px-3 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      #
                    </th>
                    <th
                      className={`w-30 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Request ID
                    </th>
                    <th
                      className={`w-40  ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Date of Request
                    </th>
                    <th
                      className={`w-30  ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Mode
                      <div className="relative inline-block">
                        <button
                          onClick={toggleModeDropdown}
                          className="text-main focus:outline-none ml-2"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faFilter}
                            className={`${
                              isScreenWidth1366 ? "h-3 w-3" : "h-4 w-4"
                            }`}
                          />
                        </button>
                        {isModeDropdownOpen && (
                          <div className="absolute right-0 overflow-auto text-start bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="Walk-In"
                                checked={selectedModeFilters.includes(
                                  "Walk-In"
                                )}
                                onChange={handleModeCheckboxChange}
                                className="mr-2"
                              />
                              Walk-In
                            </label>
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="Online"
                                checked={selectedModeFilters.includes("Online")}
                                onChange={handleModeCheckboxChange}
                                className="mr-2"
                              />
                              Online
                            </label>
                          </div>
                        )}
                      </div>
                    </th>
                    <th
                      className={`w-40 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Nature of Request
                    </th>
                    <th
                      className={`w-48  ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Assigned To
                    </th>
                    <th
                      className={`w-48 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider relative text-left whitespace-nowrap`}
                    >
                      Date Updated
                      <button
                        onClick={toggleSortOptions}
                        className="text-main focus:outline-none ml-2"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      >
                        <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                      </button>
                      {isSortOptionsVisible && (
                        <div className="absolute top-8 right-0 bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
                          <button
                            onClick={() => handleSortOrderChange("asc")}
                            className={`block px-4 w-full py-2 text-left ${
                              selectedSortOrder === "asc"
                                ? "bg-main text-white"
                                : ""
                            }`}
                          >
                            Ascending
                          </button>
                          <button
                            onClick={() => handleSortOrderChange("desc")}
                            className={`block px-4 w-full py-2 text-left ${
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
                      className={`w-36  pl-5 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Status
                      <div className="relative inline-block">
                        <button
                          onClick={toggleStatusDropdown}
                          className="text-main focus:outline-none ml-2"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faFilter}
                            className={`${
                              isScreenWidth1366 ? "h-3 w-3" : "h-4 w-4"
                            }`}
                          />
                        </button>
                        {isStatusDropdownOpen && (
                          <div className="absolute right-0 bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg text-start">
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
                      className={`w-30  ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider  whitespace-nowrap text-left`}
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
                  ) : sortedRecords.length === 0 ? (
                    <tr className="h-[50vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No records found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    sortedRecords.map((item, index) => (
                      <tr
                        className="border-b-2 border-gray-200 h-auto overflow-auto"
                        key={item.id}
                      >
                        <td
                          className={`p-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          {firstIndex + index + 1}
                        </td>
                        <td
                          className={`py-3 pr-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          E-{item.id}
                        </td>
                        <td
                          className={`py-3 pr-5 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.dateRequested}
                        </td>
                        <td
                          className={`py-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.modeOfRequest}
                        </td>
                        <td
                          className={`py-3 pr-5 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.natureOfRequest}
                        </td>
                        <td
                          className={`py-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.assignedTo}
                        </td>
                        <td
                          className={`py-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.dateUpdated}
                        </td>
                        <td
                          className={`px-5 py-2 ${
                            isScreenWidth1366 ? "text-xs" : " text-base"
                          } whitespace-nowrap text-center`}
                        >
                          <p
                            className={`rounded-xl py-2 px-3 ${
                              item.status === "Pending"
                                ? "bg-red-500 text-white" // Apply red background and white text for Pending
                                : item.status === "Received"
                                ? "bg-orange-500 text-white" // Apply orange background and white text for Received
                                : item.status === "On Progress"
                                ? "bg-yellow-500 text-white" // Apply yellow background and white text for On Progress
                                : item.status === "To Release"
                                ? "bg-green-500 text-white" // Apply green background and white text for To Release
                                : item.status === "To Rate"
                                ? "bg-blue-600 text-white" // Apply blue background and white text for To Rate
                                : item.status === "Closed"
                                ? "bg-gray-800 text-white" // Apply gray background and white text for Closed
                                : item.status === "Cancelled"
                                ? "bg-red-700 text-white" // Apply dark red background and white text for Cancelled
                                : "bg-main text-white" // Default background and text color (if none of the conditions match)
                            }`}
                          >
                            {item.status}
                          </p>
                        </td>
                        <td
                          className={`p-2 ${
                            isScreenWidth1366 ? "text-xs" : " text-lg"
                          } text-gray-700 flex gap-1 `}
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
          </div>
          <nav
            className={`lg:ml-56 mr-6  ${isWidth1920 ? "lg:mr-10" : "lg:mr-8"}`}
          >
            <ul className="flex gap-2 items-center">
              <li
                className={`flex-auto ml-10 lg:ml-20 mr-5 ${
                  isScreenWidth1366 ? "text-sm" : " text-base"
                } font-bold`}
              >
                Page {currentPage} of {npage}
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
                  onBlur={handlePageInputBlur} // Trigger page change when the input field loses focus
                  onKeyDown={handlePageInputKeyPress} // Trigger page change when Enter key is pressed
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
                      fontSize: isScreenWidth1366 ? "0.8rem" : "",
                    }}
                  />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </HelmetProvider>
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  //function changeCPage(id) {
  //setCurrentPage(id);
  //}
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default CurrentRequests;
