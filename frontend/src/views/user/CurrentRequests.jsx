import React from "react";
import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import CurrentRequestModal from "../../components/CurrentRequestModal";

const CurrentRequests = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { userID } = useAuth();
  console.log("userID:", userID);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleOpenModalClick = (id) => {
    setSelectedItemId(id);
  };

  const handleCloseModalClick = () => {
    setSelectedItemId(null);
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

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get(
        "http://127.0.0.1:8000/api/current-request",
        {
          params: {
            user_id: userID, // Pass the user_id from your component's state
          },
        }
      );

      setData(result.data.results);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    await axios.delete(`http://127.0.0.1:8000/api/requestdelete/${id}`);
    const newUserData = data.filter((item) => item.id !== id);
    setData(newUserData);
  };

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);

  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false); // Move this line up
  const [selectedModeFilters, setSelectedModeFilters] = useState([]); // Move this line up

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleStatusCheckboxChange = (e) => {
    const selectedStatus = e.target.value;

    setSelectedStatusFilters((prevFilters) => {
      if (prevFilters.includes(selectedStatus)) {
        return prevFilters.filter((status) => status !== selectedStatus);
      } else {
        return [...prevFilters, selectedStatus];
      }
    });
  };

  const toggleModeDropdown = () => {
    setIsModeDropdownOpen(!isModeDropdownOpen);
  };

  const handleModeCheckboxChange = (e) => {
    const selectedMode = e.target.value;

    setSelectedModeFilters((prevFilters) => {
      if (prevFilters.includes(selectedMode)) {
        return prevFilters.filter((mode) => mode !== selectedMode);
      } else {
        return [...prevFilters, selectedMode];
      }
    });
  };

  // Rest of your component code...

  const [currentPage, setCurrentPage] = useState(1); // Start from page 0
  const recordsPage = 10;

  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = data.slice(firstIndex, lastIndex);

  const npage = Math.ceil(data.length / recordsPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  const isLargeScreen = windowWidth >= 1024;

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="flex flex-col lg:flex-row bg-gray-200 h-screen lg:pl-20 lg:items-start items-center">
      {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
      <div className=" overflow-x-auto lg:w-[80%] w-[90%] lg:min-h-[90vh] mt-28 lg:mt-10 h-4/5 pb-10 bg-white shadow-xl  lg:ml-80  border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans">
        <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
          <h1 className="font-sans lg:text-3xl text-xl mt-8 ml-5 mr-auto tracking-wide">
            Request
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <th className="px-3 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                  Mode
                  <div className="relative inline-block">
                    <button
                      onClick={toggleModeDropdown}
                      className="text-blue-500 focus:outline-none ml-2"
                      style={{ backgroundColor: "transparent", border: "none" }}
                    >
                      <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                    </button>
                    {isModeDropdownOpen && (
                      <div className="absolute right-0 bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
                        <label className="block px-4 py-2">
                          <input
                            type="checkbox"
                            value="Walk-In"
                            checked={selectedModeFilters.includes("Walk-In")}
                            onChange={handleModeCheckboxChange}
                          />
                          Walk-In
                        </label>
                        <label className="block px-4 py-2">
                          <input
                            type="checkbox"
                            value="Online"
                            checked={selectedModeFilters.includes("Online")}
                            onChange={handleModeCheckboxChange}
                          />
                          Online
                        </label>
                      </div>
                    )}
                  </div>
                </th>

                <th className="px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                  Status
                  <div className="relative inline-block">
                    <button
                      onClick={toggleStatusDropdown}
                      className="text-blue-500 focus:outline-none ml-2"
                      style={{ backgroundColor: "transparent", border: "none" }}
                    >
                      <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                    </button>
                    {isStatusDropdownOpen && (
                      <div className="absolute right-0 bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
                        <label className="block px-4 py-2">
                          <input
                            type="checkbox"
                            value="Pending"
                            checked={selectedStatusFilters.includes("Pending")}
                            onChange={handleStatusCheckboxChange}
                          />
                          Pending
                        </label>
                        <label className="block px-4 py-2">
                          <input
                            type="checkbox"
                            value="On Process"
                            checked={selectedStatusFilters.includes(
                              "On Process"
                            )}
                            onChange={handleStatusCheckboxChange}
                          />
                          On Process
                        </label>
                      </div>
                    )}
                  </div>
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
              {records
                .filter(
                  (item) =>
                    (item.natureOfRequest
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                      item.assignedTo
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.modeOfRequest
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.dateRequested
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) &&
                    (selectedStatusFilters.length === 0 ||
                      selectedStatusFilters.includes(item.status)) &&
                    (selectedModeFilters.length === 0 ||
                      selectedModeFilters.includes(item.modeOfRequest))
                )
                .map((item, index) => {
                  const rowIndex = firstIndex + index + 1;
                  if (
                    selectedStatusFilters.length === 0 ||
                    selectedStatusFilters.includes(item.status)
                  ) {
                    return (
                      <tr className="border-b-2 border-gray-200" key={item.id}>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                          {rowIndex}
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                          {item.natureOfRequest}
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                          {item.assignedTo}
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                          {item.modeOfRequest}
                        </td>
                        <td
                          className={`px-4 py-2 text-lg text-center whitespace-nowrap cursor-pointer`}
                        >
                          <p
                            className={` rounded-lg py-3 ${
                              item.status === "Pending"
                                ? "bg-red-500 text-white" // Apply red background and white text for Pending
                                : item.status === "On Process"
                                ? "bg-yellow-500 text-white" // Apply yellow background and white text for Process
                                : item.status === "Fixed"
                                ? "bg-green-500 text-white" // Apply green background and white text for Done
                                : "bg-gray-200 text-gray-700" // Default background and text color (if none of the conditions match)
                            }`}
                          >
                            {item.status}
                          </p>
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                          {item.dateRequested}
                        </td>
                        <td className="p-3 text-lg text-gray-700 whitespace-nowrap">
                          {item.dateUpdated}
                        </td>
                        <td className="p-3 text-lg text-gray-700 flex gap-1">
                          <button
                            onClick={() => handleOpenModalClick(item.id)}
                            className="text-white bg-blue-600 py-3 px-4 rounded-lg"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-white bg-red-700 py-3 px-4 rounded-lg"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  }
                  return null;
                })}
            </tbody>
            {selectedItemId && (
              <CurrentRequestModal
                display={true}
                itemData={data.find((item) => item.id === selectedItemId)}
                onClose={handleCloseModalClick} // Pass the callback here
              />
            )}
          </table>
          <nav className="absolute bottom-20 right-16">
            <ul className="flex gap-2">
              <li>
                <a
                  href="#"
                  onClick={prePage}
                  className="pagination-link bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Previous
                </a>
              </li>
              {numbers.map((n, i) => (
                <li className={`${currentPage === n ? "active" : ""}`} key={i}>
                  <a
                    href="#"
                    onClick={() => changeCPage(n)}
                    className="pagination-link bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {n}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#"
                  onClick={nextPage}
                  className="pagination-link bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default CurrentRequests;
