import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ServiceTaskModal from "../../components/ServiceTaskModal";
import ServiceReleaseModal from "../../components/ServiceReleaseModal";
import ReleasedModal from "../../components/ReleasedModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "antd";
import { Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ServiceTask = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isSingleRequest, setIsSingleRequest] = useState(false);
  const [popconfirmVisible, setPopconfirmVisible] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (data) => {
    setSelectedData(data);
    if (data.status === "Received") {
      setModalType("ServiceOnProcess");
    } else if (data.status === "On Process") {
      setModalType("ServiceToRelease");
    } else if (data.status === "To Release") {
      setModalType("ServiceReleased");
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
      await axios.delete(
        `http://127.0.0.1:8000/api/delete-serviced/${id}/${reqID}`
      );
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
        "http://127.0.0.1:8000/api/service-task"
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
  const numbers = [...Array(npage + 1).keys()].slice(1);

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

  return (
    <HelmetProvider>
      <Helmet>
        <title>Task</title>
      </Helmet>
      <div className='className="flex flex-col lg:flex-row bg-gray-200 lg:pl-24 lg:py-10 h-screen"'>
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="overflow-x-auto lg:w-[80%] w-[90%] lg:min-h-[90vh] relative  h-4/5 pb-10 bg-white shadow-xl  lg:ml-72  border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans">
          <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
            <h1 className="font-sans lg:text-3xl text-xl mt-8 ml-5 mr-auto tracking-wide">
              Tasks
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
            className={`overflow-auto min-h-[50vh] ${
              isSingleRequest ? "min-h-[50vh]" : ""
            } rounded-lg w-full`}
          >
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr className="bg-gray-200">
                  <th className="w-10 px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                    #
                  </th>
                  <th className="text-center">Request ID</th>
                  <th className="text-center">Date of Request</th>
                  <th className="text-center">Nature of Request</th>
                  <th className="px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
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
                        <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                      </button>
                      {isModeDropdownOpen && (
                        <div className="absolute right-0 overflow-auto bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
                          <label className="block px-4 py-2">
                            <input
                              type="checkbox"
                              value="Walk-In"
                              checked={selectedModeFilters.includes("Walk-In")}
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
                  <th className="">Assigned To</th>
                  <th
                    className={`px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center`}
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
                        <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
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
                              value="On Process"
                              checked={selectedStatusFilters.includes(
                                "On Process"
                              )}
                              onChange={handleStatusCheckboxChange}
                              className="mr-2"
                            />
                            On Process
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
                  <th className="text-center">Date Updated</th>
                  <th className="w-56 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
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
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        {index + 1}
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        {setting.request_id}
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        {setting.dateRequested}
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        {setting.natureOfRequest}
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        {setting.modeOfRequest}
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        {setting.assignedTo}
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        <p
                          className={` rounded-xl py-2 ${
                            setting.status === "Pending"
                              ? "bg-red-500 text-white" // Apply red background and white text for Pending
                              : setting.status === "Received"
                              ? "bg-orange-500 text-white"
                              : setting.status === "On Progress"
                              ? "bg-yellow-500 text-white" // Apply yellow background and white text for Process
                              : setting.status === "To Release"
                              ? "bg-green-500 text-white" // Apply green background and white text for Done
                              : "bg-gray-200 text-gray-700" // Default background and text color (if none of the conditions match)
                          }`}
                        >
                          {setting.status}
                        </p>
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        {setting.dateUpdated}
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        <button
                          className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
                          onClick={() => openModal(setting)}
                        >
                          Update
                        </button>
                        <Popconfirm
                          placement="left"
                          title="Delete the request"
                          description="Are you sure to delete this request?"
                          open={popconfirmVisible[setting.id]}
                          icon={
                            <QuestionCircleOutlined style={{ color: "red" }} />
                          }
                          onConfirm={() =>
                            handleOk(setting.id, setting.request_id)
                          }
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
            <nav className="absolute bottom-10 right-10">
              <ul className="flex gap-2">
                <li>
                  <a
                    href="#"
                    onClick={prePage}
                    className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                  >
                    Previous
                  </a>
                </li>
                {numbers.map((n, i) => (
                  <li
                    className={`${currentPage === n ? "active" : ""}`}
                    key={i}
                  >
                    <a
                      href="#"
                      onClick={() => changeCPage(n)}
                      className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                    >
                      {n}
                    </a>
                  </li>
                ))}
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
            {modalType === "ServiceOnProcess" && (
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
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default ServiceTask;
