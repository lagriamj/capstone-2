import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import OfficeDepartment from "./OfficeDepartment";
import Categories from "./Categories";
import NatureOfRequest from "./NatureOfRequest";
import Technicians from "./Technicians";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "./Select.css";
{
  /*import axios from "axios";
import UtilityModal from "../../components/UtilityModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Popconfirm, Skeleton } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";*/
}

const UtilitySettings = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedOption, setSelectedOption] = useState("OfficeDepartment");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  //const [utilityCategory, setUtilityCategory] = useState("");
  {
    /* const [utilitySettings, setUtilitySettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedCategory, setUpdatedCategory] = useState("");
const [selectedCategoryId, setSelectedCategoryId] = useState(null); */
  }

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
  const isWidth1980 = window.innerWidth === 1980;

  return (
    <HelmetProvider>
      <Helmet>
        <title>Utility Settings</title>
      </Helmet>
      <div
        className={`className="flex flex-col lg:flex-row bg-gray-200 ${
          isWidth1980 ? "lg:pl-20" : "lg:pl-[3.0rem]"
        } lg:py-5 h-screen`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div
          className={`overflow-x-auto ${
            isWidth1980 ? "lg:w-[83%]" : "lg:w-[82%]"
          } w-full lg:h-[90vh] relative mt-28 lg:mt-0 h-[80vh] pb-10 bg-white shadow-xl  lg:ml-72  border-0 border-gray-400  rounded-lg flex flex-col items-center font-sans`}
        >
          <div className="h-[12vh] w-full bg-main">
            <div className="">
              <div className="flex items-center">
                <Select
                  fullWidth
                  style={{
                    color: "white",
                    border: "none",
                    fontSize: "1.125rem",
                    lineHeight: "1.75rem",
                    fontFamily: "Poppins",
                  }}
                  value={selectedOption}
                  onChange={handleOptionChange}
                  //className="ml-2"
                >
                  <MenuItem value="OfficeDepartment">
                    Office/Department
                  </MenuItem>
                  <MenuItem value="Categories">Categories</MenuItem>
                  <MenuItem value="NatureOfRequest">Nature of Request</MenuItem>
                  <MenuItem value="Technicians">Technician</MenuItem>
                </Select>
              </div>
            </div>
            <div className="w-full h-auto text-center">
              {selectedOption === "OfficeDepartment" && (
                <OfficeDepartment isLargeScreen={isLargeScreen} />
              )}
              {selectedOption === "Categories" && (
                <Categories isLargeScreen={isLargeScreen} />
              )}
              {selectedOption === "NatureOfRequest" && (
                <NatureOfRequest isLargeScreen={isLargeScreen} />
              )}
              {selectedOption === "Technicians" && (
                <Technicians isLargeScreen={isLargeScreen} />
              )}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default UtilitySettings;
