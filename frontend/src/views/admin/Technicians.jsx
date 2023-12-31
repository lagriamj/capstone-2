import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  message,
} from "antd";
import axios from "axios";
import UpdateTechnicianModal from "../../components/UpdateTechnicianModal";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";

const Technicians = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [technicians, setTechnicians] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSingleTechnician, setIsSingleTechnician] = useState(false);
  const [loading, setLoading] = useState(true);

  const showAddNewModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsUpdating(true);
    form
      .validateFields()
      .then((values) => {
        axios
          .post(
            `${import.meta.env.VITE_API_BASE_URL}/api/add-technician`,
            values
          )
          .then((response) => {
            setIsModalVisible(false);
            fetchTechnicians();
            setIsUpdating(false);
          })
          .catch((error) => {
            console.error(error);
            setIsUpdating(false);
          });
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
        setIsUpdating(false);
      });
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/technician-list`)
      .then((response) => {
        setTechnicians(response.data.results);
        setIsSingleTechnician(response.data.results.length === 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleDeleteTechnician = (technicianId) => {
    axios
      .delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/delete-technician/${technicianId}`
      )
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        const updatedTechnicians = technicians.filter(
          (technician) => technician.id !== technicianId
        );
        setTechnicians(updatedTechnicians);
        message.success("Deleted Successfully");
      })
      .catch((error) => {
        console.error("Error deleting technician:", error);
      });
  };

  const [isUpdateTechnicianModalVisible, setUpdateTechnicianModalVisible] =
    useState(false);
  const [selectedTechnicianForUpdate, setSelectedTechnicianForUpdate] =
    useState(null);

  const openUpdateTechnicianModal = (technician) => {
    setSelectedTechnicianForUpdate(technician);
    setUpdateTechnicianModalVisible(true);
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
  const records = technicians.slice(firstIndex, lastIndex);

  const npage = Math.ceil(technicians.length / recordsPage);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((item) => {
    const matchesSearchQuery =
      item.id.toString().includes(searchQuery.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchQuery.toLowerCase());

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
                Technicians
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
                isSingleTechnician ? "h-screen" : ""
              } rounded-lg w-full`}
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="bg-gray-200 ">
                    <th
                      className={`w-64 pl-20  ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      #
                    </th>
                    <th
                      className={`w-64 pl-20  ${
                        isScreenWidth1366 ? "py-3 text-sm" : "py-5 text-base"
                      } font-semibold tracking-wider text-left whitespace-nowrap`}
                    >
                      Technician
                    </th>
                    <th
                      className={`w-64 pl-20  ${
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
                  ) : technicians.length === 0 ? (
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
                          className={`lg:pl-20 pl-4 border-b-2 px-3 py-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } border-gray-200 text-left`}
                        >
                          {item.technician}
                        </td>
                        <td
                          className={`lg:pl-20 pl-4 border-b-2 px-3 py-3 ${
                            isScreenWidth1366 ? "text-sm" : " text-lg"
                          } border-gray-200 text-left`}
                        >
                          <div className="flex ">
                            <button
                              className={`text-white ${
                                isScreenWidth1366 ? "text-xs" : " text-base"
                              } font-medium bg-blue-600 py-2 px-4 rounded-lg`}
                              onClick={() => openUpdateTechnicianModal(item)}
                            >
                              Update
                            </button>
                            <Popconfirm
                              title="Confirmation"
                              description="Confirm deleting?. This action cannot be undone."
                              onConfirm={() => handleDeleteTechnician(item.id)}
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
                title="Create New Technician"
              >
                <Form
                  form={form}
                  className={`${
                    isScreenWidth1366 ? "flex flex-col gap-6" : ""
                  } `}
                >
                  <Form.Item
                    name="technician"
                    label={
                      <label
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          fontFamily: "Poppins",
                        }}
                      >
                        Technician Name
                      </label>
                    }
                    labelAlign="top"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please enter the technician name",
                      },
                    ]}
                    style={{ height: "8vh" }}
                  >
                    <Input
                      className="h-12 text-base"
                      placeholder="Technician Name"
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
              {isUpdateTechnicianModalVisible &&
                selectedTechnicianForUpdate && (
                  <UpdateTechnicianModal
                    isOpen={isUpdateTechnicianModalVisible}
                    onCancel={() => setUpdateTechnicianModalVisible(false)}
                    onUpdate={() => setUpdateTechnicianModalVisible(false)}
                    technicianData={selectedTechnicianForUpdate}
                    refreshData={() => fetchTechnicians()}
                    isScreenWidth1366={isScreenWidth1366}
                  />
                )}
            </div>
          </div>
          <nav className="mr-auto lg:ml-56">
            <ul className="flex gap-2 items-center">
              <li className="flex-auto ml-10 mediumLg:text-sm lg:ml-20 mr-2">
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
                  onKeyDown={handlePageInputKeyPress} // Trigger page change when Enter key is pressed
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

export default Technicians;
