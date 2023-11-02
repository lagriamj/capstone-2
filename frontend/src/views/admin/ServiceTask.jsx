import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ServiceTaskModal from "../../components/ServiceTaskModal";
import ServiceReleaseModal from "../../components/ServiceReleaseModal";
import ReleasedModal from "../../components/ReleasedModal";
import ToRateModal from "../../components/ToRateModal";
import ReceiveServiceModal from "../../components/ReceiveServiceModal";
import ReasonModal from "../../components/ReasonModal";
import ViewCancel from "../../components/ViewCancel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import { Input, Table, Tag, message } from "antd";
import { Popconfirm } from "antd";
import RateModal from "../../components/RateModal";
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../AuthContext";
import CutOffModal from "../../components/CutOffModal";

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
  const { userRole } = useAuth();

  const openModal = (data) => {
    setSelectedData(data);
    if (data.status === "To Rate" && data.modeOfRequest === "Walk-In") {
      setModalType("ToRateWalkin");
    } else if (data.status === "Pending") {
      setModalType("ServicePending");
    } else if (data.status === "Received") {
      setModalType("ServiceReceived");
    } else if (data.status === "On Progress") {
      setModalType("ServiceOnProgress");
    } else if (data.status === "To Release") {
      setModalType("ServiceToRelease");
    } else if (data.status === "To Rate") {
      setModalType("ServiceToRate");
    } else if (data.status === "Closed") {
      setModalType("ServiceClosed");
    }
    setModalOpen(true);
  };

  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);

  const handleStarIconClick = (id, user_id, office) => {
    setSelectedID(id);
    setSelectedUserId(user_id);
    setSelectedOffice(office);
    setRateModalVisible(true);
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

  const handleOk = (id, reqID) => {
    setConfirmLoading(true);
    handleDelete(id, reqID);
    handleCancel(id);
    setTimeout(() => {
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = (index) => {
    const popconfirmVisibleCopy = [...popconfirmVisible];
    popconfirmVisibleCopy[index] = false;
    setPopconfirmVisible(popconfirmVisibleCopy);
  };

  const handleDelete = async (id, reqID) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/delete-serviced/${id}/${reqID}`
      );
      const newUserData = data.filter((item) => item.id !== id);
      setData(newUserData);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const updateTable = () => {
    fetchData();
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const defaultStartDate = new Date(endDate);
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
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
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/service-task-list/${startDate}/${endDate}`;
      const result = await axios.get(url);
      setData(result.data.results);
      setLoading(false);
      console.log(data);
    } catch (err) {
      console.log("Something went wrong:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const [cancel, setCancel] = useState(false);
  const [viewCancel, setViewCancel] = useState(false);
  const handleCancelRequest = (data) => {
    setViewCancel(data);
    setCancel(true);
  };

  const [selectedReason, setSelectedReason] = useState(null);

  const handleReasonModalSubmit = () => {
    fetchData();
    message.success("Request Cancelled Successfully");
  };

  const handleOpenReasonModalClick = (id) => {
    setSelectedReason(id);
  };

  const handleCloseReasonModalClick = () => {
    setSelectedReason(null);
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
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    const intervalId = setInterval(() => {
      setWindowWidth(window.innerWidth);
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalId);
    };
  }, []);

  const [natureRequests, setNatureRequests] = useState("");
  const [natureReqOption, setNatureReqOption] = useState([]);
  const [technicians, setTechnicians] = useState("");
  const [techniciansFilter, setTechniciansFilter] = useState([]);

  useEffect(() => {
    fetchNature();
    fetchTechnicians();
  }, []);

  const fetchNature = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/nature-list`)
      .then((response) => {
        setNatureRequests(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const fetchTechnicians = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/admin-list")
      .then((response) => {
        setTechnicians(response.data.result);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (Array.isArray(natureRequests)) {
      const dynamicFilters = natureRequests.map((natureRequest) => ({
        text: natureRequest.natureRequest,
        value: natureRequest.natureRequest,
      }));
      setNatureReqOption(dynamicFilters);
    }

    if (Array.isArray(technicians)) {
      const techFilter = technicians.map((technician) => ({
        text: technician.userFirstName + technician.userLastName,
        value: technician.userFirstName + technician.userLastName,
      }));
      techFilter.unshift({
        text: "My Tasks",
        value: fullName,
      });

      setTechniciansFilter(techFilter);
    }
  }, [natureRequests, technicians]);

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  const filteredRequests = data.filter((request) => {
    const searchTextLower = searchText.toLowerCase();

    const shouldIncludeRow = Object.values(request).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTextLower);
      } else if (typeof value === "number") {
        return value.toString().toLowerCase().includes(searchTextLower);
      } else if (value instanceof Date) {
        // Handle Date objects
        const formattedDate = value.toLocaleString();
        return formattedDate.toLowerCase().includes(searchTextLower);
      }
      return false;
    });

    return shouldIncludeRow;
  });

  const handleSearchBar = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const requestColumns = [
    {
      title: "#",
      dataIndex: "#",
      key: "#",
      render: (text, record, index) => {
        const currentPage = pagination.current || 1;
        const calculatedIndex =
          (currentPage - 1) * pagination.pageSize + index + 1;
        return <span key={index}>{calculatedIndex}</span>;
      },
    },
    {
      title: "Request Code",
      dataIndex: "request_code",
      key: "request_code",
    },
    {
      title: "Requested By",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Date Requested",
      dataIndex: "dateRequested",
      key: "dateRequested",
      defaultSortOrder: "desc",
      sorter: (a, b) => {
        const dateA = new Date(a.dateRequested);
        const dateB = new Date(b.dateRequested);
        return dateA - dateB;
      },
    },
    {
      title: "Nature of Request",
      dataIndex: "natureOfRequest",
      key: "natureOfRequest",
      filters: natureReqOption,
      filterSearch: true,
      onFilter: (value, record) => record.natureOfRequest?.includes(value),
    },
    {
      title: "Mode",
      dataIndex: "modeOfRequest",
      key: "modeOfRequest",
      filters: [
        {
          text: "Online",
          value: "Online",
        },
        {
          text: "Walk-In",
          value: "Walk-In",
        },
      ],
      onFilter: (value, record) => record.modeOfRequest?.includes(value),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      filters: techniciansFilter,
      onFilter: (value, record) => record.assignedTo === value,
    },
    {
      title: "Date Updated",
      dataIndex: "dateUpdated",
      key: "dateUpdated",
      sorter: (a, b) => {
        const dateA = new Date(a.dateUpdated);
        const dateB = new Date(b.dateUpdated);
        return dateA - dateB;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, index) => (
        <Tag
          key={index}
          className={`lg:text-base text-sm font-sans w-full text-center py-2 rounded-lg
            ${
              text === "Pending"
                ? "bg-red-500 text-white"
                : text === "Received"
                ? "bg-orange-500 text-white"
                : text === "On Progress"
                ? "bg-yellow-500 text-white"
                : text === "To Release"
                ? "bg-green-500 text-white"
                : text === "To Rate"
                ? "bg-blue-500 text-white"
                : text === "Closed"
                ? "bg-gray-800 text-white"
                : text === "Cancelled"
                ? "bg-red-700 text-white"
                : "bg-main text-white"
            }`}
        >
          {text}
        </Tag>
      ),
      filters: [
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Received",
          value: "Received",
        },
        {
          text: "On Progress",
          value: "On Progress",
        },
        {
          text: "To Release",
          value: "To Release",
        },
        {
          text: "To Rate",
          value: "To Rate",
        },
        {
          text: "Closed",
          value: "Closed",
        },
        {
          text: "Cancelled",
          value: "Cancelled",
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.status?.includes(value),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (index, record) => (
        <div className="flex gap-1 py-1" key={index}>
          {record.status === "To Rate" || record.status === "Closed" ? (
            <button
              className={`text-white ${
                isScreenWidth1366 ? "text-xs" : " text-base"
              } bg-blue-500 font-medium px-6 py-2 rounded-lg`}
              onClick={() => openModal(record)}
            >
              View
            </button>
          ) : record.status === "Cancelled" ? (
            <button
              className={`text-white ${
                isScreenWidth1366 ? "text-xs" : " text-base"
              } bg-blue-500 font-medium px-5 py-2 rounded-lg`}
              onClick={() => handleCancelRequest(record)}
            >
              View
            </button>
          ) : (
            <button
              className={`text-white ${
                isScreenWidth1366 ? "text-xs" : " text-base"
              } bg-blue-500 font-medium px-3 py-2 rounded-lg`}
              onClick={() => openModal(record)}
            >
              Update
            </button>
          )}
          {record.status === "Pending" ||
          record.status === "Received" ||
          record.status === "On Progress" ? (
            <Popconfirm
              placement="left"
              title="Confirmation"
              description="Please confirm this action. This action cannot be undone."
              open={popconfirmVisible[record.id]}
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => handleOk(record.id, record.request_id)}
              okButtonProps={{
                loading: confirmLoading,
                color: "red",
                className: "text-black border-1 border-gray-300",
                size: "large",
              }}
              cancelButtonProps={{
                size: "large",
              }}
              onCancel={() => handleCancel(record.id)}
              okText="Yes"
            >
              <button
                onClick={() => handleOpenReasonModalClick(record.id)}
                className={`text-white text-base py-2 px-4 rounded-lg ${
                  record.status !== "Pending" &&
                  record.status !== "Received" &&
                  record.status !== "On Progress"
                    ? "cursor-not-allowed bg-gray-400" // Apply styles for other statuses
                    : "bg-red-700" // Styles for the delete button when status is Pending, Received, or On Progress
                }`}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </Popconfirm>
          ) : record.status === "To Rate" &&
            record.modeOfRequest === "Walk-In" ? (
            <button
              onClick={() =>
                handleStarIconClick(
                  record.request_id,
                  record.user_id,
                  record.reqOffice
                )
              }
              className="text-white text-base py-2 px-4 rounded-lg bg-yellow-500"
            >
              <FontAwesomeIcon icon={faStar} />
            </button>
          ) : (
            <button className="text-white text-base py-2 px-4 rounded-lg cursor-not-allowed bg-gray-400">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const [openCutOffModal, setOpenCutOffModal] = useState(false);

  const closeCutOffModal = () => {
    setOpenCutOffModal(!openCutOffModal);
  };

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
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%]  h-auto lg:ml-auto lg:mx-4   lg:mt-0 mt-20  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <div className="flex lg:flex-col flex-row lg:gap-0 gap-2">
                <h1 className="flex text-black items-center lg:text-2xl font-semibold ">
                  Requests List
                </h1>
                <span className="text-black mr-auto">
                  Total Requests: {data.length}
                </span>
              </div>

              <div className="relative flex items-center justify-center lg:mr-auto lg:ml-4 ">
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => handleSearchBar(e.target.value)}
                  className="my-4 h-12"
                />
              </div>
              <button
                className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenCutOffModal(true);
                }}
              >
                Set Cut-Off Time
              </button>
              <CutOffModal
                isOpen={openCutOffModal}
                onClose={closeCutOffModal}
              />
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
              <Table
                columns={requestColumns}
                dataSource={filteredRequests}
                loading={{
                  indicator: <LoadingOutlined style={{ fontSize: 50 }} />,
                  spinning: loading,
                }}
                pagination={pagination}
                scroll={{ x: 1300 }}
                onChange={(newPagination) => setPagination(newPagination)}
                rowClassName={"p-0"}
                rowKey={(record) => record.request_id}
              />

              {selectedReason && (
                <ReasonModal
                  display={true}
                  itemData={data.find((item) => item.id === selectedReason)}
                  onClose={handleCloseReasonModalClick} // Pass the callback here
                  isLargeScreen={isLargeScreen}
                  refreshData={fetchData}
                  role={userRole}
                  name={fullName}
                  onSubmit={handleReasonModalSubmit}
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

              {modalType === "ServicePending" && (
                <ReceiveServiceModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  data={selectedData}
                  refreshData={updateTable}
                />
              )}

              {modalType === "ServiceReceived" && (
                <ServiceTaskModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  data={selectedData}
                  refreshData={fetchData}
                />
              )}

              {modalType === "ServiceOnProgress" && (
                <ServiceReleaseModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  data={selectedData}
                  refreshData={fetchData}
                  isLargeScreen={isLargeScreen}
                />
              )}
              {modalType === "ServiceToRelease" && (
                <ReleasedModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  data={selectedData}
                  refreshData={fetchData}
                />
              )}
              {modalType === "ServiceToRate" && (
                <ToRateModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  role={userRole}
                  datas={selectedData}
                  refreshData={fetchData}
                />
              )}
              {modalType === "ServiceClosed" && (
                <ToRateModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  role={userRole}
                  datas={selectedData}
                  refreshData={fetchData}
                />
              )}
              {rateModalVisible && (
                <RateModal
                  isOpen={rateModalVisible}
                  onClose={() => setRateModalVisible(false)}
                  id={selectedID}
                  user_id={selectedUserId}
                  office={selectedOffice}
                  role={userRole}
                  isScreenWidth1366={isScreenWidth1366}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};
export default ServiceTask;
