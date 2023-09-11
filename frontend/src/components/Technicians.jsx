import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Popconfirm, message } from "antd";
import axios from "axios";
import UpdateTechnicianModal from "./UpdateTechnicianModal";
import { QuestionCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const Technicians = ({ isLargeScreen }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [technicians, setTechnicians] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

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
          .post("http://127.0.0.1:8000/api/add-technician", values)
          .then((response) => {
            console.log(response.data);
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
        console.log("Validation failed:", errorInfo);
        setIsUpdating(false);
      });
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = () => {
    axios
      .get("http://127.0.0.1:8000/api/technician-list")
      .then((response) => {
        setTechnicians(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteTechnician = (technicianId) => {
    axios
      .delete(`http://127.0.0.1:8000/api/delete-technician/${technicianId}`)
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

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-auto">
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
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 h-[8vh] text-main">
              <th className="w-[10%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                #
              </th>
              <th className="w-[10%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                Technician
              </th>
              <th className="w-[10%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((technician, index) => (
              <tr key={index}>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {index + 1}
                </td>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {technician.technician}
                </td>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  <div className="flex items-center justify-center">
                    <button
                      className="text-white text-base font-medium bg-blue-600 py-2 px-4 rounded-lg"
                      onClick={() => openUpdateTechnicianModal(technician)}
                    >
                      Update
                    </button>
                    <Popconfirm
                      title="Confirmation"
                      description="Confirm deleting?. This action cannot be undone."
                      onConfirm={() => handleDeleteTechnician(technician.id)}
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
        title="Create New Technician"
      >
        <Form form={form}>
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
            <Input className="h-12 text-base" placeholder="Technician Name" />
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
      {isUpdateTechnicianModalVisible && selectedTechnicianForUpdate && (
        <UpdateTechnicianModal
          isOpen={isUpdateTechnicianModalVisible}
          onCancel={() => setUpdateTechnicianModalVisible(false)}
          onUpdate={() => setUpdateTechnicianModalVisible(false)}
          technicianData={selectedTechnicianForUpdate}
          refreshData={() => fetchTechnicians()}
        />
      )}
    </div>
  );
};

Technicians.propTypes = {
  isLargeScreen: PropTypes.bool.isRequired,
};

export default Technicians;
