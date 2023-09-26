import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  Form,
  Popconfirm,
  message,
  Skeleton,
} from "antd";
import axios from "axios";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import UpdateDepertmentModal from "../../components/UpdateDepertmentModal";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AdminDrawer from "../../components/AdminDrawer";
import AdminSidebar from "../../components/AdminSidebar";

const OfficeDepartment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  // start fetch office or deparment
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/office-list")
      .then((response) => {
        setDepartments(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };
  // end fetch office or deparment

  // start add office or deparment
  const showAddNewModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsUpdating(true);
    form
      .validateFields()
      .then((values) => {
        axios
          .post("http://127.0.0.1:8000/api/add-office", values)
          .then((response) => {
            console.log(response.data);
            setIsModalVisible(false);
            fetchDepartments();
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

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };
  // end add office or deparment

  // start delete office or deparment
  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/delete-office/${id}`)
      .then((response) => {
        console.log(response.data);
        fetchDepartments();
        message.success("Deleted Successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [isUpdateDepartmentModalVisible, setUpdateDepartmentModalVisible] =
    useState(false);
  const [selectedDepartmentForUpdate, setSelectedDepartmentForUpdate] =
    useState(null);

  const openUpdateDepartmentModal = (department) => {
    setSelectedDepartmentForUpdate(department);
    setUpdateDepartmentModalVisible(true);
    console.log(selectedDepartmentForUpdate);
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

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 10;

  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = departments.slice(firstIndex, lastIndex);

  const npage = Math.ceil(departments.length / recordsPage);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((item) => {
    const matchesSearchQuery =
      item.id.toString().includes(searchQuery.toLowerCase()) ||
      item.office.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.head.toLowerCase().includes(searchQuery.toLowerCase());

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
        <title>Office/Departments</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col gotoLarge:px-6 large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
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
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto lg:ml-auto lg:mx-4  mt-20 lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <h1 className="flex text-black items-center lg:text-2xl text-base font-semibold ">
                Offices
              </h1>
              <div className="relative flex items-center lg:mr-auto lg:ml-4 ">
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`w-4 h-4 absolute ml-3 text-main`}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className={`border rounded-3xl bg-gray-100 text-black my-5 pl-12 pr-5 w-full focus:outline-none text-base h-10`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div
              className={`overflow-auto h-auto shadow-xl  pb-5 rounded-lg w-full`}
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="bg-secondary text-white ">
                    <th
                      className={`w-64 lg:pl-20 pl-4 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      #
                    </th>
                    <th
                      className={`w-64 pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Office/Department
                    </th>
                    <th
                      className={`w-64 pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Head
                    </th>
                    <th
                      className={`w-64  pl-5 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
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
                  ) : departments.length === 0 ? (
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
                          className={`lg:pl-20 pl-4 border-b-2 px-3  py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left`}
                        >
                          {item.id}
                        </td>
                        <td
                          className={`border-b-2 pl-5  py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left whitespace-nowrap`}
                        >
                          {item.office}
                        </td>
                        <td
                          className={`border-b-2 pl-5  py-2 large:py-3 large:text-lg text-sm border-gray-200 text-left whitespace-nowrap`}
                        >
                          {item.head}
                        </td>
                        <td
                          className={` py-2 large:py-3 large:text-lg text-sm pl-5 border-b-2 text-gray-700 whitespace-nowrap text-center font-medium`}
                        >
                          <div className="flex ">
                            <button
                              className={`text-white ${
                                isScreenWidth1366 ? "text-xs" : " text-base"
                              } font-medium bg-blue-600 py-2 px-4 rounded-lg`}
                              onClick={() => openUpdateDepartmentModal(item)}
                            >
                              Update
                            </button>
                            <Popconfirm
                              title="Confirmation"
                              description="Confirm deleting?. This action cannot be undone."
                              onConfirm={() => handleDelete(item.id)}
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
                onOk={handleOk}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                footer={null}
                title="Create New Office/Department"
              >
                <Form
                  form={form}
                  className={`${
                    isScreenWidth1366 ? "flex flex-col gap-6" : ""
                  } `}
                >
                  <Form.Item
                    name="office"
                    label={
                      <label
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          fontFamily: "Poppins",
                        }}
                      >
                        Office/Department
                      </label>
                    }
                    labelAlign="top"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter the office/department name",
                      },
                    ]}
                    style={{ height: "8vh" }}
                  >
                    <Input
                      className="h-12 text-base"
                      placeholder="Office/Department Name"
                    />
                  </Form.Item>
                  <Form.Item
                    name="head"
                    label={
                      <label
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          fontFamily: "Poppins",
                        }}
                      >
                        Head of the Office
                      </label>
                    }
                    labelAlign="top"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter the head of the office",
                      },
                    ]}
                  >
                    <Input
                      className="h-12 text-base"
                      placeholder="Head of the Office"
                    />
                  </Form.Item>
                  <div className="flex justify-end">
                    <Button
                      className="bg-red-700 text-white"
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
                      onClick={handleOk}
                      color="primary"
                      style={{ width: "5rem", height: "2.5rem" }}
                      loading={isUpdating}
                    >
                      {isUpdating ? "..." : "Add"}
                    </Button>
                  </div>
                </Form>
              </Modal>
              {/* Update Modal */}
              {isUpdateDepartmentModalVisible &&
                selectedDepartmentForUpdate && (
                  <UpdateDepertmentModal
                    isOpen={isUpdateDepartmentModalVisible}
                    onCancel={() => setUpdateDepartmentModalVisible(false)}
                    onUpdate={() => setUpdateDepartmentModalVisible(false)}
                    departmentData={selectedDepartmentForUpdate}
                    refreshData={() => fetchDepartments()}
                    isScreenWidth1366={isScreenWidth1366}
                  />
                )}
            </div>
            <nav className={`  mt-2 px-2 `}>
              <ul className="flex gap-2 items-center">
                <li className="flex-auto  mr-5 text-base font-bold">
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
                    className={`border rounded-lg bg-gray-100  px-4 text-black w-24  text-center outline-none ${
                      isScreenWidth1366 ? "text-sm py-1" : "py-2"
                    }`}
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

export default OfficeDepartment;
