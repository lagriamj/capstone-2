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
  const [isSingleOfficeDepartment, setIsSingleOfficeDepartment] =
    useState(false);
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
        setIsSingleOfficeDepartment(response.data.results.length === 1);
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
  const isWidth1920 = window.innerWidth === 1920;

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

  return (
    <HelmetProvider>
      <Helmet>
        <title>Office/Departments</title>
      </Helmet>
      <div
        className={`className="flex flex-col lg:flex-row bg-gray-200 ${
          isWidth1920 ? "lg:pl-20" : "lg:pl-[3.0rem]"
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
                : "lg:w-[82%]  lg:ml-72"
            } w-[90%] lg:h-[90vh] relative mt-20 lg:mt-0 ml-5  h-4/5 pb-10 bg-white shadow-xl   border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans`}
          >
            <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
              <h1 className="font-sans lg:text-3xl text-base   flex items-center justify-center ml-5 mr-auto">
                Office/{!isLargeScreen ? <br /> : ""}Departments
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
            <div
              className={`overflow-auto h-[90vh] ${
                isSingleOfficeDepartment ? "h-screen" : ""
              } rounded-lg w-full`}
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="bg-gray-200 ">
                    <th className="w-64 lg:pl-20 pl-4 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      #
                    </th>
                    <th className="w-64 pl-5 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Office/Department
                    </th>
                    <th className="w-64 pl-5  py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Head
                    </th>
                    <th className="w-64  pl-5 py-5 text-base font-semibold tracking-wider text-left whitespace-nowrap">
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
                        <td className=" lg:pl-20 pl-4 border-b-2 px-3 py-3 border-gray-200 text-left">
                          {item.id}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left whitespace-nowrap">
                          {item.office}
                        </td>
                        <td className="border-b-2 pl-5 py-3 border-gray-200 text-left whitespace-nowrap">
                          {item.head}
                        </td>
                        <td className="py-3 text-lg pl-5 border-b-2 text-gray-700 whitespace-nowrap text-center font-medium">
                          <div className="flex ">
                            <button
                              className="text-white text-base font-medium bg-blue-600 py-2 px-4 rounded-lg"
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
                              <button className="ml-1 text-white bg-red-700 rounded-lg px-3 py-2 text-lg font-medium">
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
                <Form form={form}>
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
                  />
                )}
            </div>
          </div>
          <nav className="mr-auto lg:ml-56">
            <ul className="flex gap-2 items-center">
              <li className="flex-auto ml-10 lg:ml-20 mr-2">
                Page {currentPage} of {npage}
              </li>
              <li>
                <a
                  href="#"
                  onClick={prePage}
                  className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                >
                  <LeftOutlined />
                </a>
              </li>
              <li className="flex items-center">
                <input
                  type="number"
                  placeholder="Page"
                  className="border rounded-lg bg-gray-100 py-2 px-4 text-black w-24  text-center outline-none"
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
                  className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                >
                  <RightOutlined />
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

export default OfficeDepartment;
