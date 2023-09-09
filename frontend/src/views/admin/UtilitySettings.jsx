import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Tab, Tabs, useMediaQuery } from "@mui/material";
import OfficeDepartment from "../../components/OfficeDepartment";
import Categories from "../../components/Categories";
import NatureOfRequest from "../../components/NatureOfRequest";
import Technicians from "../../components/Technicians";
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
  const isMobile = useMediaQuery("(max-width:600px)");

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
          } w-full lg:h-[90vh] relative mt-28 lg:mt-0   h-[80vh] pb-10 bg-white shadow-xl  lg:ml-72  border-0 border-gray-400  rounded-lg flex flex-col items-center font-sans`}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            centered={isMobile ? false : true}
            className="w-full"
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            <Tab
              label="Office/Department"
              style={{ fontSize: "0.875rem", lineHeight: "1.25rem" }}
            />
            <Tab label="Categories" />
            <Tab label="Nature of Request" />
            <Tab label="Technician" />
          </Tabs>
          <div className="w-full h-screen  text-center">
            {tabValue === 0 && <OfficeDepartment />}
            {tabValue === 1 && <Categories />}
            {tabValue === 2 && <NatureOfRequest />}
            {tabValue === 3 && <Technicians />}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default UtilitySettings;
