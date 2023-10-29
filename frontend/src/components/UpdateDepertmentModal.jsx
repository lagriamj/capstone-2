import { Button, Form, Input, Modal, message, Select } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";

const UpdateDepertmentModal = ({
  isOpen,
  onCancel,
  onUpdate,
  departmentData,
  refreshData,
  isScreenWidth1366,
  headList,
}) => {
  const [form] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);
  const { Option } = Select;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const newFormData = await form.validateFields();
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/update-office`,
        newFormData
      );

      if (response.status === 201) {
        onUpdate();
        refreshData();
        setIsUpdating(false);
        message.success("Department Updated successfully");
      }
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  const customFilterOption = (inputValue, option) =>
    option.value?.toLowerCase().includes(inputValue.toLowerCase());

  return (
    <Modal
      title="Update Office/Department"
      open={isOpen}
      onCancel={onCancel}
      onOk={onUpdate}
      footer={null}
    >
      <Form
        form={form}
        initialValues={departmentData}
        className={`${isScreenWidth1366 ? "flex flex-col gap-6" : ""} `}
      >
        <Form.Item
          labelAlign="top"
          labelCol={{ span: 24 }}
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
          rules={[
            {
              required: true,
              message: "Please enter the office/department name",
            },
          ]}
          style={{ height: "8vh" }}
        >
          <Input
            placeholder="Office/Department Name"
            className="h-12 text-base"
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
          <Select size="large" showSearch filterOption={customFilterOption}>
            {headList.map((option) => (
              <Option
                key={option.userID}
                value={`${option.userFirstName} ${option.userLastName}`}
              >
                {`${option.userFirstName} ${option.userLastName}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="id" hidden>
          <Input size="large" />
        </Form.Item>
        <div className="flex justify-end">
          <Button
            onClick={onCancel}
            variant="outlined"
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
            color="primary"
            style={{ width: "5rem", height: "2.5rem" }}
            loading={isUpdating}
            htmlType="submit"
            onClick={handleUpdate}
          >
            {isUpdating ? "..." : "Update"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

UpdateDepertmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  departmentData: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
  isScreenWidth1366: PropTypes.bool.isRequired,
  headList: PropTypes.any,
};

export default UpdateDepertmentModal;
