import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RateModal from "../../components/RateModal";
import axios from "axios";
import { Skeleton } from "antd";
import ClosedModal from "../../components/ClosedModal";

const Transactions = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isSingleRequest, setIsSingleRequest] = useState(false);
  const [rate, setRate] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [view, setView] = useState(false);
  const [viewRequest, seViewRequest] = useState(false);

  const handleViewRequest = (data) => {
    seViewRequest(data);
    setView(true);
  };

  const handleStarIconClick = (id, user_id) => {
    setSelectedID(id);
    setSelectedUserId(user_id);
    setRate(true); // Open the RateModal
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsFetchingData(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/closed-transaction"
      );
      if (response.status === 200) {
        setData(response.data.results);
        console.log(response.data.results);
        setIsFetchingData(false);
        setIsSingleRequest(response.data.results.length === 1);
      } else {
        console.error("Failed to fetch utility settings. Response:", response);
        setIsFetchingData(false);
      }
    } catch (error) {
      console.error("Error fetching utility settings:", error);
      setIsFetchingData(false);
    }
  };

  //const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  //const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);

  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [selectedModeFilters, setSelectedModeFilters] = useState([]);

  {
    /* const toggleStatusDropdown = () => {
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
  }; */
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

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 10;

  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = data.slice(firstIndex, lastIndex);

  const npage = Math.ceil(data.length / recordsPage);
  // const numbers = [...Array(npage + 1).keys()].slice(1);

  const isLargeScreen = windowWidth >= 1024;
  const isWidth1980 = window.innerWidth === 1980;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((item) => {
    const matchesSearchQuery =
      item.natureOfRequest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.modeOfRequest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dateRequested.toLowerCase().includes(searchQuery.toLowerCase());

    {
      /* const matchesStatusFilter =
      selectedStatusFilters.length === 0 ||
  selectedStatusFilters.includes(item.status);  */
    }

    const matchesModeFilter =
      selectedModeFilters.length === 0 ||
      selectedModeFilters.includes(item.modeOfRequest);

    return matchesSearchQuery && matchesModeFilter;
  });

  return (
    <HelmetProvider>
      <Helmet>
        <title>Transactions</title>
      </Helmet>
      <div
        className={`className="flex flex-col lg:flex-row bg-gray-200 ${
          isWidth1980 ? "lg:pl-20" : "lg:pl-[3.0rem]"
        } lg:py-5 h-screen`}
      >
        {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
        <div className="flex flex-col lg:pb-10 bg-gray-200 gap-5 lg:w-full">
          <div
            className={`overflow-x-auto ${
              isWidth1980 ? "lg:w-[83%]" : "lg:w-[82%]"
            } w-[90%] lg:h-[90vh] relative mt-20 lg:mt-0 ml-5  h-[80vh] pb-10 bg-white shadow-xl  lg:ml-72  border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans`}
          >
            <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
              <h1 className="font-sans lg:text-3xl text-xl mt-8 ml-5 mr-auto tracking-wide">
                Service Transactions
              </h1>
              <div className="relative flex items-center lg:mr-10 ">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="h-6 w-6 absolute ml-3 text-main"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="border rounded-3xl bg-gray-100 text-black my-5 pl-12 pr-5 h-14 lg:w-full w-[90%] focus:outline-none text-xl"
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
                    <th className="w-10 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      #
                    </th>
                    <th className="w-10 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Request ID
                    </th>
                    <th className="w-28 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Nature of Request
                    </th>
                    <th className=" w-28 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Assigned To
                    </th>
                    <th className="w-20 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
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
                            className="h-4 w-4"
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
                    <th className="w-20 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Status
                    </th>
                    <th className="lg:w-48 w-36 lg:px-3 px-10 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Date of Request
                    </th>
                    <th className="lg:w-48 w-36 lg:px-3 px-10 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Date Updated
                    </th>
                    <th className="w-56 lg:px-3 px-10 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isFetchingData ? (
                    <tr>
                      <td colSpan="3">
                        <Skeleton active />
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr className="h-[20vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No Record Yet.
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr className="h-[50vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No records found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item, index) => (
                      <tr
                        className="border-b-2 border-gray-200 h-auto overflow-auto"
                        key={item.id}
                      >
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center">
                          {index + 1}
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center">
                          {item.id}
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center">
                          {item.natureOfRequest}
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center">
                          {item.assignedTo}
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center">
                          {item.modeOfRequest}
                        </td>
                        <td className="text-center text-lg font-medium whitespace-nowrap">
                          {item.status}
                        </td>
                        <td className="text-center text-lg font-medium whitespace-nowrap">
                          {item.dateRequested}
                        </td>
                        <td className="text-center text-lg font-medium whitespace-nowrap">
                          {item.dateUpdated}
                        </td>
                        <td className="border-b-2 py-3 border-gray-200 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewRequest(item)}
                              className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                handleStarIconClick(item.id, item.user_id)
                              }
                              className="text-white text-base bg-yellow-500 py-2 px-3 rounded-lg"
                            >
                              <FontAwesomeIcon icon={faStar} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {rate && (
                <RateModal
                  isOpen={rate}
                  onClose={() => setRate(false)}
                  id={selectedID} // Pass the selectedItemId as a prop
                  user_id={selectedUserId} // Pass the selectedUserId as a prop
                  isLargeScreen={isLargeScreen}
                />
              )}

              {view && (
                <ClosedModal
                  isOpen={view}
                  onClose={() => setView(false)}
                  datas={viewRequest} // Pass the selectedItemId as a prop
                />
              )}
            </div>
          </div>
          <nav
            className={`lg:ml-56 mr-6  ${isWidth1980 ? "lg:mr-10" : "lg:mr-8"}`}
          >
            <ul className="flex gap-2">
              <li className="flex-auto ml-10 lg:ml-20 mr-5 text-base font-bold">
                Page {currentPage} of {npage}
              </li>
              <li>
                <a
                  href="#"
                  onClick={prePage}
                  className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={nextPage}
                  className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                >
                  Next
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

export default Transactions;
