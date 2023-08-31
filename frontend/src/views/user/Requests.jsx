import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { faCheck, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteModal from "../../components/NoteModal";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import HashLoader from "react-spinners/HashLoader";
import { message } from "antd";
import Select from "react-select";
import { Helmet } from "react-helmet";

const Requests = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isLargeScreen = windowWidth >= 1024;
  const { userID } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedNatureOfRequest, setSelectedNatureOfRequest] = useState(null);
  const [selectedModeOfRequest, setSelectedModeOfRequest] = useState(null);
  console.log("userID:", userID);
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
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

  const navigate = useNavigate();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const daytime = new Date().toLocaleString(undefined, options);

  const [formData, setFormData] = useState({
    user_id: userID,
    reqOffice: "",
    division: "",
    natureOfRequest: "",
    modeOfRequest: "",
    unit: "",
    propertyNo: "",
    serialNo: "",
    authorizedBy: "",
    dateProcured: "",
    specialIns: "",
    status: "Pending",
    assignedTo: "None",
  });

  const changeUserFieldHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/service-request",
        formData
      );
      const data = response.data;
      console.log(data);
      navigate("/current-requests", {
        state: {
          successMessage: "Requested successfully.",
        },
      });
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get(
        "http://127.0.0.1:8000/api/nature-request"
      );

      setData(result.data.results);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  const [val, setVal] = useState("");

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "2px solid #cbd5e0" : "2px solid #cbd5e0",
      backgroundColor: "#f9fafb",
      boxShadow: "none",
      height: "47px",
      outline: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#343467" : "white",
      color: state.isSelected ? "white" : "black",
    }),
  };

  const optionsModeOfRequest = [
    { value: "Walk-In", label: "Walk-In" },
    { value: "Online", label: "Online" },
  ];

  return (
    <div className="bg-transparent">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <HashLoader color="#ffffff" size={80} />
        </div>
      )}
      <div className="flex flex-col lg:flex-row bg-gray-200 overflow-auto lg:pl-24 lg:py-10 h-screen">
        <Helmet>
          <title>Request</title>
        </Helmet>
        {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
        <div className="w-[80%] pb-10 mt-28 lg:mt-0 bg-white shadow-xl h-auto lg:ml-72 border-0 border-gray-400  self-center rounded-lg flex flex-col items-center font-sans">
          <h1 className=" text-3xl text-center my-10 font-bold ">
            CITC TECHNICAL SERVICE REQUEST SLIP
          </h1>
          <form
            action=""
            onSubmit={onSubmitChange}
            className="w-11/12 h-auto flex lg:flex-wrap  text-xl gap-10 mt-10 flex-col lg:flex-row  "
          >
            <div className="flex flex-col lg:w-1/4 ">
              <label htmlFor="reqOffice" className="font-semibold text-lg ">
                Requesting Office:
              </label>
              <input
                type="text"
                id="reqOffice"
                name="reqOffice"
                required
                className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
              />
            </div>
            <div className="flex flex-col lg:w-1/4 ">
              <label htmlFor="division" className="font-semibold text-lg ">
                Division:{" "}
              </label>
              <input
                type="text"
                id="division"
                name="division"
                required
                className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
              />
            </div>
            <div className="flex flex-col lg:w-1/4 ">
              <label htmlFor="dateRequested" className="font-semibold text-lg ">
                Date Requested:
              </label>
              <input
                required
                value={daytime}
                className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
                readOnly
              />
            </div>
            <div className="flex flex-col w-full lg:w-1/4">
              <label className="font-semibold text-lg">
                Nature of Request:
              </label>
              <div className="relative">
                <Select // Use react-select
                  required
                  name="natureOfRequest"
                  className="w-full  border-2 border-gray-400 bg-gray-50 rounded-md focus:outline-none"
                  value={selectedNatureOfRequest} // Set selected value
                  onChange={(selectedOption) => {
                    setSelectedNatureOfRequest(selectedOption); // Update selected option
                    changeUserFieldHandler({
                      target: {
                        name: "natureOfRequest",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    });
                  }}
                  options={data.map((option, index) => ({
                    value: option.natureRequest,
                    label: option.natureRequest,
                  }))}
                  placeholder="Select an option..."
                  styles={customStyles}
                />
              </div>
            </div>
            <div className="flex flex-col w-full lg:w-1/4">
              <label className="font-semibold text-lg">Mode of Request</label>
              <div className="relative">
                <Select // Use react-select
                  required
                  name="modeOfRequest"
                  className="w-full   border-2 border-gray-400 bg-gray-50 rounded-md focus:outline-none"
                  value={selectedModeOfRequest} // Set selected value
                  onChange={(selectedOption) => {
                    setSelectedModeOfRequest(selectedOption); // Update selected option
                    changeUserFieldHandler({
                      target: {
                        name: "modeOfRequest",
                        value: selectedOption ? selectedOption.value : "",
                      },
                    });
                  }}
                  options={optionsModeOfRequest}
                  placeholder="Select an option..."
                  styles={customStyles}
                />
              </div>
            </div>
            <div className="flex flex-col lg:w-1/4 ">
              <label htmlFor="unit" className="font-semibold text-lg ">
                Unit:
              </label>
              <input
                required
                type="text"
                id="unit"
                name="unit"
                className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
              />
            </div>
            <div className="flex flex-col w-full lg:w-1/4 ">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-lg">Property No:</label>
                <NoteModal display={true} />
              </div>
              <input
                required
                type="text"
                id="propertyNo"
                name="propertyNo"
                className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
              />
            </div>
            <div className="flex flex-col lg:w-1/4 ">
              <label htmlFor="serialNo" className="font-semibold text-lg ">
                Serial No:
              </label>
              <input
                required
                type="text"
                id="serialNo"
                name="serialNo"
                className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
              />
            </div>
            <div className="flex flex-col lg:w-1/4 ">
              <label htmlFor="authorizedBy" className="font-semibold text-lg ">
                Authorized By:
              </label>
              <input
                required
                type="text"
                id="authorizedBy"
                name="authorizedBy"
                className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
              />
            </div>
            <div className="flex flex-col lg:w-1/4 ">
              <label htmlFor="dateProcured" className="font-semibold text-lg ">
                Date Procured:
              </label>
              <input
                required
                type="date"
                id="dateProcured"
                name="dateProcured"
                className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
              />
            </div>
            <div className="flex flex-col w-full ">
              <label htmlFor="message" className="font-semibold text-lg">
                Special Instruction{" "}
              </label>
              <textarea
                id="message"
                name="specialIns"
                rows="4"
                required
                className="block p-2.5 w-full text-lg  bg-gray-50 rounded-lg border border-gray-400  dark:placeholder-gray-400 dark:text-white focus:outline-none"
                placeholder="Write the special instructions here..."
                onChange={(e) => {
                  changeUserFieldHandler(e);
                }}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-main text-white py-4 px-5 flex gap-3 items-center rounded-lg ml-auto"
            >
              <FontAwesomeIcon icon={faCheck} style={{ color: "#ffffff" }} />
              Request Service
            </button>
            <p></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Requests;
