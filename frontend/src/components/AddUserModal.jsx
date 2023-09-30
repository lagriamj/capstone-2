import { Modal, Button, Form, Input, Select, message, Row, Col } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

const AddUserModal = ({
  visible,
  onCancel,
  onOk,
  refreshData,
  isLargeScreen,
}) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const { userRole } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      const formData = await form.validateFields();
      const response = await axios.post(
        "http://127.0.0.1:8000/api/admin/register",
        formData
      );

      if (response.status === 201) {
        onOk(); // Close the modal or take any other desired action upon successful submission.
        refreshData();
        setIsCreating(false);
        message.success("User created successfully");
        form.resetFields();
      }
    } catch (error) {
      setIsCreating(false);
      const errorMessage = error.response.data.message;
      message.error(errorMessage);
      console.log(error);
    }
  };

  const [officeOptions, setOfficeOptions] = useState([]);

  useEffect(() => {
    fetchOfficeList();
  }, []);

  const fetchOfficeList = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/api/office-list");
      console.log(result.data.results);
      setOfficeOptions(result.data.results);
      console.log(officeOptions);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  const customFilterOption = (inputValue, option) =>
    option.value?.toLowerCase().includes(inputValue.toLowerCase());

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      title="Create New User Account"
      width={`${isLargeScreen ? "50%" : "90%"}`}
      footer={null}
    >
      <Form form={form} name="addUserForm" layout="vertical">
        <Row gutter={16}>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="userFirstName"
              label="First Name"
              rules={[
                { required: true, message: "Please enter the first name" },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="userLastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter the last name" },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="userGovernmentID"
              label="Government ID"
              rules={[
                { required: true, message: "Please enter the government ID" },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="userEmail"
              label="Email"
              type="email"
              rules={[{ required: true, message: "Please enter the email" }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="userContactNumber"
              label="Contact Number"
              rules={[
                {
                  required: true,
                  message: "Please enter the contact number",
                },
                {
                  pattern: /^\d{11}$/, // Regular expression to match exactly 11 digits
                  message:
                    "Contact number must have exactly 11 digits and contain only numbers",
                },
              ]}
            >
              <Input
                size="large"
                maxLength={11} // Optional: Set the maximum length to 11 characters
                onInput={(e) => {
                  // Remove non-numeric characters
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
              />
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="userStatus"
              label="Status"
              rules={[{ required: true, message: "Please select the status" }]}
            >
              <Select size="large">
                <Option value="unverified">Unverified</Option>
                <Option value="verified">Verified</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="office"
              label="Office"
              rules={[{ required: true, message: "Please select the office" }]}
            >
              <Select size="large" showSearch filterOption={customFilterOption}>
                {officeOptions.map((option) => (
                  <Option key={option.id} value={option.office}>
                    {option.office}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="division"
              label="Division"
              rules={[{ required: true, message: "Please enter the division" }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select the role" }]}
            >
              <Select size="large">
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
                <Option value="head">Head</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item
              name="userPassword"
              label="Password"
              rules={[
                { required: true, message: "Please enter the password" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long",
                }, // Add this rule
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item name="adminUserRole" hidden initialValue={userRole}>
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={`${isLargeScreen ? 12 : 24}`}>
            <Form.Item>
              <Button
                loading={isCreating}
                type="primary"
                htmlType="submit"
                className="bg-main pt-5 w-32  pb-6 px-8 text-lg font-semibol flex items-center justify-center"
                onClick={handleSubmit}
              >
                {isCreating ? "Creating" : "Create"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

AddUserModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
};

export default AddUserModal;
