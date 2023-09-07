import { Modal, Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import AdminPassConfirmationModal from "./AdminPassConfirmationModal";

const UpdateUserModal = ({ visible, onCancel, onOk, userData, }) => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const { userRole } = useAuth();
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const handleCancel = () => {
    setIsVerifyModalOpen(false);
  };

  const handleUpdate = async () => {
    try {
      const newFormData = await form.validateFields();
      const response = await axios.put(
        "http://127.0.0.1:8000/api/admin/updateUser",
        newFormData
      );

      if (response.status === 201) {
        onOk(); // Close the modal or take any other desired action upon successful submission.
        message.success("User Updated successfully");
        window.location.href = "/users-list";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      title="Create New User Account"
      centered
      footer={null}
    >
      <Form
        form={form}
        name="addUserForm"
        labelCol={{ span: 24 }} // Set the label width to take the full width
        wrapperCol={{ span: 24 }} // Set the input field width to take the full width
        layout="vertical"
        initialValues={userData}
      >
        <Form.Item
          name="userFirstName"
          label="First Name"
          rules={[{ required: true, message: "Please enter the first name" }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="userLastName"
          label="Last Name"
          rules={[{ required: true, message: "Please enter the last name" }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="userGovernmentID"
          label="Government ID"
          rules={[
            { required: true, message: "Please enter the government ID" },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="userEmail"
          label="Email"
          type="email"
          rules={[{ required: true, message: "Please enter the email" }]}
        >
          <Input size="large" />
        </Form.Item>
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
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select the role" }]}
        >
          <Select size="large">
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="userPassword"
          label="New Password"
          rules={[
            { min: 6, message: "Password must be at least 6 characters long" }, // Add this rule
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item name="adminUserRole" hidden initialValue={userRole}>
          <Input size="large" />
        </Form.Item>
        <Form.Item name="userID" hidden>
          <Input size="large" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-main pt-5  pb-6 px-8 text-lg font-semibol flex items-center justify-center"
            onClick={() => setIsVerifyModalOpen(true)}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
      <AdminPassConfirmationModal
        visible={isVerifyModalOpen}
        onCancel={handleCancel}
        handleUpdate={handleUpdate}
      />
    </Modal>
  );
};

UpdateUserModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  userData: PropTypes.object,
};

export default UpdateUserModal;