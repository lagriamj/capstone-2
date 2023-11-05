import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
  Table,
  Select,
} from "antd";
import axios from "axios";
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import UpdateDepertmentModal from "../../components/UpdateDepertmentModal";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AdminDrawer from "../../components/AdminDrawer";
import AdminSidebar from "../../components/AdminSidebar";

const OfficeDepartment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [heads, setHeads] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const { Option } = Select;
  // start fetch office or deparment
  useEffect(() => {
    fetchDepartments();
    fetchHeads();
  }, []);

  const fetchDepartments = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/office-list`)
      .then((response) => {
        setDepartments(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  const fetchHeads = () => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/head-list`)
      .then((response) => {
        setHeads(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const customFilterOption = (inputValue, option) =>
    option.value?.toLowerCase().includes(inputValue.toLowerCase());
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
          .post(`${import.meta.env.VITE_API_BASE_URL}/api/add-office`, values)
          .then((response) => {
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
        console.log(errorInfo);
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
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/delete-office/${id}`)
      .then((response) => {
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

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  const filteredOffice = departments.filter((request) => {
    const searchTextLower = searchText.toLowerCase();

    const shouldIncludeRow = Object.values(request).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTextLower);
      } else if (typeof value === "number") {
        return value.toString().toLowerCase().includes(searchTextLower);
      } else if (value instanceof Date) {
        // Handle Date objects
        const formattedDate = value.toLocaleString();
        return formattedDate.toLowerCase().includes(searchTextLower);
      }
      return false;
    });

    return shouldIncludeRow;
  });

  const handleSearchBar = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 }); // Reset to the first page when searching
  };

  const officeColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Office/Department",
      dataIndex: "office",
      key: "office",
    },
    {
      title: "Head",
      dataIndex: "head",
      key: "head",
    },
    {
      title: "Action",
      dataIndex: "x",
      key: "x",
      render: (index, record) => (
        <div className="flex ">
          <button
            className={`text-white ${
              isScreenWidth1366 ? "text-xs" : " text-base"
            } font-medium bg-blue-600 py-2 px-4 rounded-lg`}
            onClick={() => openUpdateDepartmentModal(record)}
          >
            Update
          </button>
          <Popconfirm
            title="Confirmation"
            description="Confirm deleting?. This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            okButtonProps={{
              className: "border-2 border-gray-200 text-black",
              size: "large",
            }}
            cancelButtonProps={{
              className: "border-2 border-gray-200 text-black",
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
      ),
    },
  ];

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
              <div className="flex lg:flex-col flex-row lg:gap-0 gap-2">
                <h1 className="flex text-black items-center lg:text-3xl font-semibold ">
                  Offices
                </h1>
                <span className="text-black mr-auto">
                  Total offices: {departments.length}
                </span>
              </div>

              <div className="relative flex items-center justify-center lg:mr-auto lg:ml-4 ">
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => handleSearchBar(e.target.value)}
                  className="my-4 h-12"
                />
              </div>
            </div>
            <div
              className={`overflow-auto h-auto shadow-xl  pb-5 rounded-lg w-full`}
            >
              <Table
                columns={officeColumns}
                dataSource={filteredOffice}
                loading={{
                  indicator: <LoadingOutlined style={{ fontSize: 50 }} />,
                  spinning: loading,
                }}
                pagination={pagination}
                onChange={(newPagination) => setPagination(newPagination)}
                rowKey={(record) => record.id}
              />
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
                    <Select
                      size="large"
                      showSearch
                      filterOption={customFilterOption}
                    >
                      {heads.map((option) => (
                        <Option
                          key={option.userID}
                          value={`${option.userFirstName} ${option.userLastName}`}
                        >
                          {`${option.userFirstName} ${option.userLastName}`}
                        </Option>
                      ))}
                    </Select>
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
                    headList={heads}
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default OfficeDepartment;
