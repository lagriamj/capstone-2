import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Button, Form, Input, Modal } from "antd";

const NatureOfRequest = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showAddNewModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
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
            <tr className="bg-main h-[8vh] text-white">
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
            <tr>
              <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                1
              </td>
              <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                hakdog
              </td>
              <td className="p-3 text-lg text-gray-700 whitespace-nowrap text-center font-medium">
                <div className="flex items-center justify-center">
                  <button
                    className="text-white text-base font-medium bg-blue-600 py-2 px-4 rounded-lg"
                    //onClick={() => openUpdateDepartmentModal(department)}
                  >
                    Update
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
        //onOk={handleOk}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        footer={null}
        title="Create New Nature of Request"
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
              //onClick={handleOk}
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

export default NatureOfRequest;
