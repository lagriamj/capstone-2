import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ServiceTaskModal from "../../components/ServiceTaskModal";
import ServiceReleaseModal from "../../components/ServiceReleaseModal";
import ReleasedModal from "../../components/ReleasedModal";
import ToRateModal from "../../components/ToRateModal";
//import ClosedModal from "../../components/ClosedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Skeleton, message } from "antd";
import { Popconfirm } from "antd";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../AuthContext";

const ServiceTask = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [popconfirmVisible, setPopconfirmVisible] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const { fullName } = useAuth();

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilters, setSelectedStatusFilters] =
    useState("no-status-selected");

  const [isTechnicianDropDownOpen, setIsTechnicianDropDownOpen] =
    useState(false);
  const [selectedTechnicianFilter, setSelectedTechnicianFilter] = useState([]);

  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [selectedModeFilters, setSelectedModeFilters] = useState(["notech"]);

  const [selectedSortOrder, setSelectedDateOrder] = useState("desc");
  const [isDateSortingDropdownOpen, setIsDateSortingDropdownOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const handleDateOrderChange = (order) => {
    setSelectedDateOrder(order);
    setIsDateSortingDropdownOpen(false);
  };

  if (selectedStatusFilters.length === 0) {
    setSelectedStatusFilters(["no-status-selected"]);
  }

  const openModal = (data) => {
    setSelectedData(data);
    if (data.status === "Received") {
      setModalType("ServiceOnProgress");
    } else if (data.status === "On Progress") {
      setModalType("ServiceToRelease");
    } else if (data.status === "To Release") {
      setModalType("ServiceReleased");
    } else if (data.status === "To Rate") {
      setModalType("ServiceClosed");
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedData(null);
    setModalOpen(false);
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

  const isLargeScreen = windowWidth >= 1024;

  useEffect(() => {
    // Initialize popconfirmVisible state with false for each row
    setPopconfirmVisible(new Array(data.length).fill(false));
  }, [data]);

  const showPopconfirm = (id) => {
    // Use setPopconfirmVisible instead of setOpen
    const popconfirmVisibleCopy = [...popconfirmVisible];
    popconfirmVisibleCopy[id] = true;
    setPopconfirmVisible(popconfirmVisibleCopy);
    setTimeout(() => {
      // Use setPopconfirmVisible instead of setOpen
      setPopconfirmVisible(false);
    }, 5000);
  };

  const handleOk = (id, reqID) => {
    setConfirmLoading(true);
    handleDelete(id, reqID);
    handleCancel(id);
    setTimeout(() => {
      // Use setPopconfirmVisible instead of setOpen
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = (index) => {
    // Use setPopconfirmVisible instead of setOpen
    const popconfirmVisibleCopy = [...popconfirmVisible];
    popconfirmVisibleCopy[index] = false;
    setPopconfirmVisible(popconfirmVisibleCopy);
  };

  const handleDelete = async (id, reqID) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/delete-serviced/${id}/${reqID}`
      );
      const newUserData = data.filter((item) => item.id !== id);
      setData(newUserData);
    } catch (error) {
      console.error("Error deleting request:", error);
      // Handle the error gracefully, e.g., show an error message to the user
    }
  };

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
  }, [
    selectedTechnicianFilter,
    startDate,
    endDate,
    selectedStatusFilters,
    selectedSortOrder,
    searchQuery,
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const urlSegments = ["http://127.0.0.1:8000/api/service-task-list"];

      if (selectedTechnicianFilter) {
        urlSegments.push(selectedTechnicianFilter);
      }
      if (startDate) {
        urlSegments.push(startDate);
      }
      if (endDate) {
        urlSegments.push(endDate);
      }
      if (selectedStatusFilters) {
        urlSegments.push(selectedStatusFilters);
      }
      if (selectedSortOrder) {
        urlSegments.push(selectedSortOrder);
      }
      if (searchQuery) {
        urlSegments.push(searchQuery);
      }

      const filteredUrlSegments = urlSegments.filter(
        (segment) => segment !== null && segment !== ""
      );
      const url = filteredUrlSegments.join("/");
      const regex = new RegExp(`/${selectedSortOrder}$`);
      const cleanedUrl = url.replace(regex, "");

      const result = await axios.get(cleanedUrl, {
        params: {
          order: selectedSortOrder,
        },
      });
      console.log("ssss", selectedTechnicianFilter);
      setData(result.data.results);
      setLoading(false);
    } catch (err) {
      console.log("Something went wrong:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleTechnicianDropDown = () => {
    setIsTechnicianDropDownOpen(!isTechnicianDropDownOpen);
  };

  const handleTechnicianCheckboxChange = (e) => {
    const selectedTechnician = e.target.value;

    setSelectedTechnicianFilter((prevFilters) => {
      if (prevFilters.length === 1 && prevFilters[0] === selectedTechnician) {
        return []; // Unselect if the same option is clicked
      } else {
        return [selectedTechnician];
      }
    });
  };

  console.log("Selected Technician:" + selectedTechnicianFilter);

  if (selectedTechnicianFilter.length == 0) {
    setSelectedTechnicianFilter(["notech"]);
  }

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

  useEffect(() => {
    // Function to update windowWidth whenever the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add a listener for the "resize" event
    window.addEventListener("resize", handleResize);

    // Periodically check the screen width (e.g., every 1 second)
    const intervalId = setInterval(() => {
      setWindowWidth(window.innerWidth);
    }, 1000);

    // Clean up the listener and interval when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Service Task</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}

        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto lg:ml-auto lg:mx-4   lg:mt-0 mt-20  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <h1 className="flex text-black items-center lg:text-2xl font-semibold ">
                Service Task
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
                      className={`pl-5 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Request ID
                    </th>
                    <th
                      className={` pl-5 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Date of Request
                    </th>
                    <th
                      className={`pl-5 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Nature of Request
                    </th>
                    <th
                      className={`pl-5  py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider whitespace-nowrap text-left`}
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
                            className="large:h-4 large:w-4 w-3 h-3 text-white"
                          />
                        </button>
                        {isModeDropdownOpen && (
                          <div className="absolute right-0 overflow-auto text-start bg-white text-black border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
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
                      className={`pl-5  py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Assigned To
                      <div className="relative inline-block">
                        <button
                          onClick={toggleTechnicianDropDown}
                          className="text-main focus:outline-none ml-2"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faFilter}
                            className="large:h-4 large:w-4 w-3 h-3 text-white"
                          />
                        </button>
                        {isTechnicianDropDownOpen && (
                          <div className="absolute right-0 overflow-auto text-start bg-white text-black border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value={fullName}
                                checked={selectedTechnicianFilter.includes(
                                  fullName
                                )}
                                onChange={handleTechnicianCheckboxChange}
                                className="mr-2"
                              />
                              My Task
                            </label>
                          </div>
                        )}
                      </div>
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
                      className={`pl-5  py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
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
                            className="large:h-4 large:w-4 w-3 h-3 text-white"
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
                      className={`w-42  py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
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
                    <tr className="h-[50vh]">
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
                    records.map((setting, index) => (
                      <tr
                        className={`${
                          isScreenWidth1366 ? "text-sm" : " text-lg"
                        }`}
                        key={setting.id}
                      >
                        <td className="border-b-2 px-3 py-2 large:py-3 border-gray-200 text-left">
                          {firstIndex + index + 1}
                        </td>
                        <td className="border-b-2 pl-5 py-2 large:py-3 border-gray-200 text-left">
                          {setting.request_id}
                        </td>
                        <td className="border-b-2 pl-5 py-2 large:py-3 border-gray-200 text-left  large:whitespace-nowrap">
                          {setting.dateRequested}
                        </td>
                        <td className="border-b-2 pl-5 py-2 large:py-3 border-gray-200 text-left  large:whitespace-nowrap">
                          {setting.natureOfRequest}
                        </td>
                        <td className="border-b-2 pl-5 py-2 large:py-3 border-gray-200 text-left large:whitespace-nowrap">
                          {setting.modeOfRequest}
                        </td>
                        <td className="border-b-2 pl-5 py-2 large:py-3 border-gray-200 text-left  large:whitespace-nowrap">
                          {setting.assignedTo}
                        </td>

                        <td className="border-b-2 pl-5 py-2 large:py-3 border-gray-200 text-left  large:whitespace-nowrap">
                          {setting.dateUpdated}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 pr-16 border-gray-200 text-left  whitespace-nowrap`}
                        >
                          <p
                            className={`rounded-xl lg:px-3 px-2 py-2 text-center ${
                              setting.status === "Pending"
                                ? "bg-red-500 text-white" // Apply red background and white text for Pending
                                : setting.status === "Received"
                                ? "bg-orange-500 text-white" // Apply orange background and white text for Received
                                : setting.status === "On Progress"
                                ? "bg-yellow-500 text-white" // Apply yellow background and white text for On Progress
                                : setting.status === "To Release"
                                ? "bg-green-500 text-white" // Apply green background and white text for To Release
                                : setting.status === "To Rate"
                                ? "bg-blue-500 text-white" // Apply blue background and white text for To Rate
                                : setting.status === "Closed"
                                ? "bg-gray-800 text-white" // Apply gray background and white text for Closed
                                : setting.status === "Cancelled"
                                ? "bg-red-700 text-white" // Apply dark red background and white text for Cancelled
                                : "bg-main text-white" // Default background and text color (if none of the conditions match)
                            }`}
                          >
                            {setting.status}
                          </p>
                        </td>
                        <td className="border-b-2 pr-2 py-2 large:py-3 border-gray-200 text-center">
                          <div className="flex  gap-1">
                            {setting.status === "To Rate" ? (
                              <button
                                className={`text-white ${
                                  isScreenWidth1366 ? "text-xs" : " text-base"
                                } bg-blue-500 font-medium px-5 py-2 rounded-lg`}
                                onClick={() => openModal(setting)}
                              >
                                View
                              </button>
                            ) : (
                              <button
                                className={`text-white ${
                                  isScreenWidth1366 ? "text-xs" : " text-base"
                                } bg-blue-500 font-medium px-3 py-2 rounded-lg`}
                                onClick={() => openModal(setting)}
                              >
                                Update
                              </button>
                            )}
                            <Popconfirm
                              placement="left"
                              title="Confirmation"
                              description="Please confirm this action. This action cannot be undone."
                              open={popconfirmVisible[setting.id]}
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              onConfirm={() =>
                                handleOk(setting.id, setting.request_id)
                              }
                              okButtonProps={{
                                loading: confirmLoading,
                                color: "red",
                                className:
                                  "text-black border-1 border-gray-300",
                                size: "large",
                              }}
                              cancelButtonProps={{
                                size: "large",
                              }}
                              onCancel={() => handleCancel(setting.id)}
                              okText="Yes"
                            >
                              <button
                                onClick={() => showPopconfirm(setting.id)}
                                className="text-white text-base bg-red-700 py-2 px-4 rounded-lg"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </Popconfirm>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {modalType === "ServiceOnProgress" && (
                <ServiceTaskModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  data={selectedData}
                  refreshData={fetchData}
                />
              )}

              {modalType === "ServiceToRelease" && (
                <ServiceReleaseModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  data={selectedData}
                  refreshData={fetchData}
                />
              )}
              {modalType === "ServiceReleased" && (
                <ReleasedModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  data={selectedData}
                  refreshData={fetchData}
                />
              )}
              {modalType === "ServiceClosed" && (
                <ToRateModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  datas={selectedData}
                  refreshData={fetchData}
                />
              )}
            </div>
            <nav className={`  mt-2 `}>
              <ul className="flex gap-2 items-center">
                <li className="flex-auto  mr-5 text-base font-bold">
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

export default ServiceTask;
