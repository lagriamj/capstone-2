import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Modal, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardCheck,
  faTableList,
  faTicket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

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

  return (
    <HelmetProvider>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div
        className={`className="flex flex-col  lg:flex-row bg-gray-200 ${
          isWidth1920
            ? "lg:pl-20"
            : isScreenWidth1366
            ? "lg:pl-[0.5rem]"
            : "lg:pl-[3.0rem]"
        } lg:pt-2 h-screen`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="flex items-center justify-center">
          <div
            className={`overflow-x-auto ${
              isWidth1920
                ? "lg:w-[84%]  lg:ml-[16.6rem]"
                : isScreenWidth1366
                ? "lg:w-[82%]  lg:ml-[14.5rem]"
                : "lg:w-[82%]  lg:ml-72"
            } w-[90%] lg:h-[100vh] relative mt-20 lg:mt-0  h-[80vh] pb-10     border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans`}
          >
            <div className="w-full h-screen grid grid-cols-7 grid-rows-5 gap-x-3">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid col-span-full text-black font-sans">
                  <div className="flex w-full justify-between px-[2%] mt-4">
                    <div className="flex lg:w-[24%] lg:h-[16vh] bg-white shadow-xl rounded-lg">
                      <div className="flex flex-col w-1/2 font-medium items-center justify-center px-2">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="text-orange-600 h-12 w-12 large:h-20 large:w-20"
                        />
                        <label className="large:text-xl large:mt-2">
                          Users
                        </label>
                      </div>
                      <h1 className="large:text-4xl lg:text-2xl font-bold flex items-center justify-center ml-auto mr-auto">
                        {counts.allUsers}
                      </h1>
                    </div>
                    <div className="flex lg:w-[24%] lg:h-[16vh] bg-white shadow-xl rounded-lg">
                      <div className="flex flex-col w-1/2 font-medium items-center justify-center px-2">
                        <FontAwesomeIcon
                          icon={faTicket}
                          className="text-main h-12 w-12 large:h-20 large:w-20"
                        />
                        <label className="large:text-xl large:mt-2">
                          New Requests
                        </label>
                      </div>
                      <h1 className="large:text-4xl lg:text-2xl font-bold flex items-center justify-center ml-auto mr-auto">
                        {counts.pending}
                      </h1>
                    </div>
                    <div className="flex lg:w-[24%] lg:h-[16vh] bg-white shadow-xl rounded-lg">
                      <div className="flex flex-col w-1/2 font-medium items-center justify-center px-2">
                        <FontAwesomeIcon
                          icon={faTableList}
                          className="text-cyan-500 h-12 w-12 large:h-20 large:w-20"
                        />
                        <label className="w-full large:text-lg large:mt-2 large:whitespace-nowrap text-center ">
                          Received Requests
                        </label>
                      </div>
                      <h1 className="large:text-4xl lg:text-2xl font-bold flex items-center justify-center ml-auto mr-auto">
                        {counts.received}
                      </h1>
                    </div>
                    <div className="flex lg:w-[24%] lg:h-[16vh] bg-white shadow-xl rounded-lg">
                      <div className="flex flex-col w-1/2 font-medium items-center justify-center px-2">
                        <FontAwesomeIcon
                          icon={faClipboardCheck}
                          className="text-red-700 h-12 w-12 large:h-20 large:w-20"
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
              )}
              <div className="col-span-5 mt-5 ml-7 row-span-2 rounded-lg shadow-xl  bg-white">
                <h1>Graph</h1>
              </div>
              <div className="col-span-5 mt-5 ml-7 row-span-2 shadow-xl rounded-lg row-start-4 bg-white">
                <h1>Graphs 2</h1>
              </div>
              <div className="mt-5 text-black font-sans  bg-white shadow-xl rounded-lg col-span-2  row-span-5 mr-8">
                <h1 className="text-2xl m-2 border-b-2 pb-2 border-gray-400">
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
