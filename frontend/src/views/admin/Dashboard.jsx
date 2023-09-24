/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Modal, Button, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faFilter,
  faHandHoldingHeart,
  faTableList,
  faTicket,
} from "@fortawesome/free-solid-svg-icons";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import axios from "axios";
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from "recharts";
import LineGraph from "../../components/LineGraph";
import BarGraph from "../../components/BarGraph";

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

    fetchRequestDetails();
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

  const [windowsHeight768, setWindowsHeight768] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowsHeight768(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  useEffect(() => {
    fetchPiegraphDetails();
    fetchDataRequest();
    fetchTotalAndClosed();
  }, [startDate, endDate]);

  {
    /*const formatDate = (dateString) => {
    // Assuming dateString is in the format "YYYY-MM-DD"
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }); // Get short month name
    const day = date.getDate();
    return `${month} ${day}`;
  }; */
  }

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

  const [graphType, setGraphType] = useState("bar");

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [selectedDataSources, setSelectedDataSources] = useState([
    "technicianData", // Default selection
  ]);

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const toggleDataSource = (dataSource) => {
    setSelectedDataSources([dataSource]);
  };

  const formatter = (value) => {
    return <span className="text-[10px]">{value}</span>;
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
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => a.id - b.id,
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

  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col overflow-auto gotoLarge:px-6 bg-gray-200 large:ml-20 lg:flex-row white pt-5  h-screen`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start  bg-gray-200 gap-2 w-full">
          <div
            className={` w-[90%] lg:w-[80%] large:w-[85%] large:h-[95vh] h-auto lg:ml-auto lg:mx-4 mt-20  lg:mt-0   justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="w-full lg:h-screen h-auto flex flex-col  lg:grid lg:grid-cols-7 lg:grid-rows-5 gap-x-3 ">
                <div className="lg:grid lg:col-span-5 text-black font-sans">
                  <div className="flex lg:flex-row flex-col w-full  lg:justify-between ">
                    <div className="flex lg:w-[32%] lg:h-[18vh] lg:mb-0 mb-3 bg-[#fff4de] shadow-md rounded-lg">
                      <div className="flex flex-col w-1/2 font-medium items-center justify-center px-2">
                        <FontAwesomeIcon
                          icon={faTicket}
                          className="text-[#ff947a] h-12 w-12 large:h-20 large:w-20"
                        />
                        <label className="large:text-xl large:mt-2">
                          New Requests
                        </label>
                      </div>
                      <h1 className="large:text-4xl lg:text-2xl font-bold flex items-center justify-center ml-auto mr-auto">
                        {counts.countPending}
                      </h1>
                    </div>
                    <div className="flex lg:w-[32%] lg:h-[18vh] mb-3 bg-[#dcfce7] shadow-md rounded-lg">
                      <div className="flex flex-col w-1/2 font-medium items-center justify-center px-2">
                        <FontAwesomeIcon
                          icon={faTableList}
                          className="text-[#3cd958] h-12 w-12 large:h-20 large:w-20"
                        />
                        <label className="w-full large:text-lg large:mt-2 large:whitespace-nowrap text-center ">
                          Received Requests
                        </label>
                      </div>
                      <h1 className="large:text-4xl lg:text-2xl font-bold flex items-center justify-center ml-auto mr-auto">
                        {counts.countReceived}
                      </h1>
                    </div>
                    <div className="flex lg:w-[32%] lg:h-[18vh] mb-3 bg-[#f4e8ff] shadow-md rounded-lg">
                      <div className="flex flex-col w-1/2 font-medium items-center justify-center px-2">
                        <FontAwesomeIcon
                          icon={faClipboardCheck}
                          className="text-[#bf83ff] h-12 w-12 large:h-20 large:w-20"
                        />
                        <label className="large:text-xl large:mt-2">
                          Closed
                        </label>
                      </div>
                      <h1 className="large:text-4xl lg:text-2xl font-bold flex items-center justify-center ml-auto mr-auto">
                        {counts.countClosed}
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col px-4  row-span-2 rounded-lg shadow-md  bg-white">
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
                        <div className="absolute right-0 top-9 z-50 overflow-auto text-start bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
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
                      <div className="flex gap-1 items-center lg:justify-center mr-auto lg:mr-2">
                        <label
                          htmlFor="graphType"
                          className="large:text-lg mediumLg:text-sm lg:text-base"
                        >
                          Type
                        </label>
                        <select
                          id="graphType"
                          name="graphType"
                          value={graphType}
                          onChange={(e) => setGraphType(e.target.value)}
                          className="border-2 border-gray-700 rounded-lg px-1 large:text-lg mediumLg:text-sm lg:text-base"
                        >
                          <option value="bar">Bar </option>
                          <option value="line">Line </option>
                        </select>
                      </div>
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

                  {graphType === "line" && (
                    <LineGraph
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
                  )}
                  {graphType === "bar" && (
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
                  )}
                </div>
                <div className="lg:col-span-full flex lg:flex-row flex-col justify-between mediumLg:mt-2 large:mt-3 mt-4 gap-3 row-span-2  rounded-lg row-start-4 ">
                  <div className="bg-white lg:w-[30%] w-full rounded-lg shadow-md">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={600} height={600}>
                        <Pie
                          dataKey="value"
                          data={pieTotalAndClosed}
                          isAnimationActive={true}
                          cx="50%"
                          cy="50%"
                          fill="color"
                          label={renderCustomizedLabel}
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-white lg:w-[30%] w-full rounded-lg shadow-md">
                    <ResponsiveContainer width="100%" height="100%">
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
                    <Modal
                      title={
                        <div className="flex text-lg gap-4 px-6 py-4 font-sans">
                          <span>{clickedPortion} Requests</span>
                          <span className="font-bold text-red-700">
                            {modalTitle}%
                          </span>
                        </div>
                      }
                      open={modalVisible}
                      onCancel={closePieModal}
                      footer={null}
                      width="90%"
                    >
                      <Table
                        dataSource={modalData}
                        columns={tableColumns}
                        pagination={true}
                        className="gotoLarge:w-full overflow-auto"
                      />
                    </Modal>
                  </div>
                  <div className="bg-white lg:w-[20%] w-full rounded-lg shadow-md font-sans large:text-xl gotoLarge:text-lg mediumLg:text-sm lg:text-base">
                    <div className="flex border-b-2 items-center justify-center border-gray-400">
                      <h1 className="p-3  font-semibold ">Rating</h1>
                      <FontAwesomeIcon
                        icon={faHandHoldingHeart}
                        className="large:h-8 large:w-8 text-main mediumLg:h-6 mediumLg:w-6"
                      />
                    </div>
                    <div className="flex flex-col gap-4 gap-y-10 pt-4 gotoLarge:gap-y-12 gotoLarge:pt-14 font-medium   mediumLg:gap-y-4 mediumLg:pt-6 large:gap-y-16 large:pt-10 p-4 ">
                      <div className="flex items-center justify-center gap-3">
                        <label className="gotoLarge:whitespace-nowrap">
                          Overall Ratings:{" "}
                        </label>
                        <label className="text-red-700 text-xl large:text-3xl font-semibold italic">
                          {" "}
                          {formattedTotalRatings}%
                        </label>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <label>Satisfied: </label>
                        <label className="text-red-700 text-xl large:text-3xl font-semibold italic">
                          {" "}
                          {formattedTotalSatisfied}%
                        </label>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <label>Unsatisfied: </label>
                        <label className=" text-red-700 text-xl large:text-3xl font-semibold italic">
                          {" "}
                          {formattedTotalUnsatisfied}%
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white lg:w-[20%] w-full rounded-lg shadow-md font-sans large:text-xl gotoLarge:text-lg mediumLg:text-sm lg:text-base">
                    <h1 className="p-3 text-center font-semibold border-b-2 border-gray-400 ">
                      Top 3 Nature of Requests
                    </h1>
                    <ul className="flex flex-col gap-4 gap-y-10 pt-4 gotoLarge:gap-y-12 gotoLarge:pt-14 font-medium   mediumLg:gap-y-4 mediumLg:pt-6 large:gap-y-14 large:pt-10 p-4 ">
                      {ratingsAndNature.topNature.map(
                        (natureOfRequest, index) => (
                          <li className="flex  gap-4" key={index}>
                            <span key={index}>
                              {index === 0 ? (
                                <Filter1Icon />
                              ) : index === 1 ? (
                                <Filter2Icon />
                              ) : index === 2 ? (
                                <Filter3Icon />
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
                <div className="text-black font-sans overflow-auto lg:mt-0 mt-3  bg-white shadow-md rounded-lg lg:col-start-6 lg:col-span-2  lg:row-start-1 lg:row-span-3 ">
                  <h1 className="text-2xl m-2 font-semibold border-b-2 pb-2 border-gray-400">
                    Recent Requests
                  </h1>
                  {requestDetails.map((request) => (
                    <div
                      key={request.id}
                      className="mb-5 pb-2 large:text-lg border-b-2 border-gray-400"
                    >
                      <div className="grid grid-cols-2 px-2">
                        <p className="whitespace-nowrap"> {request.fullName}</p>
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
            )}
          </div>
        </div>
      </div>
      <Modal
        title={
          <h1 className="text-xl my-4 pb-2 font-bold font-sans">
            Request ID: E-{selectedData?.id}
          </h1>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        width="50%"
        footer={[
          <Button key="close" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {selectedData && (
          <div className="grid grid-cols-2 gap-x-2 mediumLg:text-xl gap-y-2 border-t-2 border-gray-400 pt-6 font-sans">
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
              <label className="font-semibold">Date of Request: </label>
              <label>{selectedData.dateRequested}</label>
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
              <label className="font-semibold">Authorized By: </label>
              <label>{selectedData.authorizedBy}</label>
            </div>
            <div className="grid grid-cols-2">
              <label className="font-semibold">Date Procured: </label>
              <label>{selectedData.dateProcured}</label>
            </div>
            <div className="col-span-2 mt-5">
              <label className="font-semibold">Special Instruction: </label>
              <label>{selectedData.specialIns}</label>
            </div>
          </div>
        )}
      </Modal>
    </HelmetProvider>
  );
};

export default Dashboard;
