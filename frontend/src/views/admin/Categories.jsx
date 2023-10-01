import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
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

  const filteredCategories = categories.filter((request) => {
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

  const categoryColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Category",
      dataIndex: "utilityCategory",
      key: "utilityCategory",
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
            onClick={() => openUpdateCategoryModal(record)}
          >
            Update
          </button>
          <Popconfirm
            title="Confirmation"
            description="Confirm deleting?. This action cannot be undone."
            onConfirm={() => handleDeleteCategory(record.id)}
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
        <title>Technicians</title>
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
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto lg:ml-auto lg:mx-4   mt-20 lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <div className="flex lg:flex-col flex-row lg:gap-0 gap-2">
                <h1 className="flex text-black items-center lg:text-3xl font-semibold ">
                  Category List
                </h1>
                <span className="text-black mr-auto">
                  Total Category: {categories.length}
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
                columns={categoryColumns}
                dataSource={filteredCategories}
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
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Categories;
