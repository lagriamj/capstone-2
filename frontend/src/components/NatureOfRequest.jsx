import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Modal, Popconfirm, message } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import UpdateNatureModal from "./UpdateNatureModal";
import { QuestionCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const NatureOfRequest = ({ isLargeScreen }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [natureRequests, setNatureRequests] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOk = () => {
    setIsUpdating(true);
    form
      .validateFields()
      .then((values) => {
        axios
          .post("http://127.0.0.1:8000/api/add-nature", values)
          .then((response) => {
            console.log(response.data);
            setIsModalVisible(false);
            fetchNature();
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
    fetchNature();
  }, []);

  const fetchNature = () => {
    axios
      .get("http://127.0.0.1:8000/api/nature-list")
      .then((response) => {
        setNatureRequests(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteNature = (natureId) => {
    axios
      .delete(`http://127.0.0.1:8000/api/delete-nature/${natureId}`)
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        const updatedNatureRequests = natureRequests.filter(
          (nature) => nature.id !== natureId
        );
        setNatureRequests(updatedNatureRequests);
        message.success("Deleted Successfully");
      })
      .catch((error) => {
        console.error("Error deleting nature request:", error);
      });
  };

  const showAddNewModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const [isUpdateNatureModalVisible, setUpdateNatureModalVisible] =
    useState(false);
  const [selectedNatureForUpdate, setSelectedNatureForUpdate] = useState(null);

  const openUpdateNatureModal = (natureOfRequest) => {
    setSelectedNatureForUpdate(natureOfRequest);
    setUpdateNatureModalVisible(true);
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
                Nature of Request
              </th>
              <th className="w-[10%] px-3 py-5 text-base font-semibold tracking-wider whitespace-nowrap text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {natureRequests.map((nature, index) => (
              <tr key={index}>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {index + 1}
                </td>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  {nature.natureRequest}
                </td>
                <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                  <div className="flex items-center justify-center">
                    <button
                      className="text-white text-base font-medium bg-blue-600 py-2 px-4 rounded-lg"
                      onClick={() => openUpdateNatureModal(nature)}
                    >
                      Update
                    </button>
                    <Popconfirm
                      title="Confirmation"
                      description="Confirm deleting?. This action cannot be undone."
                      onConfirm={() => handleDeleteNature(nature.id)}
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
        title="Create New Nature of Request"
      >
        <Form form={form}>
          <Form.Item
            name="natureRequest"
            label={
              <label
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                Nature of Request
              </label>
            }
            labelAlign="top"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please enter the nature of request name",
              },
            ]}
            style={{ height: "8vh" }}
          >
            <Input
              className="h-12 text-base"
              placeholder="Nature of Request Name"
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

      {isUpdateNatureModalVisible && selectedNatureForUpdate && (
        <UpdateNatureModal
          isOpen={isUpdateNatureModalVisible}
          onCancel={() => setUpdateNatureModalVisible(false)}
          onUpdate={() => setUpdateNatureModalVisible(false)}
          natureData={selectedNatureForUpdate}
          refreshData={() => fetchNature()}
        />
      )}
    </div>
  );
};

NatureOfRequest.propTypes = {
  isLargeScreen: PropTypes.bool.isRequired,
};

export default NatureOfRequest;
