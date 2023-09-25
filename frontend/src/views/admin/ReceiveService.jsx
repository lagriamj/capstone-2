import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ReceiveServiceModal from "../../components/ReceiveServiceModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faFilter } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "antd";
import { Popconfirm } from "antd";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";

const ReceiveService = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popconfirmVisible, setPopconfirmVisible] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSortOrder, setSelectedDateOrder] = useState("desc");
  const [isDateSortingDropdownOpen, setIsDateSortingDropdownOpen] =
    useState(false);

  const handleDateOrderChange = (order) => {
    setSelectedDateOrder(order);
    setIsDateSortingDropdownOpen(false);
  };

  const openModal = (data) => {
    setSelectedData(data);
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
    setPopconfirmVisible(new Array(data.length).fill(false));
  }, [data]);

  const showPopconfirm = (id) => {
    const popconfirmVisibleCopy = [...popconfirmVisible];
    popconfirmVisibleCopy[id] = true;
    setPopconfirmVisible(popconfirmVisibleCopy);
    setTimeout(() => {
      setPopconfirmVisible(false);
    }, 5000);
  };

  const handleOk = (item) => {
    setConfirmLoading(true);
    handleDelete(item);
    handleCancel(item);
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = (index) => {
    const popconfirmVisibleCopy = [...popconfirmVisible];
    popconfirmVisibleCopy[index] = false;
    setPopconfirmVisible(popconfirmVisibleCopy);
  };

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/delete-receive/${id}`);
      const newUserData = data.filter((item) => item.id !== id);
      setData(newUserData);
    } catch (error) {
      console.error("Error deleting request:", error);
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
  }, [startDate, endDate, selectedSortOrder, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const urlSegments = ["http://127.0.0.1:8000/api/pending-request"];

      if (startDate) {
        urlSegments.push(startDate);
      }
      if (endDate) {
        urlSegments.push(endDate);
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

      console.log("URL:", cleanedUrl);

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

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 10;

  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPage);

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

  //-----------------------------------------------------
  const [pageInput, setPageInput] = useState("");

  const goToPage = () => {
    const pageNumber = parseInt(pageInput);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= npage) {
      setCurrentPage(pageNumber);
      setPageInput("");
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
        <title>Receive Service</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col gotoLarge:px-6 large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto lg:ml-auto lg:mx-4 mt-20  lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <h1 className="flex text-black items-center lg:text-2xl text-base font-semibold ">
                Receive Service
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
                      className={`w-20 pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      #
                    </th>
                    <th
                      className={` pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Request ID
                    </th>
                    <th
                      className={`pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Property No.
                    </th>
                    <th
                      className={` pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Requesting Office
                    </th>
                    <th
                      className={`pl-5 px-3 py-5 relative large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Date Requested
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
                      className={`pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Nature Of Request
                    </th>
                    <th
                      className={`pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Requested By
                    </th>
                    <th
                      className={`w-56 pl-5  px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
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
                          className={`border-b-2 pl-5  py-2 large:py-3 large:text-lg text-sm  border-gray-200 text-left`}
                        >
                          {firstIndex + index + 1}
                        </td>
                        <td
                          className={`border-b-2 pl-5  py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.id}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.propertyNo}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {setting.reqOffice}
                        </td>
                        <td
                          className={`border-b-2 pl-5  py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left whitespace-nowrap`}
                        >
                          {setting.dateRequested}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left whitespace-nowrap`}
                        >
                          {setting.natureOfRequest}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left whitespace-nowrap`}
                        >
                          {setting.fullName}
                        </td>
                        <td
                          className={`border-b-2 pl-5 py-2 large:py-3 large:text-lg text-sm flex  border-gray-200 text-left `}
                        >
                          <button
                            className={`text-white bg-blue-500  py-2 large:py-3 large:text-base text-xs font-medium px-3  rounded-lg`}
                            onClick={() => openModal(setting)}
                          >
                            View
                          </button>
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
                            onConfirm={() => handleOk(setting.id)}
                            okButtonProps={{
                              loading: confirmLoading,
                              color: "red",
                              className: "text-black border-1 border-gray-300",
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
                              className={`text-white  ${
                                isScreenWidth1366 ? "text-xs" : " text-base"
                              } bg-red-700 py-2 px-4 rounded-lg ml-1`}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </Popconfirm>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <ReceiveServiceModal
              isOpen={isModalOpen}
              onClose={closeModal}
              data={selectedData}
            />
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
                    onKeyDown={handlePageInputKeyPress}
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

export default ReceiveService;
