/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Modal, Button, Badge, Dropdown, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import axios from "axios";
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from "recharts";
import BarGraph from "../../components/BarGraph";
import { useNavigate } from "react-router-dom";
import { NotificationOutlined } from "@ant-design/icons";
import { FolderPlusIcon } from "@heroicons/react/24/solid";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { DocumentCheckIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import { FaceSmileIcon } from "@heroicons/react/24/solid";
import { FaceFrownIcon } from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { PresentationChartLineIcon } from "@heroicons/react/24/solid";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import TechnicianPerformance from "../../components/TechnicianPerformance";
import { useActiveTab } from "../../ActiveTabContext";
import SummaryListModal from "../../components/SummaryListModal";
import PieChartModal from "../../components/PieChartModal";

const Dashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    countPending: 0,
    countRequest: 0,
    countClosed: 0,
  });
  const [requestDetails, setRequestDetails] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const navigate = useNavigate();
  const { setActive } = useActiveTab();

  const handleServiceTaskClick = () => {
    navigate("/service-task");
    setActive("service-task");
  };

  const elementRef = useRef(null);

  useEffect(() => {
    // Access the DOM element and measure its height
    if (elementRef.current) {
      const heightInPixels = elementRef.current.offsetHeight;
      console.log("Element height:", heightInPixels, "pixels");
    }
  }, []);

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
    async function fetchData() {
      try {
        // Make an asynchronous GET request to your Laravel route
        const response = await axios.get(
          "http://127.0.0.1:8000/api/count-requests"
        );
        setCounts(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching counts:", error);
      }
    }

    fetchData();
  }, []);

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
    fetchRequestDetails();
    async function fetchRequestDetails() {
      try {
        const requestDetailsResponse = await fetch(
          "http://127.0.0.1:8000/api/pending-request"
        );

        if (requestDetailsResponse.ok) {
          const requestDetailsData = await requestDetailsResponse.json();
          setRequestDetails(requestDetailsData.results);
        } else {
          console.error("Failed to fetch request details");
        }
      } catch (error) {
        console.error("Error fetching request details:", error);
      }
    }
  }, []);

  const openModal = (data) => {
    setSelectedData(data);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedData(null);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    closeModal();
  };

  const isLargeScreen = windowWidth >= 1024;

  useEffect(() => {
    const handleResize = () => {
      setWindowsHeight768(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [windowsHeight768, setWindowsHeight768] = useState(window.innerHeight);

  const isWindowsHeightBelow768 = windowsHeight768 <= 768;

  const [ratingsAndNature, setRatingsAndNature] = useState({
    topNature: [],
    totalRatings: 0,
    satisfiedRating: 0,
    unsatisfiedRating: 0,
  });

  console.log(ratingsAndNature.topNature);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/calculate-rating"
        );
        setRatingsAndNature(response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    }

    fetchData();
  }, []); // The empty array [] ensures the effect runs only once

  const [startDate, setStartDate] = useState("");
  const [technicianData, setTechnicianData] = useState(null);
  const [percentData, setPercentData] = useState({
    pendingRequests: 0,
    receivedRequests: 0,
    onprogressRequests: 0,
    toreleaseRequests: 0,
    closedRequests: 0,
  });

  const [totalAndClosed, setTotalAndClosed] = useState({
    totalRequests: 0,
    closedRequests: 0,
  });

  const [requestsByDate, setRequestsByDate] = useState(null);
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
    fetchPiegraphDetails();
    fetchDataRequest();
    fetchTotalAndClosed();
  }, [startDate, endDate]);

  const fetchDataRequest = async () => {
    try {
      const techResponse = await axios.get(
        `http://127.0.0.1:8000/api/technician-performance/${startDate}/${endDate}`
      );
      setTechnicianData(techResponse.data.Technician);

      const requestsResponse = await axios.get(
        `http://127.0.0.1:8000/api/requestsByDate/${startDate}/${endDate}`
      );
      setRequestsByDate(requestsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPiegraphDetails = async () => {
    try {
      const percentResponse = await axios.get(
        `http://127.0.0.1:8000/api/percent-accomplished/${startDate}/${endDate}`
      );
      setPercentData(percentResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTotalAndClosed = async () => {
    try {
      const totalAndClosedRes = await axios.get(
        `http://127.0.0.1:8000/api/totalRequests-And-Closed/${startDate}/${endDate}`
      );
      setTotalAndClosed(totalAndClosedRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const pieTotalAndClosed = [
    {
      name: "Total",
      value: totalAndClosed?.totalRequests,
      fill: "#8884d8",
    },
    {
      name: "Closed",
      value: totalAndClosed?.closedRequests,
      fill: "#82ca9d",
    },
  ];

  const pieChartData = [
    {
      name: "Pending ",
      value: percentData?.pendingRequests,
      fill: "#FF5733", // Red
    },
    {
      name: "Received",
      value: percentData?.receivedRequests,
      fill: "#FFA500", // Orange
    },
    {
      name: "On Progress",
      value: percentData?.onprogressRequests,
      fill: "#8B8B00", // Yellow
    },
    {
      name: "To Release",
      value: percentData?.toreleaseRequests,
      fill: "#008000", // Green
    },
    {
      name: "To Rate",
      value: percentData?.torateRequests,
      fill: "#0000FF", // Blue
    },
    {
      name: "Closed ",
      value: percentData?.closedRequests,
      fill: "#808080", // Gray
    },
  ];

  const formattedTotalRatings =
    ratingsAndNature.totalRating !== null
      ? ratingsAndNature.totalRatings?.toFixed(2)
      : null;
  const formattedTotalSatisfied =
    ratingsAndNature.totalSatisfied !== null
      ? ratingsAndNature.satisfiedRating?.toFixed(2)
      : null;
  const formattedTotalUnsatisfied =
    ratingsAndNature.totalUnsatisfied !== null
      ? ratingsAndNature.unsatisfiedRating?.toFixed(2)
      : null;

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Define the font size for the text
    const fontSize = 12; // You can adjust this value as needed

    // Check if percent is non-zero before rendering
    if (percent > 0) {
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={fontSize} // Set the font size here
        >
          {`${(percent * 100).toFixed(0)}% `}
        </text>
      );
    }

    // Return null if percent is zero
    return null;
  };

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const modalRef = useRef(null);

  const [selectedDataSources, setSelectedDataSources] = useState([
    "technicianData", // Default selection
  ]);

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsFilterModalVisible(false);
    }
  };

  useEffect(() => {
    if (isFilterModalVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isFilterModalVisible]);

  const toggleDataSource = (dataSource) => {
    setSelectedDataSources([dataSource]);
    setIsFilterModalVisible(false);
  };

  const formatter = (value) => {
    return <span className="text-[16px] text-black">{value}</span>;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [clickedPortion, setClickedPortion] = useState(null);
  const [tableColumns, setTableColumns] = useState([]);
  const [modalTitle, setModalTitle] = useState(null);

  const handlePieClick = (entry) => {
    axios
      .get(
        `http://127.0.0.1:8000/api/status-description/${entry.name}/${startDate}/${endDate}`
      )
      .then((response) => {
        const formattedData = response.data.requestData.map((item, index) => ({
          key: index,
          id: item.id,
          fullName: item.fullName,
          reqOffice: item.reqOffice,
          division: item.division,
          natureOfRequest: item.natureOfRequest,
          unit: item.unit,
          serialNo: item.serialNo,
          propertyNo: item.propertyNo,
          dateRequested: item.dateRequested,
          dateUpdated: item.dateUpdated,
        }));
        const percentage = Math.round(
          (entry.value /
            pieChartData.reduce((total, data) => total + data.value, 0)) *
            100
        );

        setModalTitle(percentage);
        setModalData(formattedData);
        setModalVisible(true);
        setClickedPortion(entry.name);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setModalVisible(true);
  };

  const closePieModal = () => {
    setModalVisible(false);
    setClickedPortion(null);
  };

  useEffect(() => {
    const columnsForPie = [
      {
        title: "Request Code",
        dataIndex: "request_code",
        key: "request_code",
      },
      { title: "Requested By", dataIndex: "fullName", key: "fullName" },
      {
        title: "Request Office",
        dataIndex: "reqOffice",
        key: "reqOffice",
      },
      { title: "Division", dataIndex: "division", key: "division" },
      {
        title: "Nature of Request",
        dataIndex: "natureOfRequest",
        key: "natureOfRequest",
      },
      { title: "Unit", dataIndex: "unit", key: "unit" },
      { title: "Serial No.", dataIndex: "serialNo", key: "serialNo" },
      { title: "Property No.", dataIndex: "propertyNo", key: "propertyNo" },
      {
        title: "Date Requested",
        dataIndex: "dateRequested",
        key: "dateRequested",
        sorter: (a, b) => a.dateRequested.localeCompare(b.dateRequested),
      },
      {
        title: "Date Updated",
        dataIndex: "dateUpdated",
        key: "dateUpdated",
        sorter: (a, b) => a.dateUpdated.localeCompare(b.dateUpdated),
      },

      // Add more columns as needed
    ];

    setTableColumns(columnsForPie);
  }, []);

  function TextTruncate({ text, maxLength }) {
    const [isTruncated, setIsTruncated] = useState(true);

    const toggleTruncate = () => {
      setIsTruncated(!isTruncated);
    };

    return (
      <div>
        {isTruncated ? (
          <div>
            {text.length > maxLength ? (
              <>
                {text.slice(0, maxLength)}
                <span
                  onClick={toggleTruncate}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  ...Show more
                </span>
              </>
            ) : (
              text
            )}
          </div>
        ) : (
          <div>
            {text}
            <span
              onClick={toggleTruncate}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Show less
            </span>
          </div>
        )}
      </div>
    );
  }

  const [isBelow800, setIsBelow800] = useState(false);

  useEffect(() => {
    function checkScreenHeight() {
      if (window.innerHeight < 800) {
        setIsBelow800(true);
      } else {
        setIsBelow800(false);
      }
    }

    window.addEventListener("resize", checkScreenHeight);

    checkScreenHeight();

    return () => {
      window.removeEventListener("resize", checkScreenHeight);
    };
  }, []);

  const [techPerformanceModal, setTechPerformanceModal] = useState(false);

  const closeTechPerformanceModal = () => {
    setTechPerformanceModal(!techPerformanceModal);
  };

  const [open, setOpen] = useState(false);
  const handleMenuClick = () => {
    setOpen(false);
  };

  const [summaryListModal, setSummaryListModal] = useState(false);

  const closeSummaryListModal = () => {
    setSummaryListModal(!summaryListModal);
  };

  const items = [
    {
      label: (
        <div
          onClick={() => {
            setTechPerformanceModal(true);
          }}
          className="flex gap-2 items-center justify-start cursor-pointer w-full"
        >
          <PresentationChartLineIcon className="h-4 w-4 text-main" />
          <label className="cursor-pointer">Technician Performance</label>
        </div>
      ),
      key: "1",
    },
    {
      label: (
        <div
          onClick={() => {
            setSummaryListModal(true);
          }}
          className="flex gap-2 items-center justify-start cursor-pointer w-full"
        >
          <ClipboardDocumentIcon className="h-4 w-4 text-main" />
          <label className="cursor-pointer">Summary List</label>
        </div>
      ),
      key: "2",
    },
    {
      label: "Example 2",
      key: "3",
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>
          Dashboard
          {requestDetails.length > 0 ? `(${requestDetails.length})` : ""}
        </title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col overflow-auto gotoLarge:px-6 bg-gray-200 large:ml-20 lg:flex-row white pt-2  h-screen`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start  bg-gray-200 gap-2 w-full">
          <div
            className={` w-[90%] lg:w-[80%] large:w-[85%] large:h-[95vh] h-auto lg:ml-auto lg:mx-4 mt-20  lg:mt-0   justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div
                ref={elementRef}
                className="w-full lg:h-screen h-auto flex flex-col  lg:grid lg:grid-cols-7 lg:grid-rows-5 gap-x-3 "
              >
                <div className="lg:grid lg:col-span-5 lg:row-span-1 lg:h-[90%] lg:py-2 pt-10  rounded-lg bg-white text-black font-sans">
                  <div className="grid w-full lg:grid-rows-2 lg:grid-cols-1 grid-cols-2 grid-rows-1  px-4  lg:mb-0 mb-20  lg:pl-20 lg:pr-10">
                    <div className="lg:grid lg:grid-cols-3 ">
                      <div
                        className=" flex w-full gap-2 lg:mt-0 mt-2 items-center text-left cursor-pointer"
                        onClick={() => {
                          handleServiceTaskClick();
                        }}
                      >
                        <div
                          className={`bg-[#fff4de] rounded-xl ${
                            isBelow800 ? "p-3" : "p-4"
                          }`}
                        >
                          <FolderPlusIcon
                            className={`${
                              isBelow800 ? "h-5 w-5" : "h-7 w-7"
                            } text-[#ff947a]`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label>New</label>
                          <label>{counts.countPending}</label>
                        </div>
                      </div>
                      <div
                        className=" flex w-full gap-2 lg:mt-0 mt-2 items-center text-left cursor-pointer"
                        onClick={() => {
                          handleServiceTaskClick();
                        }}
                      >
                        <div
                          className={`bg-[#dcfce7] rounded-xl ${
                            isBelow800 ? "p-3" : "p-4"
                          }`}
                        >
                          <WrenchScrewdriverIcon
                            className={`${
                              isBelow800 ? "h-5 w-5" : "h-7 w-7"
                            } text-[#3cd958]`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label>Received</label>
                          <label>{counts.countReceived}</label>
                        </div>
                      </div>
                      <div
                        className=" flex w-full gap-2 lg:mt-0 mt-2 items-center text-left cursor-pointer"
                        onClick={() => {
                          handleServiceTaskClick();
                        }}
                      >
                        <div
                          className={`bg-[#e9d5fe] rounded-xl ${
                            isBelow800 ? "p-3" : "p-4"
                          }`}
                        >
                          <DocumentCheckIcon
                            className={`${
                              isBelow800 ? "h-5 w-5" : "h-7 w-7"
                            } text-[#bf83ff]`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label>Closed</label>
                          <label>{counts.countClosed}</label>
                        </div>
                      </div>
                    </div>
                    <div className="lg:grid lg:grid-cols-3">
                      <div className=" flex w-full lg:mt-0 mt-2 gap-2 items-center text-left cursor-pointer">
                        <div
                          className={`bg-[#fff4de] rounded-xl ${
                            isBelow800 ? "p-3" : "p-4"
                          }`}
                        >
                          <StarIcon
                            className={`${
                              isBelow800 ? "h-5 w-5" : "h-7 w-7"
                            } text-[#ff947a]`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label>Overall Rating</label>
                          <label>{formattedTotalRatings}%</label>
                        </div>
                      </div>
                      <div className=" flex w-full lg:mt-0 mt-2 gap-2 items-center text-left cursor-pointer">
                        <div
                          className={`bg-[#dcfce7] rounded-xl ${
                            isBelow800 ? "p-3" : "p-4"
                          }`}
                        >
                          <FaceSmileIcon
                            className={`${
                              isBelow800 ? "h-5 w-5" : "h-7 w-7"
                            } text-[#3cd958]`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label>Satisfied</label>
                          <label>{formattedTotalSatisfied}%</label>
                        </div>
                      </div>
                      <div className=" flex w-full lg:mt-0 mt-2 gap-2 items-center text-left cursor-pointer">
                        <div
                          className={`bg-[#e9d5fe] rounded-xl ${
                            isBelow800 ? "p-3" : "p-4"
                          }`}
                        >
                          <FaceFrownIcon
                            className={`${
                              isBelow800 ? "h-5 w-5" : "h-7 w-7"
                            } text-[#bf83ff]`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label>Unsatisfied</label>
                          <label>{formattedTotalUnsatisfied}%</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 flex lg:flex-row flex-col   row-span-2  rounded-lg row-start-2 ">
                  <div className=" bg-white lg:w-[49%] mr-2 w-full rounded-lg shadow-md">
                    <div className="flex gap-2 w-full">
                      <label className="text-lg font-medium pl-4 pt-2 flex ">
                        Closed and Unclosed Requests
                      </label>
                    </div>
                    <ResponsiveContainer
                      width="100%"
                      height={isLargeScreen ? "90%" : 300}
                    >
                      <PieChart width={600} height={600}>
                        <Pie
                          dataKey="value"
                          data={pieTotalAndClosed}
                          isAnimationActive={true}
                          cx="50%"
                          cy="50%"
                          fill="color"
                          label={renderCustomizedLabel}
                          labelLine={false}
                        />
                        <Tooltip />
                        <Legend formatter={formatter} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className=" bg-white lg:w-[50%] w-full rounded-lg shadow-md">
                    <label className="text-lg font-medium pl-4 pt-2 flex ">
                      Request Status Overview
                    </label>
                    <ResponsiveContainer
                      width="100%"
                      height={isLargeScreen ? "90%" : 300}
                    >
                      <PieChart width={600} height={600}>
                        <Pie
                          labelLine={false}
                          dataKey="value"
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          label={renderCustomizedLabel}
                          onClick={handlePieClick}
                        />
                        <Tooltip />
                        <Legend formatter={formatter} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* modal for clicking the pie chart */}
                    <PieChartModal
                      modalVisible={modalVisible}
                      closePieModal={closePieModal}
                      modalTitle={modalTitle}
                      clickedPortion={clickedPortion}
                      modalData={modalData}
                      tableColumns={tableColumns}
                      isLargeScreen={isLargeScreen}
                      fromDate={startDate}
                      toDate={endDate}
                    />
                  </div>
                </div>
                <div className="relative lg:col-span-5  flex flex-col mediumLg:mt-2 large:mt-3 mt-4 px-4  row-span-2 rounded-lg shadow-md  bg-white">
                  <Dropdown
                    menu={{
                      items,
                      onClick: handleMenuClick,
                    }}
                    open={open}
                    placement="bottomRight"
                    className="absolute top-1 right-0"
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <EllipsisVerticalIcon
                          onClick={() => {
                            setOpen(!open);
                          }}
                          className="h-6 w-6 mt-2 absolute top-0 right-0"
                        />
                      </Space>
                    </a>
                  </Dropdown>
                  <TechnicianPerformance
                    isOpen={techPerformanceModal}
                    onClose={closeTechPerformanceModal}
                    isLargeScreen={isLargeScreen}
                    startDate={startDate}
                    endDate={endDate}
                  />
                  <SummaryListModal
                    isOpen={summaryListModal}
                    onClose={closeSummaryListModal}
                    isLargeScreen={isLargeScreen}
                    startDate={startDate}
                    endDate={endDate}
                  />
                  <div className="w-full  flex lg:flex-row flex-col gap-2 px-2 py-3 mediumLg:pt-1 justify-end">
                    {" "}
                    <div className="px-3 gotoLarge:py-3 py-1 relative whitespace-nowrap flex items-center gap-2 pb-2 font-sans font-semibold text-lg mr-auto">
                      <h1>Requests Statistics </h1>
                      <FontAwesomeIcon
                        icon={faFilter}
                        onClick={toggleFilterModal}
                        style={{ cursor: "pointer" }}
                      />
                      {isFilterModalVisible && (
                        <div
                          ref={modalRef}
                          className="absolute right-0 top-9 z-50 overflow-auto text-start bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg"
                        >
                          <label className="block px-4 py-2">
                            <input
                              type="checkbox"
                              name="dataSource"
                              value="technicianData"
                              checked={selectedDataSources.includes(
                                "technicianData"
                              )}
                              onChange={() =>
                                toggleDataSource("technicianData")
                              }
                              className="mr-2"
                            />
                            By Technician
                          </label>
                          <label className="block px-4 py-2">
                            <input
                              type="checkbox"
                              name="dataSource"
                              value="requestsByDate"
                              checked={selectedDataSources.includes(
                                "requestsByDate"
                              )}
                              onChange={() =>
                                toggleDataSource("requestsByDate")
                              }
                              className="mr-2"
                            />
                            By Date
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 items-center lg:justify-center justify-end lg:mr-0 mr-2">
                      <label
                        htmlFor="startDate"
                        className="large:text-lg mediumLg:text-sm lg:text-base"
                      >
                        From
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border-2 border-gray-700  rounded-lg px-1 large:text-lg mediumLg:text-sm w-36 lg:text-base "
                      />
                    </div>
                    <div className="flex gap-1 items-center lg:justify-center justify-end lg:mb-0 mb-auto lg:mr-0 mr-2">
                      <label
                        htmlFor="endDate"
                        className="large:text-lg mediumLg:text-sm lg:text-base"
                      >
                        To
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border-2 border-gray-700  rounded-lg px-1 large:text-lg mediumLg:text-sm w-36 lg:text-base "
                      />
                    </div>
                  </div>

                  <BarGraph
                    data={
                      selectedDataSources.includes("technicianData")
                        ? technicianData
                        : selectedDataSources.includes("requestsByDate")
                        ? requestsByDate
                        : technicianData
                    }
                    values1={
                      selectedDataSources.includes("technicianData")
                        ? "closed"
                        : selectedDataSources.includes("requestsByDate")
                        ? "closedBydate"
                        : "closed"
                    }
                    values2={
                      selectedDataSources.includes("technicianData")
                        ? "unclosed"
                        : selectedDataSources.includes("requestsByDate")
                        ? "unclosedBydate"
                        : "unclosed"
                    }
                    xValue={
                      selectedDataSources.includes("technicianData")
                        ? "assignedTo"
                        : selectedDataSources.includes("requestsByDate")
                        ? "date"
                        : "assignedTo"
                    }
                    windowsHeight768={isWindowsHeightBelow768}
                  />
                </div>
                <div className="text-black font-sans overflow-auto lg:mt-0 mt-3  bg-white shadow-md rounded-lg lg:col-start-6 lg:col-span-2  lg:row-start-1 lg:row-span-3 ">
                  <div className="flex flex-col">
                    <div className="flex items-center border-b-2 gap-2 border-gray-400 py-3 pl-4">
                      <Badge count={requestDetails.length} size="small">
                        <NotificationOutlined
                          style={{
                            fontSize: 16,
                          }}
                        />
                      </Badge>
                      <Badge className="lg:text-lg text-base font-sans">
                        Recent Requests
                      </Badge>
                    </div>
                    {requestDetails.map((request) => (
                      <div
                        key={request.id}
                        className="mb-5 pb-2 large:text-lg border-b-2 border-gray-400"
                      >
                        <div className="grid grid-cols-2 px-2">
                          <p className="whitespace-nowrap">
                            {" "}
                            {request.fullName}
                          </p>
                          <p className="text-right"> {request.dateRequested}</p>
                        </div>
                        <div className="grid grid-cols-2 mt-2 px-2">
                          <p className="">{request.natureOfRequest}</p>

                          <button
                            className="text-blue-400 text-right"
                            onClick={() => openModal(request)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lg:grid lg:col-start-6 lg:col-span-2 lg:row-start-4 mt-2 lg:row-span-2">
                  <div className="bg-white  w-full rounded-lg shadow-md font-sans large:text-xl gotoLarge:text-lg mediumLg:text-sm lg:text-base">
                    <h1 className="p-3 text-center font-semibold border-b-2 border-gray-400 ">
                      Top 3 Nature of Requests
                    </h1>
                    <ul className="flex flex-col gap-4 gap-y-10 pt-4 gotoLarge:gap-y-12 gotoLarge:pt-14 font-medium   mediumLg:gap-y-4 mediumLg:pt-6 large:gap-y-14 large:pt-10 p-4 ">
                      {ratingsAndNature.topNature.map(
                        (natureOfRequest, index) => (
                          <li className="flex  gap-4" key={index}>
                            <span key={index}>
                              {index === 0 ? (
                                <Filter1Icon
                                  style={{
                                    fontSize: 18,
                                  }}
                                />
                              ) : index === 1 ? (
                                <Filter2Icon
                                  style={{
                                    fontSize: 18,
                                  }}
                                />
                              ) : index === 2 ? (
                                <Filter3Icon
                                  style={{
                                    fontSize: 18,
                                  }}
                                />
                              ) : (
                                ""
                              )}
                            </span>{" "}
                            {natureOfRequest.natureOfRequest}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        title={
          <div className="flex lg:flex-row flex-col items-center">
            <h1 className="text-xl my-4 pb-2 font-bold font-sans">
              Request ID: E-{selectedData?.id}
            </h1>
            <div className="flex gap-2 lg:ml-auto">
              <label className="text-lg my-4 pb-2 font-bold font-sans">
                Date of Request:{" "}
              </label>
              <label className="text-lg my-4 pb-2 font-bold font-sans">
                {selectedData?.dateRequested}
              </label>
            </div>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        width={`${isLargeScreen ? "65%" : "90%"}`}
        footer={[
          <Button
            key=""
            onClick={() => {
              navigate("/service-task");
              setActive("service-task");
            }}
            className="bg-main text-white h-9 "
          >
            Go To
          </Button>,
          <Button
            key="close"
            onClick={handleCancel}
            className="bg-white text-black border-2 border-main h-9"
          >
            Close
          </Button>,
        ]}
      >
        {selectedData && (
          <div className="lg:grid lg:grid-cols-2 flex flex-col gap-x-2 mediumLg:text-xl gap-y-4 border-t-2 border-gray-400 pt-6 font-sans">
            <div className="grid grid-cols-2">
              <label className="font-semibold">Full Name: </label>
              <label>{selectedData.fullName}</label>
            </div>
            <div className="grid grid-cols-2">
              <label className="font-semibold">Requesting Office: </label>
              <label>{selectedData.reqOffice}</label>
            </div>
            <div className="grid grid-cols-2">
              <label className="font-semibold">Requesting Division: </label>
              <label>{selectedData.division}</label>
            </div>
            <div className="grid grid-cols-2">
              <label className="font-semibold">Nature of Request: </label>
              <label>{selectedData.natureOfRequest}</label>
            </div>
            <div className="grid grid-cols-2">
              <label className="font-semibold">Mode of Request: </label>
              <label>{selectedData.modeOfRequest}</label>
            </div>
            <div className="grid grid-cols-2">
              <label className="font-semibold">Unit: </label>
              <label>{selectedData.unit}</label>
            </div>
            <div className="grid grid-cols-2">
              <label className="font-semibold">Property No: </label>
              <label>{selectedData.propertyNo}</label>
            </div>
            <div className="grid grid-cols-2">
              <label className="font-semibold">Serial No: </label>
              <label>{selectedData.serialNo}</label>
            </div>

            <div className="grid grid-cols-2">
              <label className="font-semibold">Date Procured: </label>
              <label>{selectedData.dateProcured}</label>
            </div>
            <div className="col-span-2 mt-5">
              <label className="font-semibold">Special Instruction: </label>
              <TextTruncate
                text={selectedData.specialIns || "No data"}
                maxLength={150}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <label className="font-semibold">Authorized By: </label>
              <label>{selectedData.authorizedBy}</label>
            </div>
          </div>
        )}
      </Modal>
    </HelmetProvider>
  );
};

export default Dashboard;
