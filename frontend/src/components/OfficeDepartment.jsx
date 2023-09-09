import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { Button, Input, Modal, Form, Popconfirm, message } from "antd";
import axios from "axios";
import { QuestionCircleOutlined } from "@ant-design/icons";
import UpdateDepertmentModal from "./UpdateDepertmentModal";

const OfficeDepartment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // start fetch office or deparment
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    axios
      .get("http://127.0.0.1:8000/api/office-list")
      .then((response) => {
        setDepartments(response.data.results);
      })
      .catch((error) => {
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

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-auto ">
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
            <tr className="bg-main h-[8vh] text-white">
              <th className="w-[10%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                #
              </th>
              <th className="w-[35%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                Office/Department
              </th>
              <th className=" px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                Head
              </th>
              <th className="px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department, index) => (
              <tr
                key={department.id}
                className="border-b-2 border-gray-200 h-auto overflow-auto"
              >
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {index + 1}
                </td>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {department.office}
                </td>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {department.head}
                </td>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  <div className="flex items-center justify-center">
                    <button
                      className="text-white text-base font-medium bg-blue-600 py-2 px-4 rounded-lg"
                      onClick={() => openUpdateDepartmentModal(department)}
                    >
                      Update
                    </button>
                    <Popconfirm
                      title="Confirmation"
                      description="Confirm deleting?. This action cannot be undone."
                      onConfirm={() => handleDelete(department.id)}
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
      {isUpdateDepartmentModalVisible && selectedDepartmentForUpdate && (
        <UpdateDepertmentModal
          isOpen={isUpdateDepartmentModalVisible}
          onCancel={() => setUpdateDepartmentModalVisible(false)}
          onUpdate={() => setUpdateDepartmentModalVisible(false)}
          departmentData={selectedDepartmentForUpdate}
          refreshData={() => fetchDepartments()}
        />
      )}
    </div>
  );
};

export default OfficeDepartment;
