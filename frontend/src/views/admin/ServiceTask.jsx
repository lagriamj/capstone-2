import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ServiceTaskModal from "../../components/ServiceTaskModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";

const ServiceTask = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [data, setData] = useState([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isSingleRequest, setIsSingleRequest] = useState(false);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/service-task"
      );
      if (response.status === 200) {
        setData(response.data.results);
        setIsSingleRequest(response.data.results.length === 1);
      } else {
        console.error("Failed to fetch utility settings. Response:", response);
      }
    } catch (error) {
      console.error("Error fetching utility settings:", error);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Task</title>
      </Helmet>
      <div className='className="flex flex-col lg:flex-row bg-gray-200 lg:pl-24 lg:py-10 h-screen"'>
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="overflow-x-auto lg:w-[80%] w-[90%] lg:min-h-[90vh]  h-4/5 pb-10 bg-white shadow-xl  lg:ml-72  border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans">
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
                //value={searchQuery}
                //onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th className="">Date of Request</th>
                  <th className="">Nature of Request</th>
                  <th className="">Mode</th>
                  <th className="">Assigned To</th>
                  <th className="">Status</th>
                  <th className="">Date Updated</th>
                  <th className="w-56 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((setting) => (
                  <tr key={setting.id}>
                    <td className="border-b-2 py-3 border-gray-200 text-center">
                      {setting.id}
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
                            : setting.status === "On Process"
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
                      <button className="ml-1 text-white bg-red-700 rounded-lg px-3 py-2 text-lg font-medium">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ServiceTaskModal
              isOpen={isModalOpen}
              onClose={closeModal}
              data={selectedData}
            />
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ServiceTask;
