import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { Button, Input, Modal, Form } from "antd";
import axios from "axios";

const OfficeDepartment = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Send a POST request to your Laravel API
        axios
          .post("/api/your-endpoint", values)
          .then((response) => {
            // Handle the response (e.g., show a success message)
            console.log(response.data);
            setIsModalVisible(false);
          })
          .catch((error) => {
            // Handle errors (e.g., show an error message)
            console.error(error);
          });
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields(); // Reset the form fields when closing the modal
    setIsModalVisible(false);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full">
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
            onClick={showModal}
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
            <tr className="border-b-2 border-gray-200 h-auto overflow-auto">
              <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                1
              </td>
              <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                CITC
              </td>
              <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                Charo Santos
              </td>
              <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                <div className="flex items-center justify-center">
                  <button className="text-white text-base font-medium bg-blue-600 py-2 px-4 rounded-lg">
                    View
                  </button>
                  <button className="ml-1 text-white bg-red-700 rounded-lg px-3 py-2 text-lg font-medium">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
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
            >
              Add
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficeDepartment;
