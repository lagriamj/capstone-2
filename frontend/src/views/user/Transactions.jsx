import React from "react";
import Sidebar from "../../components/Sidebar";

import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import InputBox from "../../components/InputBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEye } from "@fortawesome/free-solid-svg-icons";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Transactions = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
                <tr className="border-b-2 border-gray-200">
                  <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                    1
                  </td>
                  <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                    Maintenance
                  </td>
                  <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                    Ken Mar Lisondra
                  </td>
                  <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                    Online
                  </td>
                  <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                    On Process
                  </td>
                  <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                    04/18/2022
                  </td>
                  <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                    04/18/2023
                  </td>
                  <td className="p-3 text-lg text-gray-700 flex gap-1">
                    <a
                      href=""
                      className="text-white bg-blue-600 py-3 px-4 rounded-lg"
                    >
                      View
                    </a>
                    <a
                      href=""
                      className="text-white bg-red-700 py-3 px-4 rounded-lg"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Transactions;
