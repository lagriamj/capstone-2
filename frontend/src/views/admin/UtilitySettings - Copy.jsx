import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import UtilityModal from "../../components/UpdateCategoryModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { message } from "antd";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Popconfirm, Skeleton } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const UtilitySettings = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [utilityCategory, setUtilityCategory] = useState("");
  const [utilitySettings, setUtilitySettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

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
    fetchUtilitySettings();
  }, []);

  const isLargeScreen = windowWidth >= 1024;

  const fetchUtilitySettings = async () => {
    setIsFetchingData(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      if (response.status === 200) {
        setUtilitySettings(response.data.results);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/add-category",
        {
          utilityCategory,
        }
      );
      if (response.status === 201) {
        message.success("Added Successfully");
        setUtilityCategory("");
        fetchUtilitySettings();
        setIsLoading(false);
      } else {
        message.error("Adding Failed");
        console.error("Failed to create utility setting");
        setIsLoading(false);
      }
    } catch (error) {
      message.error("Adding Failed");
      console.error("Error creating utility setting:", error);
      setIsLoading(false);
    }
  };

  const handleUpdate = (id, category) => {
    setSelectedCategoryId(id);
    setUpdatedCategory(category);
    setUpdateModalVisible(true); // Set the modal to be visible
  };

  const handleUpdateSubmit = async () => {
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/category/${selectedCategoryId}`,
        {
          utilityCategory: updatedCategory,
        }
      );
      if (response.status === 200) {
        setIsUpdating(false);
        message.success("Updated Successfully");
        setUpdateModalVisible(false);
        setUpdatedCategory("");
        fetchUtilitySettings();
      } else {
        setIsUpdating(false);
        message.error("Update Failed");
        console.error("Failed to update utility setting");
      }
    } catch (error) {
      setIsUpdating(false);
      message.error("Update Failed");
      console.error("Error updating utility setting:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/categorydelete/${id}`
      );
      if (response.status === 200) {
        fetchUtilitySettings();
        message.success("Deleted Successfully");
      } else {
        console.error("Failed to delete utility setting");
      }
    } catch (error) {
      console.error("Error deleting utility setting:", error);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Utility Settings</title>
      </Helmet>
      <div className="flex flex-col lg:flex-row bg-gray-200 lg:pl-24 lg:py-5 h-screen">
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        <div className="overflow-x-auto lg:w-[80%] w-[90%] lg:min-h-[90vh] mx-5 mt-28 lg:mt-4 `h-4/5 pb-10 bg-white shadow-xl lg:ml-72 border-0 border-gray-400 rounded-3xl flex flex-col font-sans">
          <div className="w-full text-center bg-main text-white py-4">
            <h1 className="text-3xl">Utility Settings</h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-20 ml-10  p-4">
            <div className="mt-4 w-[80%] lg:w-[25%]">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col border-2 shadow-lg rounded-lg p-6 w-full bg-main"
              >
                <input
                  type="text"
                  placeholder="Enter Utility Category"
                  value={utilityCategory}
                  onChange={(e) => setUtilityCategory(e.target.value)}
                  className="w-full h-10 border-2 rounded-lg pl-4 pr-4 text-lg border-slate-400 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full h-10 text-lg font-medium border-2 rounded-lg bg-white text-main mt-2"
                >
                  {isLoading ? (
                    <PropagateLoader
                      color="#FFFFFF"
                      size={10}
                      className="mb-3"
                    />
                  ) : (
                    "Add Category"
                  )}
                </button>
              </form>
            </div>

            <div className="lg:w-1/2 w-[90%] h-auto shadow-lg overflow-auto rounded-xl">
              <table className="mt-4 border-2 rounded-lg w-full ">
                <thead className="bg-gray-50 border-b-2 border-gray-200 ">
                  <tr className="border-b-2 border-gray-200 bg-main text-white rounded-t-xl">
                    <th className="w-[20%] py-2 text-lg whitespace-nowrap font-semibold rounded-tl-lg">
                      #
                    </th>
                    <th className="w-[40%] text-center whitespace-nowrap py-2 text-lg font-semibold">
                      Category
                    </th>
                    <th className="w-[40%] py-2 text-lg font-semibold whitespace-nowrap rounded-tr-lg">
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
                      <tr
                        key={setting.id}
                        className="border-y-2 border-gray-200"
                      >
                        <td className="w-20 text-center text-lg font-medium">
                          {index + 1}
                        </td>
                        <td className="text-center text-lg font-medium">
                          {setting.utilityCategory}
                        </td>
                        <td className="text-center p-1">
                          <button
                            className="text-white bg-blue-500 px-3 py-2 rounded-lg"
                            onClick={() =>
                              handleUpdate(setting.id, setting.utilityCategory)
                            }
                          >
                            Update
                          </button>
                          <Popconfirm
                            title="Are you sure you want to delete this category?"
                            onConfirm={() => handleDelete(setting.id)}
                            okText="Yes"
                            cancelText="No"
                            icon={
                              <QuestionCircleOutlined
                                style={{ color: "red" }}
                              />
                            }
                            okButtonProps={{
                              className: "border-2 border-gray-200 text-black",
                              size: "large",
                            }}
                            cancelButtonProps={{
                              className: "border-2 border-gray-200 text-black",
                              size: "large",
                            }}
                          >
                            <button className="ml-1 text-white bg-red-700 rounded-lg px-3 py-2 text-lg font-medium">
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </Popconfirm>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {isUpdateModalVisible && (
              <UtilityModal
                isOpen={isUpdateModalVisible}
                onClose={() => setUpdateModalVisible(false)}
                onUpdate={handleUpdateSubmit}
                updatedCategory={updatedCategory}
                onChange={(e) => setUpdatedCategory(e.target.value)}
                onSavingUpdate={isUpdating}
              />
            )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default UtilitySettings;
