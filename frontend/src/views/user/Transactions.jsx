import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { Skeleton } from "antd";

const Transactions = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [utilitySettings, setUtilitySettings] = useState([]);

  const [isFetchingData, setIsFetchingData] = useState(false);

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
      <div className="flex flex-col lg:flex-row bg-gray-200 lg:pl-20 h-screen">
        {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
        <div className=" overflow-x-auto lg:w-[80%] w-[90%] lg:min-h-[90vh] mt-28 lg:mt-10 h-4/5 pb-10 bg-white shadow-xl  lg:ml-80  border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans">
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
                  <th className="w-10 px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                    #
                  </th>
                  <th className="px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                    Nature of Request
                  </th>
                  <th className=" px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                    Assigned To
                  </th>
                  <th className=" px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                    Mode
                  </th>
                  <th className="w-48px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="w-48 px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                    Date of Request
                  </th>
                  <th className="w-48 px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
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
                      No Category Yet.
                    </td>
                  </tr>
                ) : (
                  utilitySettings.map((setting, index) => (
                    <tr key={setting.id} className="border-y-2 border-gray-200">
                      <td className="w-20 text-center text-lg font-medium">
                        {index + 1}
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
                      <td className="p-3 text-lg text-gray-700 flex items-center justify-center gap-1">
                        <a
                          href=""
                          className="text-white bg-blue-600 py-3 px-4 rounded-lg"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Transactions;
