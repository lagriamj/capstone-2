import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RateModal from "../../components/RateModal";
import axios from "axios";
import { Input, Table, Tag } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useAuth } from "../../AuthContext";
import ViewCancel from "../../components/ViewCancel";
import DoneRateModal from "../../components/DoneRateModal";
import ToRateModal from "../../components/ToRateModal";

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
  const [purgedReq, setPurgedReq] = useState(false);

  const [viewRating, setViewRating] = useState(false);
  const [viewRatingModal, setViewRatingModal] = useState(false);

  const [cancel, setCancel] = useState(false);
  const [viewCancel, setViewCancel] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleCancelRequest = (data) => {
    setViewCancel(data);
    setCancel(true);
    setPurgedReq(false);
  };

  const handleViewRequest = (data) => {
    setViewRequest(data);
    setView(true);
    setPurgedReq(false);
  };

  const handlePurgeRequest = (data) => {
    setPurgedReq(data);
    setView(true);
    setPurgedReq(true);
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
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `http://127.0.0.1:8000/api/transaction-list/${userID}/${startDate}/${endDate}`
      );
      setData(result.data.results);
      console.log(result);
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

  const transactionsColumnm = [
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
      title: "Request ID",
      dataIndex: "request_code",
      key: "request_code",
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
    },
    {
      title: "Mode",
      dataIndex: "modeOfRequest",
      key: "modeOfRequest",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
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
          className={`lg:text-base text-sm font-sans w-full text-center py-1 rounded-lg
            ${
              text.status === "Pending"
                ? "bg-red-500 text-white"
                : text.status === "Received"
                ? "bg-orange-500 text-white"
                : text.status === "On Progress"
                ? "bg-yellow-500 text-white"
                : text.status === "To Release"
                ? "bg-green-500 text-white"
                : text.status === "Closed"
                ? "bg-gray-800 text-white"
                : text.status === "Cancelled"
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
          text: "Purge",
          value: "Purge",
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
      key: "",
      render: (index, record) => (
        <div className="flex gap-1">
          {record.status === "Cancelled" ? (
            <button
              className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
              onClick={() => handleCancelRequest(record)}
            >
              View
            </button>
          ) : record.status === "Purge" ? (
            <button
              className="text-white bg-red-500 font-medium px-3 py-2 rounded-lg"
              onClick={() => handlePurgeRequest(record)}
            >
              Purge
            </button>
          ) : (
            <button
              onClick={() => handleViewRequest(record)}
              className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
            >
              View
            </button>
          )}

          {record.status === "Cancelled" ? (
            <button
              className="text-white text-base bg-gray-400 cursor-not-allowed py-2 px-3 rounded-lg"
              disabled
            >
              <FontAwesomeIcon icon={faStar} />
            </button>
          ) : record.status === "Closed" ? (
            doneRating.some((rating) => rating.request_id === record.id) ? (
              <button
                onClick={() => handleViewRating(record.id)}
                className="text-white text-base bg-gray-400 py-2 px-3 rounded-lg"
              >
                <FontAwesomeIcon icon={faStar} />
              </button>
            ) : (
              <button
                onClick={() =>
                  handleStarIconClick(
                    record.id,
                    record.user_id,
                    record.reqOffice
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
                handleStarIconClick(record.id, record.user_id, record.reqOffice)
              }
              className="text-white text-base bg-yellow-500 py-2 px-3 rounded-lg"
            >
              <FontAwesomeIcon icon={faStar} />
            </button>
          )}
        </div>
      ),
    },
  ];

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
              <div className="flex lg:flex-col flex-row lg:gap-0 gap-2">
                <h1 className="flex text-black items-center lg:text-2xl font-semibold ">
                  Transactions
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
                columns={transactionsColumnm}
                dataSource={filteredRequests}
                loading={{
                  indicator: <LoadingOutlined style={{ fontSize: 50 }} />,
                  spinning: loading,
                }}
                pagination={pagination}
                scroll={{ x: 1300 }}
                onChange={(newPagination) => setPagination(newPagination)}
                rowClassName={"p-0"}
                rowKey={(record) => record.id}
              />

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
                <ToRateModal
                  isOpen={view}
                  onClose={() => setView(false)}
                  role={userRole}
                  datas={viewRequest}
                  purged={purgedReq}
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
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Transactions;
