import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteModal from "../../components/NoteModal";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useActiveTab } from "../../ActiveTabContext";
import Select from "react-select";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "antd";

const Requests = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isLargeScreen = windowWidth >= 1024;
  const { setActiveTab } = useActiveTab();
  const [loading, setLoading] = useState(false);
  const [selectedNatureOfRequest, setSelectedNatureOfRequest] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [office, setOffice] = useState("");
  const [division, setDivision] = useState("");
  const [author, setAuthor] = useState("");
  const { userID, fullName } = useAuth();
  console.log("userID:", userID);

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
    axios
      .get(`http://127.0.0.1:8000/api/getOfficeAndDivision/${userID}`)
      .then((response) => {
        setOffice(response.data.office);
        setDivision(response.data.division);

        // Set the values of formOffice and formDivision in formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          reqOffice: response.data.office,
          division: response.data.division,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userID]);

  const navigate = useNavigate();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formOffice = office;
  const formDivision = division;

  const daytime = new Date().toLocaleString(undefined, options);
  const [formData, setFormData] = useState({
    user_id: userID,
    fullName: fullName,
    reqOffice: "",
    division: "",
    natureOfRequest: "",
    modeOfRequest: "Online",
    unit: "",
    propertyNo: "",
    serialNo: "",
    authorizedBy: "",
    dateProcured: "1111-11-11",
    specialIns: "",
    status: "Pending",
    assignedTo: "None",
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/office-list")
      .then((response) => {
        const officeList = response.data.results;
        const matchingNature = officeList.find(
          (item) => item.office === formOffice
        );

        if (matchingNature) {
          setAuthor(matchingNature.head);

          setFormData((prevFormData) => ({
            ...prevFormData,
            authorizedBy: matchingNature.head,
          }));
        } else {
          console.log("Matching office not found.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [formOffice]);

  const changeUserFieldHandler = (e) => {
    const { name, value } = e.target;

    if (name === "dateProcured") {
      const newValue = value || "1111-11-11";

      setFormData({
        ...formData,
        [name]: newValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    console.log(formData);
  };

  const handleNewActiveTab = () => {
    setActiveTab("current-requests");
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/add-request",
        formData
      );
      const data = response.data;
      console.log(data);

      navigate("/current-requests", {
        state: {
          successMessage: "Requested successfully.",
        },
      });
      handleNewActiveTab();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchNature();
  }, []);

  const fetchNature = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/api/nature-list");
      setData(result.data.results);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  const [units, setUnit] = useState([]);

  useEffect(() => {
    fetchUnit();
  }, []);

  const fetchUnit = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/api/category-list");
      setUnit(result.data.results);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      height: "100%",
      width: "100%",
      outline: "none",
      display: "flex",
      overflowX: "auto",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#343467" : "white",
      color: state.isSelected ? "white" : "black",
    }),
  };

  console.log(office + division);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Request</title>
      </Helmet>

      <div
        className={`className="flex flex-grow flex-col gotoLarge:px-6 large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={` w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] shadow-xl  h-auto lg:ml-auto lg:mx-4 mt-20 lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="bg-secondary py-6 pl-4  text-white flex items-center justify-center">
              <h1 className=" mediumLg:text-xl text-lg text-left   font-medium italic ">
                CITC TECHNICAL SERVICE REQUEST SLIP
              </h1>
              <div className="font-normal mr-auto ml-6">
                <NoteModal display={true} />
              </div>
            </div>

            <form
              action=""
              onSubmit={onSubmitChange}
              className="w-11/12 h-screen grid lg:grid-cols-3 grid-cols-1 items-center justify-between lg:pl-10  text-xl gap-y-10 gap-x-12 mt-10 "
            >
              <div className="flex items-center  gap-2 justify-center w-full ">
                <label htmlFor="reqOffice" className="font-normal text-lg ">
                  Office:
                </label>
                <input
                  type="text"
                  id="reqOffice"
                  name="reqOffice"
                  value={formOffice}
                  readOnly
                  className=" w-full border-b-2 border-gray-400   py-2 px-4 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 justify-center  w-full ">
                <label htmlFor="division" className="font-normal text-lg ">
                  Division:
                </label>
                <input
                  type="text"
                  id="division"
                  name="division"
                  value={formDivision}
                  readOnly
                  className=" w-full border-b-2 border-gray-400   py-2 px-4 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-center gap-2 w-full ">
                <label htmlFor="dateRequested" className="font-normal text-lg ">
                  Date:
                </label>
                <input
                  required
                  value={daytime}
                  className=" w-full border-b-2 border-gray-400   py-2 px-4 focus:outline-none"
                  readOnly
                />
              </div>
              <div className="flex items-center justify-start gap-2 w-full">
                <label className="font-normal text-lg">Nature:</label>
                <div className="relative w-full">
                  <Select // Use react-select
                    required
                    name="natureOfRequest"
                    className=" w-full border-b-2 border-gray-400    focus:outline-none"
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
                    options={data.map((option) => ({
                      value: option.natureRequest,
                      label: option.natureRequest,
                    }))}
                    placeholder="select..."
                    styles={customStyles}
                  />
                </div>
              </div>

              <div className="flex items-center justify-start gap-2 w-full">
                <label className="font-normal text-lg">Unit:</label>
                <div className="relative w-full">
                  <Select // Use react-select
                    required
                    classNamePrefix={"select"}
                    name="unit"
                    className=" w-full border-b-2 border-gray-400    focus:outline-none"
                    value={selectedUnit} // Set selected value
                    onChange={(selectedOption) => {
                      setSelectedUnit(selectedOption); // Update selected option
                      changeUserFieldHandler({
                        target: {
                          name: "unit",
                          value: selectedOption ? selectedOption.value : "",
                        },
                      });
                    }}
                    options={units.map((option) => ({
                      value: option.utilityCategory,
                      label: option.utilityCategory,
                    }))}
                    placeholder="select..."
                    styles={customStyles}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 w-full  ">
                <div className="flex items-center gap-2">
                  <label className="font-normal text-lg">Property No:</label>
                </div>
                <input
                  required
                  type="text"
                  id="propertyNo"
                  name="propertyNo"
                  className=" w-full border-b-2 border-gray-400   py-2 px-4 focus:outline-none"
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>

              <div className="flex items-center justify-center gap-2 w-full ">
                <label htmlFor="serialNo" className="font-normal text-lg ">
                  Serial No:
                </label>
                <input
                  required
                  type="text"
                  id="serialNo"
                  name="serialNo"
                  className=" w-full border-b-2 border-gray-400   py-2 px-4 focus:outline-none"
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>

              <div className="flex items-center justify-center gap-2 w-full ">
                <label htmlFor="dateProcured" className="font-normal text-lg ">
                  Date Procured:
                </label>
                <input
                  type="date"
                  id="dateProcured"
                  name="dateProcured"
                  className=" w-full border-b-2 border-gray-400   py-2 px-4 focus:outline-none"
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>
              <div className="flex flex-col lg:w-1/4 ">
                <input
                  hidden
                  className=" w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
                />
              </div>

              <div className="flex flex-col col-span-full w-full ">
                <label htmlFor="message" className="font-normal text-lg">
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
              <div className="col-span-full flex lg:flex-row flex-col lg:gap-0 gap-4">
                <div className="flex items-center justify-center gap-2 w-full lg:w-[40%] ">
                  <label
                    htmlFor="authorizedBy"
                    className="font-normal lg:whitespace-nowrap text-lg "
                  >
                    Authorized By:
                  </label>
                  <input
                    required
                    type="text"
                    id="authorizedBy"
                    name="authorizedBy"
                    value={author}
                    className="  w-full border-b-2 border-gray-400   py-2 px-4 focus:outline-none"
                    readOnly
                  />
                </div>
                <Button
                  loading={loading}
                  htmlType="submit"
                  className="bg-main h-14 text-lg font-sans font-semibold text-white hover:bg-opacity-90 hover:text-white flex gap-3 items-center rounded-lg ml-auto"
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: "#ffffff" }}
                  />
                  {loading ? "Requesting" : "Request Service"}
                </Button>
              </div>
              <p></p>
            </form>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Requests;
