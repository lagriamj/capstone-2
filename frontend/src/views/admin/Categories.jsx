import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  message,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import UpdateCategoryModal from "../../components/UpdateCategoryModal";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSingleCategory, setIsSingleCategory] = useState(false);
  const [loading, setLoading] = useState(true);

  const showAddNewModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/category-list"
      );
      if (response.status === 200) {
        setCategories(response.data.results);
        setIsSingleCategory(response.data.results.length === 1);
        setLoading(false);
      } else {
        console.error("Failed to category. Response:", response);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setLoading(false);
    }
  };

  const [isUpdateCategoryModalVisible, setUpdateCategoryModalVisible] =
    useState(false);
  const [selectedCategoryForUpdate, setSelectedCategoryForUpdate] =
    useState(null);

  const openUpdateCategoryModal = (category) => {
    setSelectedCategoryForUpdate(category);
    setUpdateCategoryModalVisible(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/delete-category/${id}`
      );
      if (response.status === 200) {
        fetchCategory();
        message.success("Deleted Successfully");
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSubmitCategory = () => {
    setIsUpdating(true);
    form
      .validateFields()
      .then((values) => {
        axios
          .post("http://127.0.0.1:8000/api/add-category", values)
          .then((response) => {
            console.log(response.data);
            setIsModalVisible(false);
            fetchCategory();
            setIsUpdating(false);
          })
          .catch((error) => {
            console.error(error);
            setIsUpdating(false);
          });
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
        setIsUpdating(false);
      });
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
  const isWidth1920 = window.innerWidth === 1920;

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 10;

  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = categories.slice(firstIndex, lastIndex);

  const npage = Math.ceil(categories.length / recordsPage);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((item) => {
    const matchesSearchQuery =
      item.id.toString().includes(searchQuery.toLowerCase()) ||
      item.utilityCategory.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearchQuery;
  });

  const [pageInput, setPageInput] = useState("");

  const goToPage = () => {
    const pageNumber = parseInt(pageInput);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= npage) {
      setCurrentPage(pageNumber);
      setPageInput(""); // Clear the input field after changing the page
    } else {
      // Handle invalid page number input, e.g., show an error message to the user
      message.error("Invalid page number. Please enter a valid page number.");
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputBlur = () => {
    goToPage(); // Trigger page change when the input field loses focus
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === "Enter") {
      goToPage(); // Trigger page change when the Enter key is pressed
    }
  };

  const [windowWidth1366, setWindowWidth1366] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth1366(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isScreenWidth1366 = windowWidth1366 === 1366;

  return (
    <HelmetProvider>
      <Helmet>
        <title>Technicians</title>
      </Helmet>
      <div
        className={`className="flex flex-col lg:flex-row bg-gray-200 ${
          isWidth1920
            ? "lg:pl-20"
            : isScreenWidth1366
            ? "lg:pl-[0.5rem]"
            : "lg:pl-[3.0rem]"
        } lg:pt-5 h-screen`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        {isLargeScreen ? (
          <Box
            sx={{
              position: "fixed",
              right: 20,
              bottom: 20,
              zIndex: 100,
            }}
          >
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              sx={{
                paddingX: 3,
                paddingY: 4,
                backgroundColor: "#2d3748",
                fontSize: "large",
              }}
              onClick={showAddNewModal}
            >
              <AddIcon sx={{ mr: 1 }} /> Add New
            </Fab>
          </Box>
        ) : (
          <Box
            sx={{
              position: "fixed",
              right: 20,
              bottom: 20,
              zIndex: 100,
            }}
          >
            <Fab
              color="primary"
              aria-label="add"
              sx={{
                backgroundColor: "#2d3748",
                fontSize: "large",
              }}
              onClick={showAddNewModal}
            >
              <AddIcon />
            </Fab>
          </Box>
        )}
        <div className="flex flex-col lg:pb-10 bg-gray-200 gap-2 lg:w-full">
          <div
            className={`overflow-x-auto ${
              isWidth1920
                ? "lg:w-[84%]  lg:ml-[16.6rem]"
                : isScreenWidth1366
                ? "lg:w-[82%]  lg:ml-[14.5rem]"
                : "lg:w-[82%]  lg:ml-72"
            } w-[90%] lg:h-[90vh] relative mt-20 lg:mt-0 ml-5  h-[80vh] pb-10 bg-white shadow-xl    border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans`}
          >
            <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
              <h1
                className={`font-sans flex items-center justify-center  ${
                  isScreenWidth1366 ? "text-xl" : "lg:text-3xl text-xl"
                }  ml-5 mr-auto tracking-wide`}
              >
                Categories
              </h1>
              <div className="relative flex items-center lg:mr-10 ">
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`${
                    isScreenWidth1366 ? "w-4 h-4" : "w-6 h-6"
                  } absolute ml-3 text-main`}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className={`border rounded-3xl bg-gray-100 text-black my-5 pl-12 pr-5 lg:w-full w-[90%] focus:outline-none ${
                    isScreenWidth1366 ? "text-sm h-10" : "text-xl h-14"
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div
              className={`overflow-auto h-[90vh] ${
                isSingleCategory ? "h-screen" : ""
              } rounded-lg w-full`}
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="bg-gray-200 ">
                    <th
                      className={`w-64 lg:pl-20 pl-4 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      #
                    </th>
                    <th
                      className={`w-64 pl-20 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Category
                    </th>
                    <th
                      className={`w-64  pl-20 ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="">
                      <td colSpan="8">
                        <Skeleton active />
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr className="h-[50vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No Records Yet.
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr className="h-[50vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No records found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((item) => (
                      <tr key={item.id}>
                        <td
                          className={`lg:pl-20 pl-4 border-b-2 px-3 py-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } border-gray-200 text-left`}
                        >
                          {item.id}
                        </td>
                        <td
                          className={`border-b-2 pl-20 py-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } border-gray-200 text-left whitespace-nowrap`}
                        >
                          {item.utilityCategory}
                        </td>
                        <td
                          className={`py-3  pl-20 border-b-2 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } text-gray-700 whitespace-nowrap text-center font-medium`}
                        >
                          <div className="flex ">
                            <button
                              className={`text-white ${
                                isScreenWidth1366 ? "text-xs" : " text-base"
                              } font-medium bg-blue-600 py-2 px-4 rounded-lg`}
                              onClick={() => openUpdateCategoryModal(item)}
                            >
                              Update
                            </button>
                            <Popconfirm
                              title="Confirmation"
                              description="Confirm deleting?. This action cannot be undone."
                              onConfirm={() => handleDeleteCategory(item.id)}
                              okText="Yes"
                              cancelText="No"
                              placement="left"
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              okButtonProps={{
                                className:
                                  "border-2 border-gray-200 text-black",
                                size: "large",
                              }}
                              cancelButtonProps={{
                                className:
                                  "border-2 border-gray-200 text-black",
                                size: "large",
                              }}
                            >
                              <button
                                className={`ml-1 text-white bg-red-700 rounded-lg px-3 py-2 ${
                                  isScreenWidth1366 ? "text-xs" : " text-lg"
                                } font-medium`}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </Popconfirm>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Modal
                open={isModalVisible}
                onClose={handleCancel}
                onCancel={handleCancel}
                //onOk={handleOk}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                footer={null}
                title="Create New Category"
              >
                <Form
                  form={form}
                  className={`${
                    isScreenWidth1366 ? "flex flex-col gap-6" : ""
                  } `}
                >
                  <Form.Item
                    name="utilityCategory"
                    label={
                      <label
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          fontFamily: "Poppins",
                        }}
                      >
                        Category
                      </label>
                    }
                    labelAlign="top"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter the category name",
                      },
                    ]}
                    style={{ height: "8vh" }}
                  >
                    <Input
                      className="h-12 text-base"
                      placeholder="Category Name"
                    />
                  </Form.Item>

                  <div className="flex justify-end">
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      style={{
                        marginRight: "1rem",
                        width: "5rem",
                        height: "2.5rem",
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmitCategory}
                      color="primary"
                      style={{ width: "5rem", height: "2.5rem" }}
                      loading={isUpdating}
                    >
                      {isUpdating ? "..." : "Add"}
                    </Button>
                  </div>
                </Form>
              </Modal>

              {isUpdateCategoryModalVisible && selectedCategoryForUpdate && (
                <UpdateCategoryModal
                  isOpen={isUpdateCategoryModalVisible}
                  onCancel={() => setUpdateCategoryModalVisible(false)}
                  onUpdate={() => setUpdateCategoryModalVisible(false)}
                  categoryData={selectedCategoryForUpdate}
                  refreshData={() => fetchCategory()}
                  isScreenWidth1366={isScreenWidth1366}
                />
              )}
            </div>
          </div>
          <nav className="mr-auto lg:ml-56">
            <ul className="flex gap-2 items-center">
              <li className="flex-auto mediumLg:text-sm ml-10 lg:ml-20 mr-2">
                Page {currentPage} of {npage}
              </li>
              <li>
                <a
                  href="#"
                  onClick={prePage}
                  className={`pagination-link bg-main flex items-center justify-center hover:bg-opacity-95 text-white font-bold py-3 px-4 rounded`}
                >
                  <LeftOutlined
                    style={{
                      fontSize: isScreenWidth1366 ? ".8rem" : "",
                    }}
                  />
                </a>
              </li>
              <li className="flex items-center">
                <input
                  type="number"
                  placeholder="Page"
                  className="border rounded-lg mediumLg:text-sm mediumLg:py-1 bg-gray-100 py-2 px-4 text-black w-24  text-center outline-none"
                  value={pageInput}
                  onChange={handlePageInputChange}
                  onBlur={handlePageInputBlur} // Trigger page change when the input field loses focus
                  onKeyPress={handlePageInputKeyPress} // Trigger page change when Enter key is pressed
                />
              </li>
              <li>
                <a
                  href="#"
                  onClick={nextPage}
                  className={`pagination-link bg-main flex items-center justify-center hover:bg-opacity-95 text-white font-bold py-3 px-4 rounded`}
                >
                  <RightOutlined
                    style={{
                      fontSize: isScreenWidth1366 ? ".8rem" : "",
                    }}
                  />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </HelmetProvider>
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  //function changeCPage(id) {
  //setCurrentPage(id);
  //}
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default Categories;