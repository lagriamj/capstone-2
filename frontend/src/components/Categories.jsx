import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Modal, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { QuestionCircleOutlined } from "@ant-design/icons";
import UpdateCategoryModal from "./UpdateCategoryModal";

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

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
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      if (response.status === 200) {
        setCategories(response.data.results);
      } else {
        console.error("Failed to category. Response:", response);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/categorydelete/${id}`
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

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        axios
          .post("http://127.0.0.1:8000/api/add-category", values)
          .then((response) => {
            console.log(response.data);
            setIsModalVisible(false);
            fetchCategory();
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-auto">
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
        <table className="w-full">
          <thead>
            <tr className="bg-main text-white h-[8vh]">
              <th className="w-[10%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                #
              </th>
              <th className="w-[40%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                Category
              </th>
              <th className="w-[40%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr
                key={category.id}
                className="border-b-2 border-gray-200 h-auto overflow-auto"
              >
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {index + 1}
                </td>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {category.utilityCategory}
                </td>
                <td>
                  <div className="flex items-center justify-center">
                    <button
                      className="text-white text-base font-medium bg-blue-600 py-2 px-4 rounded-lg"
                      onClick={() => openUpdateCategoryModal(category)}
                    >
                      Update
                    </button>
                    <Popconfirm
                      title="Confirmation"
                      description="Confirm deleting?. This action cannot be undone."
                      onConfirm={() => handleDelete(category.id)}
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
                      <button className="ml-1 text-white bg-red-700 rounded-lg px-3 py-2 text-lg font-medium">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </Popconfirm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        <Form form={form}>
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
            <Input className="h-12 text-base" placeholder="Category Name" />
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
              onClick={handleSubmit}
              color="primary"
              style={{ width: "5rem", height: "2.5rem" }}
            >
              Add
            </Button>
          </div>
        </Form>
      </Modal>

      {isUpdateCategoryModalVisible && selectedCategoryForUpdate && (
        <UpdateCategoryModal
          isOpen={isUpdateCategoryModalVisible}
          onCancel={() => setUpdateCategoryModalVisible(false)}
          onUpdate={() => setUpdateCategoryModalVisible(false)}
          categorytData={selectedCategoryForUpdate}
          refreshData={() => fetchCategory()}
        />
      )}
    </div>
  );
};

export default Categories;
