import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RateModal from "../../components/RateModal";
import axios from "axios";
import { Skeleton, message } from "antd";
import ClosedModal from "../../components/ClosedModal";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useAuth } from "../../AuthContext";
import ViewCancel from "../../components/ViewCancel";
import DoneRateModal from "../../components/DoneRateModal";

const Transactions = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);
  const { userRole } = useAuth();

  const [rate, setRate] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const { userID } = useAuth();
  const [view, setView] = useState(false);
  const [viewRequest, setViewRequest] = useState(false);

  const [viewRating, setViewRating] = useState(false);
  const [viewRatingModal, setViewRatingModal] = useState(false);

  const [cancel, setCancel] = useState(false);
  const [viewCancel, setViewCancel] = useState(false);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const [loading, setLoading] = useState(true);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [selectedModeFilters, setSelectedModeFilters] = useState([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([
    "no-status-selected",
  ]);
  const [selectedSortOrder, setSelectedSortOrder] = useState("desc"); // Set your default sorting order here

  const [isDateSortingDropdownOpen, setIsDateSortingDropdownOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("sss", selectedSortOrder);
  console.log(selectedStatusFilters);

  const handleDateOrderChange = (order) => {
    setSelectedSortOrder(order);
    setIsDateSortingDropdownOpen(false);
  };

  if (selectedStatusFilters.length === 0) {
    setSelectedStatusFilters(["no-status-selected"]);
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const handleCancelRequest = (data) => {
    setViewCancel(data);
    setCancel(true);
  };

  const handleViewRequest = (data) => {
    setViewRequest(data);
    setView(true);
  };

  const handleViewRating = (id) => {
    setViewRatingModal(id);
    setViewRating(true);
  };

  const handleStarIconClick = (id, user_id, office) => {
    setSelectedID(id);
    setSelectedUserId(user_id);
    setSelectedOffice(office);
    handleRatings(id);
    setRate(true);
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
  const isWidth1920 = window.innerWidth === 1920;

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
      const urlSegments = ["http://127.0.0.1:8000/api/transaction-list"];

      if (userID) {
        urlSegments.push(userID);
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

      // Filter out null or empty segments
      const filteredUrlSegments = urlSegments.filter(
        (segment) => segment !== null && segment !== ""
      );

      // Join the filtered segments with '/'
      const url = filteredUrlSegments.join("/");
      const regex = new RegExp(`/${selectedSortOrder}$`);
      const cleanedUrl = url.replace(regex, "");

      console.log("URL:", cleanedUrl);

      const result = await axios.get(cleanedUrl, {
        params: {
          order: selectedSortOrder,
        },
      });
      console.log("URL:", selectedSortOrder);
      setData(result.data.results);
      setLoading(false);
    } catch (err) {
      console.log("Something went wrong:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const [ratings, setRatings] = useState([]);

  const handleRatings = async (id) => {
    console.log(id);
    const response = await axios.get(
      `http://127.0.0.1:8000/api/closed-view/${id}`
    );
    setRatings(response.data.results);
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

  const toggleModeDropdown = () => {
    setIsModeDropdownOpen(!isModeDropdownOpen);
  };

  const handleModeCheckboxChange = (e) => {
    const selectedMode = e.target.value;

    setSelectedModeFilters((prevFilters) => {
      if (prevFilters.length === 1 && prevFilters[0] === selectedMode) {
        return [];
      } else {
        return [selectedMode];
      }
    });
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

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

  // eslint-disable-next-line no-unused-vars
  const [rateView, setRateView] = useState(null);

  useEffect(() => {
    const hasNonNullDateRate = ratings.some(
      (rating) => rating.dateRate !== null
    );

    setRateView(hasNonNullDateRate);
  }, [ratings]);

  const [doneRating, setDoneRating] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/done-rate")
      .then((response) => response.json())
      .then((data) => {
        setDoneRating(data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log(doneRating);

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
        <title>Transactions</title>
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
                      className={`w-36  pl-5 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
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
                            className={`${
                              isScreenWidth1366
                                ? "h-3 w-3 text-white"
                                : "h-4 w-4 text-white"
                            }`}
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
                          className={`py-3 pr-5 ${
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
                          className={`py-3 pr-5 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.assignedTo}
                        </td>
                        <td
                          className={`py-3 pr-5 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-left`}
                        >
                          {item.dateUpdated}
                        </td>
                        <td
                          className={`${
                            isWidth1920
                              ? "px-6"
                              : isScreenWidth1366
                              ? "text-xs py-3"
                              : "text-base py-2 "
                          } px-3 whitespace-nowrap text-center`}
                        >
                          <p
                            className={`rounded-xl py-2  ${
                              item.status === "Pending"
                                ? "bg-red-500 text-white" // Apply red background and white text for Pending
                                : item.status === "Received"
                                ? "bg-orange-500 text-white"
                                : item.status === "On Progress"
                                ? "bg-yellow-500 text-white" // Apply yellow background and white text for Process
                                : item.status === "To Release"
                                ? "bg-green-500 text-white"
                                : item.status === "Closed"
                                ? "bg-gray-800 text-white"
                                : item.status === "Cancelled"
                                ? "bg-red-700 text-white" // Apply green background and white text for Done
                                : "bg-main text-white" // Default background and text color (if none of the conditions match)
                            }`}
                          >
                            {item.status}
                          </p>
                        </td>
                        <td
                          className={`border-b-2 py-3 border-gray-200 text-left`}
                        >
                          <div className="flex gap-1">
                            {item.status === "Cancelled" ? (
                              <button
                                className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
                                onClick={() => handleCancelRequest(item)}
                              >
                                View
                              </button>
                            ) : (
                              <button
                                onClick={() => handleViewRequest(item)}
                                className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
                              >
                                View
                              </button>
                            )}

                            {item.status === "Cancelled" ? (
                              <button
                                className="text-white text-base bg-gray-400 cursor-not-allowed py-2 px-3 rounded-lg"
                                disabled
                              >
                                <FontAwesomeIcon icon={faStar} />
                              </button>
                            ) : item.status === "Closed" ? (
                              doneRating.some(
                                (rating) => rating.request_id === item.id
                              ) ? (
                                <button
                                  onClick={() => handleViewRating(item.id)}
                                  className="text-white text-base bg-gray-400 py-2 px-3 rounded-lg"
                                >
                                  <FontAwesomeIcon icon={faStar} />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleStarIconClick(
                                      item.id,
                                      item.user_id,
                                      item.reqOffice
                                    )
                                  }
                                  className="text-white text-base bg-yellow-500 py-2 px-3 rounded-lg"
                                >
                                  <FontAwesomeIcon icon={faStar} />
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() =>
                                  handleStarIconClick(
                                    item.id,
                                    item.user_id,
                                    item.reqOffice
                                  )
                                }
                                className="text-white text-base bg-yellow-500 py-2 px-3 rounded-lg"
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

              {rate && (
                <RateModal
                  isOpen={rate}
                  onClose={() => setRate(false)}
                  id={selectedID} // Pass the selectedItemId as a prop
                  user_id={selectedUserId} // Pass the selectedUserId as a prop
                  office={selectedOffice}
                />
              )}

              {view && (
                <ClosedModal
                  isOpen={view}
                  onClose={() => setView(false)}
                  datas={viewRequest} // Pass the selectedItemId as a prop
                />
              )}
              {cancel && (
                <ViewCancel
                  isOpen={cancel}
                  onClose={() => setCancel(false)}
                  datas={viewCancel}
                  role={userRole} // Pass the selectedItemId as a prop
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

export default Transactions;
