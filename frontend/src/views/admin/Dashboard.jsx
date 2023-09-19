/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Modal, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faFilter,
  faHandHoldingHeart,
  faTableList,
  faTicket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import Filter3Icon from "@mui/icons-material/Filter3";
import axios from "axios";
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from "recharts";
import AreaGraph from "../../components/AreaGraph";
import LineGraph from "../../components/LineGraph";
import BarGraph from "../../components/BarGraph";

const Dashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    pending: 0,
    allUsers: 0,
    received: 0,
    closed: 0,
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
    async function fetchCounts() {
      try {
        const pendingResponse = await fetch(
          "http://127.0.0.1:8000/api/pending-requests"
        );
        const allUsersResponse = await fetch(
          "http://127.0.0.1:8000/api/all-users"
        );
        const receivedResponse = await fetch(
          "http://127.0.0.1:8000/api/received-requests"
        );
        const closedResponse = await fetch(
          "http://127.0.0.1:8000/api/closed-requests"
        );

        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          setCounts((prevCounts) => ({
            ...prevCounts,
            pending: pendingData.count,
          }));
        }

        if (allUsersResponse.ok) {
          const allUsersData = await allUsersResponse.json();
          setCounts((prevCounts) => ({
            ...prevCounts,
            allUsers: allUsersData.count,
          }));
        }

        if (receivedResponse.ok) {
          const receivedData = await receivedResponse.json();
          setCounts((prevCounts) => ({
            ...prevCounts,
            received: receivedData.count,
          }));
        }

        if (closedResponse.ok) {
          const closedData = await closedResponse.json();
          setCounts((prevCounts) => ({
            ...prevCounts,
            closed: closedData.count,
          }));
        }

        // Hide the loading state once all counts are fetched
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching counts:", error);
        setIsLoading(false); // Hide loading state on error
      }
    }

    fetchCounts();
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
  const isWidth1920 = window.innerWidth === 1920;

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

  console.log("Screen Width: ");

  const [topNatures, setTopNatures] = useState([]);
  console.log(`Browser Height: ${window.innerHeight}`);

  useEffect(() => {
    async function fetchTopNatures() {
      const response = await fetch(
        "http://127.0.0.1:8000/api/top-nature-request"
      );
      const topNaturesData = await response.json();
      setTopNatures(topNaturesData.topNatures);
    }

    fetchTopNatures();
  }, []);

  const [totalRatings, setTotalRatings] = useState(null);

  useEffect(() => {
    async function fetchOverAllRatings() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/overall-rating"
        );
        if (response.ok) {
          const data = await response.json();
          setTotalRatings(data.total_ratings);
        } else {
          console.error(
            "Failed to fetch ratings data. Server returned:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching ratings data:", error.message);
      }
    }

    fetchOverAllRatings();
  }, []);

  const [totalUnsatisfied, setTotalUnsatisfied] = useState(null);

  useEffect(() => {
    async function fetchUnsatisfiedRating() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/unsatisfied-rating"
        );
        if (response.ok) {
          const data = await response.json();
          setTotalUnsatisfied(data.UnSatisfiedRating);
        } else {
          console.error(
            "Failed to fetch ratings data. Server returned:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching ratings data:", error.message);
      }
    }

    fetchUnsatisfiedRating();
  }, []);

  const [totalSatisfied, setTotalSatisfied] = useState(null);

  useEffect(() => {
    async function fetchSatisfiedRating() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/satisfied-rating"
        );
        if (response.ok) {
          const data = await response.json();
          setTotalSatisfied(data.SatisfiedRating);
        } else {
          console.error(
            "Failed to fetch ratings data. Server returned:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching ratings data:", error.message);
      }
    }

    fetchSatisfiedRating();
  }, []);

  const [startDate, setStartDate] = useState("");
  const [technicianData, setTechnicianData] = useState(null);
  const [percentData, setPercentData] = useState({
    totalRequests: 0,
    closedRequests: 0,
  });
  const [requestsByDate, setRequestsByDate] = useState(null);
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 2);
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

      const percentResponse = await axios.get(
        `http://127.0.0.1:8000/api/percent-accomplished/${startDate}/${endDate}`
      );
      setPercentData(percentResponse.data);

      const requestsResponse = await axios.get(
        `http://127.0.0.1:8000/api/requestsByDate/${startDate}/${endDate}`
      );
      setRequestsByDate(requestsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log(technicianData);
  console.log(percentData);
  console.log("Total Closed:" + percentData.closedRequests);
  console.log("Total Closed:" + percentData.totalRequests);

  useEffect(() => {
    fetchDataRequest();
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

  const pieChartData = [
    {
      name: "Closed Requests",
      value: percentData?.closedRequests,
      fill: "#8884d8",
    },
    {
      name: "Total Requests",
      value: percentData?.totalRequests,
      fill: "#333366",
    },
  ];

  const formattedTotalRatings =
    totalRatings !== null ? totalRatings.toFixed(2) : null;
  const formattedTotalSatisfied =
    totalSatisfied !== null ? totalSatisfied.toFixed(2) : null;
  const formattedTotalUnsatisfied =
    totalUnsatisfied !== null ? totalUnsatisfied.toFixed(2) : null;

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}% / ${value}`}
      </text>
    );
  };

  const [graphType, setGraphType] = useState("area");

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

  console.log(requestsByDate);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div
        className={`className="flex flex-col  lg:flex-row bg-[#F0F0F0]
        ${
          isWidth1920
            ? "lg:pl-20"
            : isScreenWidth1366
            ? "lg:pl-[0.5rem]"
            : "lg:pl-[3.0rem]"
        } lg:py-3 h-auto`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="flex items-center justify-center">
          <div
            className={`${
              isWidth1920
                ? "lg:w-[88%]  lg:ml-[15.5rem]"
                : isScreenWidth1366
                ? "lg:w-[84%]  lg:ml-[14.0rem]"
                : "lg:w-[84%]  lg:ml-64"
            } w-[90%] lg:h-[100vh] relative mt-20 lg:mt-0  h-[80vh] pb-10     border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans`}
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="w-full h-screen grid grid-cols-7 grid-rows-6 gap-x-3">
                <div className="grid col-span-full text-black font-sans">
                  <div className="flex w-full justify-between px-[1%] ">
                    <div className="flex lg:w-[24%] lg:h-[16vh] bg-[#ffe2e6] shadow-md rounded-lg">
                      <div className="flex flex-col w-1/2 font-medium items-center justify-center px-2">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="text-[#fa5a7d] h-12 w-12 large:h-20 large:w-20"
                        />
                        <label className="large:text-xl large:mt-2">
                          Users
                        </label>
                      </div>
                      <h1 className="large:text-4xl lg:text-2xl font-bold flex items-center justify-center ml-auto mr-auto">
                        {counts.allUsers}
                      </h1>
                    </div>
                    <div className="flex lg:w-[24%] lg:h-[16vh] bg-[#fff4de] shadow-md rounded-lg">
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
                        {counts.pending}
                      </h1>
                    </div>
                    <div className="flex lg:w-[24%] lg:h-[16vh] bg-[#dcfce7] shadow-md rounded-lg">
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
                        {counts.received}
                      </h1>
                    </div>
                    <div className="flex lg:w-[24%] lg:h-[16vh] bg-[#f4e8ff] shadow-md rounded-lg">
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
                        {counts.closed}
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="col-span-5 flex flex-col mediumLg:mt-2 large:mt-2 px-4 ml-4 row-span-3 rounded-lg shadow-md  bg-white">
                  <div className="w-full flex gap-2 px-2 py-3 mediumLg:pt-1 justify-end">
                    {" "}
                    <div className="px-3 py-3 relative flex items-center gap-2 pb-2 font-sans font-semibold text-lg mr-auto">
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
                    <div className="flex gap-1 items-center justify-center">
                      <div className="flex gap-1 items-center justify-center mr-2">
                        <label
                          htmlFor="graphType"
                          className="large:text-lg mediumLg:text-sm lg:text-base"
                        >
                          Select Graph Type
                        </label>
                        <select
                          id="graphType"
                          name="graphType"
                          value={graphType}
                          onChange={(e) => setGraphType(e.target.value)}
                          className="border-2 border-gray-700 rounded-lg px-1 large:text-lg mediumLg:text-sm lg:text-base"
                        >
                          <option value="area">Area </option>
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
                        className="border-2 border-gray-700  rounded-lg px-1 large:text-lg mediumLg:text-sm lg:text-base "
                      />
                    </div>
                    <div className="flex gap-1 items-center justify-center">
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
                        className="border-2 border-gray-700  rounded-lg px-1 large:text-lg mediumLg:text-sm lg:text-base "
                      />
                    </div>
                  </div>

                  {graphType === "area" && (
                    <AreaGraph
                      data={
                        selectedDataSources.includes("technicianData")
                          ? technicianData
                          : selectedDataSources.includes("requestsByDate")
                          ? requestsByDate
                          : ""
                      }
                      values1={
                        selectedDataSources.includes("technicianData")
                          ? "closed"
                          : selectedDataSources.includes("requestsByDate")
                          ? "totalRequests"
                          : ""
                      }
                      values2={
                        selectedDataSources.includes("technicianData")
                          ? "unclosed"
                          : selectedDataSources.includes("requestsByDate")
                          ? "closedRequests"
                          : ""
                      }
                      xValue={
                        selectedDataSources.includes("technicianData")
                          ? "assignedTo"
                          : selectedDataSources.includes("requestsByDate")
                          ? "date"
                          : ""
                      }
                      windowsHeight768={isWindowsHeightBelow768}
                    />
                  )}
                  {graphType === "line" && (
                    <LineGraph
                      data={
                        selectedDataSources.includes("technicianData")
                          ? technicianData
                          : selectedDataSources.includes("requestsByDate")
                          ? requestsByDate
                          : ""
                      }
                      values1={
                        selectedDataSources.includes("technicianData")
                          ? "closed"
                          : selectedDataSources.includes("requestsByDate")
                          ? "totalRequests"
                          : ""
                      }
                      values2={
                        selectedDataSources.includes("technicianData")
                          ? "unclosed"
                          : selectedDataSources.includes("requestsByDate")
                          ? "closedRequests"
                          : ""
                      }
                      xValue={
                        selectedDataSources.includes("technicianData")
                          ? "assignedTo"
                          : selectedDataSources.includes("requestsByDate")
                          ? "date"
                          : ""
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
                          : ""
                      }
                      values1={
                        selectedDataSources.includes("technicianData")
                          ? "closed"
                          : selectedDataSources.includes("requestsByDate")
                          ? "totalRequests"
                          : ""
                      }
                      values2={
                        selectedDataSources.includes("technicianData")
                          ? "unclosed"
                          : selectedDataSources.includes("requestsByDate")
                          ? "closedRequests"
                          : ""
                      }
                      xValue={
                        selectedDataSources.includes("technicianData")
                          ? "assignedTo"
                          : selectedDataSources.includes("requestsByDate")
                          ? "date"
                          : ""
                      }
                      windowsHeight768={isWindowsHeightBelow768}
                    />
                  )}
                </div>
                <div className="col-span-5 flex lg:flex-row flex-col justify-between mediumLg:mt-2 large:mt-3 mt-4 ml-4 row-span-2  rounded-lg row-start-5 ">
                  <div className="bg-white lg:w-[40%] w-full rounded-lg shadow-md">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={600} height={600}>
                        <Pie
                          dataKey="value"
                          data={pieChartData}
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
                  <div className="bg-white lg:w-[29%] w-full rounded-lg shadow-md font-sans large:text-xl gotoLarge:text-lg mediumLg:text-sm lg:text-base">
                    <div className="flex border-b-2 items-center justify-center border-gray-400">
                      <h1 className="p-3  font-semibold ">Rating</h1>
                      <FontAwesomeIcon
                        icon={faHandHoldingHeart}
                        className="large:h-8 large:w-8 text-main mediumLg:h-6 mediumLg:w-6"
                      />
                    </div>
                    <div className="flex flex-col gap-4 gap-y-10 pt-4 gotoLarge:gap-y-12 gotoLarge:pt-14 font-medium   mediumLg:gap-y-4 mediumLg:pt-6 large:gap-y-16 large:pt-10 p-4 ">
                      <div className="flex items-center justify-center gap-3">
                        <label>Total Ratings: </label>
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
                  <div className="bg-white lg:w-[29%] w-full rounded-lg shadow-md font-sans large:text-xl gotoLarge:text-lg mediumLg:text-sm lg:text-base">
                    <h1 className="p-3 text-center font-semibold border-b-2 border-gray-400 ">
                      Top 3 Nature of Requests
                    </h1>
                    <ul className="flex flex-col gap-4 gap-y-10 pt-4 gotoLarge:gap-y-12 gotoLarge:pt-14 font-medium   mediumLg:gap-y-4 mediumLg:pt-6 large:gap-y-20 large:pt-10 p-4 ">
                      {topNatures.map((natureOfRequest, index) => (
                        <li className="flex  gap-4" key={natureOfRequest.id}>
                          <span>
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
                      ))}
                    </ul>
                  </div>
                </div>
                <div className=" text-black font-sans mediumLg:mt-2 large:mt-2  bg-white shadow-md rounded-lg col-span-2  row-span-5 mr-4">
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
                        <p> {request.dateRequested}</p>
                      </div>
                      <div className="grid grid-cols-2 mt-2 px-2">
                        <p className="whitespace-nowrap">
                          {request.natureOfRequest}
                        </p>

                        <button
                          className="text-blue-400"
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
