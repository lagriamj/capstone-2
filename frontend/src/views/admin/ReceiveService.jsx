import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ReceiveServiceModal from "../../components/ReceiveServiceModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Skeleton, message } from "antd";
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
  const [isSingleRequest, setIsSingleRequest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popconfirmVisible, setPopconfirmVisible] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
  const isWidth1920 = window.innerWidth === 1920;

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

  const handleOk = (item) => {
    setConfirmLoading(true);
    handleDelete(item);
    handleCancel(item);
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

  const handleDelete = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/delete-receive/${id}`);
      const newUserData = data.filter((item) => item.id !== id);
      setData(newUserData);
    } catch (error) {
      console.error("Error deleting request:", error);
      // Handle the error gracefully, e.g., show an error message to the user
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/pending-request"
      );
      if (response.status === 200) {
        setLoading(false);
        setData(response.data.results);
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

    return matchesSearchQuery;
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
        <title>Receive Service</title>
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
              <h1 className="font-sans lg:text-3xl text-xl mt-8 ml-5 mr-auto tracking-wide">
                Receive
              </h1>
              <div className="relative flex items-center lg:mr-10">
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
                    <th className="w-20 pl-5  py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      #
                    </th>
                    <th className="py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Request ID
                    </th>
                    <th className="py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Property No.
                    </th>
                    <th className=" py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Requesting Office
                    </th>
                    <th className="py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Date
                    </th>
                    <th className=" py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Nature Of Request
                    </th>
                    <th className="py-5 pl-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Requested By
                    </th>
                    <th className="w-56 pl-5  py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
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
                        <td className="border-b-2 pl-5 py-3  border-gray-200 text-center">
                          {firstIndex + index + 1}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.id}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.propertyNo}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.reqOffice}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.dateRequested}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.natureOfRequest}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left">
                          {setting.fullName}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left ">
                          <button
                            className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
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
                              className="text-white text-base bg-red-700 py-2 px-4 rounded-lg ml-1"
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

export default ReceiveService;
