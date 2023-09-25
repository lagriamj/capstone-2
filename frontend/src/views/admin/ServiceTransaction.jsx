import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ClosedModal from "../../components/ClosedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ViewCancel from "../../components/ViewCancel";
import DoneRateModal from "../../components/DoneRateModal";

const ServiceTransaction = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [cancel, setCancel] = useState(false);
  const [viewCancel, setViewCancel] = useState(false);

  const [viewRating, setViewRating] = useState(false);
  const [viewRatingModal, setViewRatingModal] = useState(false);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilters, setSelectedStatusFilters] =
    useState("no-status-selected");

  const [selectedSortOrder, setSelectedDateOrder] = useState("desc");
  const [isDateSortingDropdownOpen, setIsDateSortingDropdownOpen] =
    useState(false);

  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [selectedModeFilters, setSelectedModeFilters] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleDateOrderChange = (order) => {
    setSelectedDateOrder(order);
    setIsDateSortingDropdownOpen(false);
  };

  const handleViewRating = (id) => {
    setViewRatingModal(id);
    setViewRating(true);
  };

  const handleCancelRequest = (data) => {
    setViewCancel(data);
    setCancel(true);
  };

  const openModal = (data) => {
    setSelectedData(data);
    if (data.status === "Closed") {
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
    startDate,
    endDate,
    selectedStatusFilters,
    selectedSortOrder,
    searchQuery,
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const urlSegments = ["http://127.0.0.1:8000/api/closed-transaction"];

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

      setData(result.data.results);
      setLoading(false);
    } catch (err) {
      console.log("Something went wrong:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
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

  const handleStatusCheckboxChange = (e) => {
    setIsStatusDropdownOpen(false);
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

  if (selectedStatusFilters.length === 0) {
    setSelectedStatusFilters(["no-status-selected"]);
  }

  const [pageInput, setPageInput] = useState("");

  const goToPage = () => {
    const pageNumber = parseInt(pageInput);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= npage) {
      setCurrentPage(pageNumber);
      setPageInput(pageNumber); // Clear the input field after changing the page
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

  const [doneRating, setDoneRating] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/done-rate") // Adjust the URL to match your Laravel route
      .then((response) => response.json())
      .then((data) => {
        setDoneRating(data.results); // Assuming your API returns data under the 'results' key
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const totalRequests = data.length;

  const isScreenWidth1366 = windowWidth1366 === 1366;

  return (
    <HelmetProvider>
      <Helmet>
        <title>Service Transaction</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto lg:ml-auto lg:mx-4   lg:mt-0   mt-20  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <h1 className="flex text-black items-center lg:text-2xl font-semibold ">
                Service Transactions
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
                  <tr className="bg-secondary text-white">
                    <th
                      className={`w-20 pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-center whitespace-nowrap`}
                    >
                      #
                    </th>
                    <th
                      className={`pl-5 py-5 large:py-6 text-sm large:text-base  font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Request ID
                    </th>
                    <th
                      className={`pl-5 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Date of Request
                    </th>
                    <th
                      className={`pl-5 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Nature of Request
                    </th>
                    <th
                      className={`pl-5 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider whitespace-nowrap text-left`}
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
                            className={`large:h-4 large:w-4 w-3 h-3 text-white`}
                          />
                        </button>
                        {isModeDropdownOpen && (
                          <div className="absolute right-0 overflow-auto text-black bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
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
                      className={`w-42 pl-5 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
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
                                value="Closed"
                                checked={selectedStatusFilters.includes(
                                  "Closed"
                                )}
                                onChange={handleStatusCheckboxChange}
                                className="mr-2"
                              />
                              Closed
                            </label>
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="Cancelled"
                                checked={selectedStatusFilters.includes(
                                  "Cancelled"
                                )}
                                onChange={handleStatusCheckboxChange}
                                className="mr-2"
                              />
                              Cancelled
                            </label>
                          </div>
                        )}
                      </div>
                    </th>

                    <th
                      className={`w-42 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
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
                      <tr key={setting.id}>
                        <td
                          className={`border-b-2 pl-5  py-2 large:py-3 large:text-lg text-sm border-gray-200 text-center`}
                        >
                          {firstIndex + index + 1}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.id}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.dateRequested}
                        </td>
                        <td
                          className={`border-b-2 pl-5  py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.natureOfRequest}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.modeOfRequest}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.assignedTo}
                        </td>
                        <td
                          className={`border-b-2 pl-5   py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.dateUpdated}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm pr-16 border-gray-200 text-center`}
                        >
                          <p
                            className={` rounded-xl lg:px-0 mediumLg:px-2 px-3 py-2 ${
                              setting.status === "Pending"
                                ? "bg-red-500 text-white" // Apply red background and white text for Pending
                                : setting.status === "Received"
                                ? "bg-orange-500 text-white"
                                : setting.status === "On Progress"
                                ? "bg-yellow-500 text-white" // Apply yellow background and white text for Process
                                : setting.status === "To Release"
                                ? "bg-green-500 text-white"
                                : setting.status === "Closed"
                                ? "bg-gray-800 text-white"
                                : setting.status === "Cancelled"
                                ? "bg-red-700 text-white" // Apply green background and white text for Done
                                : "bg-main text-white" // Default background and text color (if none of the conditions match)
                            }`}
                          >
                            {setting.status}
                          </p>
                        </td>

                        <td className="border-b-2 py-3  border-gray-200 text-left">
                          <div className="flex justify-start gap-1">
                            {setting.status === "Cancelled" ? (
                              <button
                                className={`text-white bg-blue-500 ${
                                  isScreenWidth1366 ? "text-xs" : " text-base"
                                } font-medium px-3 py-2 rounded-lg`}
                                onClick={() => handleCancelRequest(setting)}
                              >
                                View
                              </button>
                            ) : (
                              <button
                                onClick={() => openModal(setting)}
                                className={`text-white bg-blue-500 ${
                                  isScreenWidth1366 ? "text-xs" : " text-base"
                                } font-medium px-3 py-2 rounded-lg`}
                              >
                                View
                              </button>
                            )}

                            {setting.status === "Cancelled" ? (
                              <button
                                className={`text-white ${
                                  isScreenWidth1366 ? "text-xs" : " text-base"
                                } bg-gray-400 cursor-not-allowed py-2 px-4 rounded-lg`}
                                disabled
                              >
                                <FontAwesomeIcon icon={faStar} />
                              </button>
                            ) : setting.status === "Closed" ? (
                              doneRating.some(
                                (rating) => rating.request_id === setting.id
                              ) ? (
                                <button
                                  onClick={() => handleViewRating(setting.id)}
                                  className="text-white text-base bg-gray-400 py-2 px-4 rounded-lg"
                                >
                                  <FontAwesomeIcon icon={faStar} />
                                </button>
                              ) : (
                                <button
                                  className={`text-white ${
                                    isScreenWidth1366 ? "text-xs" : " text-base"
                                  } bg-yellow-500 py-2 px-4 rounded-lg`}
                                >
                                  <FontAwesomeIcon icon={faStar} />
                                </button>
                              )
                            ) : (
                              <button
                                className={`text-white ${
                                  isScreenWidth1366 ? "text-xs" : " text-base"
                                } bg-yellow-500 py-2 px-4 rounded-lg`}
                              >
                                <FontAwesomeIcon icon={faStar} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {viewRating && (
                <DoneRateModal
                  isOpen={viewRating}
                  onClose={() => setViewRating(false)}
                  id={viewRatingModal}
                />
              )}

              {modalType === "ServiceClosed" && (
                <ClosedModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  datas={selectedData}
                  refreshData={fetchData}
                />
              )}
              {cancel && (
                <ViewCancel
                  isOpen={cancel}
                  onClose={() => setCancel(false)}
                  datas={viewCancel} // Pass the selectedItemId as a prop
                />
              )}
            </div>
            <nav className={`  mt-2 `}>
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
                    onBlur={handlePageInputBlur} // Trigger page change when the input field loses focus
                    onKeyPress={handlePageInputKeyPress} // Trigger page change when Enter key is pressed
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
  //function changeCPage(id) {
  //setCurrentPage(id);
  //}
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default ServiceTransaction;
