import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ClosedModal from "../../components/ClosedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { Skeleton, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const ServiceTransaction = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSingleRequest, setIsSingleRequest] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

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
  const isWidth1920 = window.innerWidth === 1920;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/closed-transaction"
      );
      if (response.status === 200) {
        setLoading(false);
        setData(response.data.results);
        console.log();
        setIsSingleRequest(response.data.results.length === 1);
      } else {
        setLoading(false);
        console.error("Failed to fetch utility settings. Response:", response);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching utility settings:", error);
    }
  };

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);

  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [selectedModeFilters, setSelectedModeFilters] = useState([]);

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
  //const numbers = [...Array(npage + 1).keys()].slice(1);

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

  return (
    <HelmetProvider>
      <Helmet>
        <title>Service Transaction</title>
      </Helmet>
      <div
        className={`className="flex flex-col lg:flex-row bg-gray-200 ${
          isWidth1920 ? "lg:pl-20" : "lg:pl-[3.0rem]"
        } lg:py-5 h-screen`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="flex flex-col lg:pb-10 bg-gray-200 gap-2 lg:w-full">
          <div
            className={`overflow-x-auto ${
              isWidth1920
                ? "lg:w-[84%]  lg:ml-[16.6rem]"
                : "lg:w-[82%]  lg:ml-72"
            } w-[90%] lg:h-[90vh] relative mt-20 lg:mt-0 ml-5  h-4/5 pb-10 bg-white shadow-xl   border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans`}
          >
            <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
              <h1 className="font-sans lg:text-3xl text-xl flex items-center justify-center ml-5 mr-auto tracking-wide">
                Service Transaction
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
              className={`overflow-auto lg:h-screen h-[68vh]${
                isSingleRequest ? "lg:h-screen" : ""
              } rounded-lg w-full`}
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="bg-gray-200">
                    <th className="w-20 pl-5 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      #
                    </th>
                    <th className=" py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Request ID
                    </th>
                    <th className=" py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Date of Request
                    </th>
                    <th className=" py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Nature of Request
                    </th>
                    <th className=" py-5 pl-5 text-base font-semibold tracking-wider whitespace-nowrap text-left">
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
                          <div className="absolute right-0 overflow-auto bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
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
                    <th className="w-42 pl-5 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Assigned To
                    </th>
                    <th className="w-42 pl-5 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Date Updated
                    </th>
                    <th
                      className={`w-42 pl-5  py-5 text-base font-semibold tracking-wider whitespace-nowrap text-left`}
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
                            className="h-4 w-4"
                          />
                        </button>
                        {isStatusDropdownOpen && (
                          <div className="absolute right-0 bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg text-center">
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

                    <th className="w-42 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
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
                    filteredRecords.map((setting, index) => (
                      <tr key={setting.id}>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-center">
                          {firstIndex + index + 1}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.id}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.dateRequested}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.natureOfRequest}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.modeOfRequest}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.assignedTo}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.dateUpdated}
                        </td>
                        <td className="border-b-2 pl-5 py-3 pr-16 border-gray-200 text-center">
                          <p
                            className={` rounded-xl lg:px-0 px-3 py-2 ${
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
                                className="text-white text-base bg-gray-400 cursor-not-allowed py-2 px-4 rounded-lg"
                                disabled
                              >
                                View
                              </button>
                            ) : (
                              <button
                                onClick={() => openModal(setting)}
                                className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
                              >
                                View
                              </button>
                            )}
                            {setting.status === "Cancelled" ? (
                              <button
                                className="text-white text-base bg-gray-400 cursor-not-allowed py-2 px-4 rounded-lg"
                                disabled
                              >
                                <FontAwesomeIcon icon={faStar} />
                              </button>
                            ) : (
                              <button className="text-white text-base bg-yellow-500 py-2 px-4 rounded-lg">
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

              {modalType === "ServiceClosed" && (
                <ClosedModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  datas={selectedData}
                  refreshData={fetchData}
                />
              )}
            </div>
          </div>
          <nav
            className={`lg:ml-56 mr-6  ${isWidth1920 ? "lg:mr-10" : "lg:mr-8"}`}
          >
            <ul className="flex gap-2 items-center">
              <li className="flex-auto ml-10 lg:ml-20 mr-5 text-base font-bold">
                Page {currentPage} of {npage}
              </li>
              <li>
                <a
                  href="#"
                  onClick={prePage}
                  className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                >
                  <LeftOutlined />
                </a>
              </li>
              <li className="flex items-center">
                <input
                  type="number"
                  placeholder="Page"
                  className="border rounded-lg bg-gray-100 py-2 px-4 text-black w-24  text-center outline-none"
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
                  className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                >
                  <RightOutlined />
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

export default ServiceTransaction;
