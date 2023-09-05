import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RateModal from "../../components/RateModal";
import axios from "axios";
import { Skeleton } from "antd";

const Transactions = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [utilitySettings, setUtilitySettings] = useState([]);

  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleStarIconClick = (id, user_id) => {
    setSelectedID(id);
    setSelectedUserId(user_id);
    setUpdateModalVisible(true); // Open the RateModal
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
    setIsFetchingData(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/closed-transaction"
      );
      if (response.status === 200) {
        setUtilitySettings(response.data.results);
        console.log(response.data.results);
        setIsFetchingData(false);
      } else {
        console.error("Failed to fetch utility settings. Response:", response);
        setIsFetchingData(false);
      }
    } catch (error) {
      console.error("Error fetching utility settings:", error);
      setIsFetchingData(false);
    }
  };
  return (
    <HelmetProvider>
      <Helmet>
        <title>Transactions</title>
      </Helmet>
      <div className="flex flex-col lg:flex-row bg-gray-200 h-screen lg:pl-20 lg:py-10 lg:items-start items-center">
        {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
        <div className="overflow-x-auto lg:w-[80%] w-[90%] lg:min-h-[90vh] relative mt-20 lg:mt-0 mx-5  h-4/5 pb-10 bg-white shadow-xl  lg:ml-72  border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans">
          <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
            <h1 className="font-sans lg:text-3xl text-xl mt-8 ml-5 mr-auto tracking-wide">
              Service Transactions
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
              />
            </div>
          </div>
          <div className="overflow-auto rounded-lg w-full">
            <table className="w-full ">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr className="border-b-2 border-gray-100">
                  <th className="w-10 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    #
                  </th>
                  <th className="w-10 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Request ID
                  </th>
                  <th className="w-40 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Nature of Request
                  </th>
                  <th className="w-40 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Assigned To
                  </th>
                  <th className="w-20 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Mode
                  </th>
                  <th className="w-20 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Status
                  </th>
                  <th className="w-48 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Date of Request
                  </th>
                  <th className="w-48 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Date Updated
                  </th>
                  <th className="w-56 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetchingData ? (
                  <tr>
                    <td colSpan="3">
                      <Skeleton active />
                    </td>
                  </tr>
                ) : utilitySettings.length === 0 ? (
                  <tr className="h-[20vh]">
                    <td
                      colSpan="8"
                      className="p-3 text-lg text-gray-700 text-center"
                    >
                      No Record Yet.
                    </td>
                  </tr>
                ) : (
                  utilitySettings.map((setting, index) => (
                    <tr key={setting.id} className="border-y-2 border-gray-200">
                      <td className="w-20 text-center text-lg font-medium">
                        {index + 1}
                      </td>
                      <td className="text-center text-lg font-medium">
                        {setting.id}
                      </td>
                      <td className="text-center text-lg font-medium">
                        {setting.natureOfRequest}
                      </td>
                      <td className="text-center text-lg font-medium">
                        {setting.assignedTo}
                      </td>
                      <td className="text-center text-lg font-medium">
                        {setting.modeOfRequest}
                      </td>
                      <td className="text-center text-lg font-medium">
                        {setting.status}
                      </td>
                      <td className="text-center text-lg font-medium">
                        {setting.dateRequested}
                      </td>
                      <td className="text-center text-lg font-medium">
                        {setting.dateUpdated}
                      </td>
                      <td className="border-b-2 py-3 border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg">
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleStarIconClick(setting.id, setting.user_id)
                            }
                            className="text-white text-base bg-yellow-500 py-2 px-3 rounded-lg"
                          >
                            <FontAwesomeIcon icon={faStar} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {isUpdateModalVisible && (
              <RateModal
                isOpen={isUpdateModalVisible}
                onClose={() => setUpdateModalVisible(false)}
                id={selectedID} // Pass the selectedItemId as a prop
                user_id={selectedUserId} // Pass the selectedUserId as a prop
              />
            )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Transactions;
