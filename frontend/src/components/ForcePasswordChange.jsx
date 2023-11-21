import { Modal, Form, Input, Button, message } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";

const ForcePasswordChange = ({ modalVisible, onClose, isLargeScreen }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUserPassword, setNewUserPassword] = useState("");
  const { userID, passwordChange } = useAuth();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/force-change-password`,
        {
          userID: userID,
          newPassword: newUserPassword,
        }
      );
      localStorage.setItem("password_change_required", !passwordChange);
      onClose();
      message.success("Welcome");
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
      setIsSubmitting(false);
    }
  };
  return (
    <Modal
      title="Change Password"
      open={modalVisible}
      onCancel={onClose}
      closable={false}
      footer={null}
      width={isLargeScreen ? "30%" : "90%"}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label={
            <label className="block text-sm font-bold mb-2">New Password</label>
          }
          rules={[
            {
              min: 5,
              message: "Password must be at least 5 characters",
            },
          ]}
          name="newPassword"
        >
          <Input.Password
            className="h-[40px]"
            onChange={(e) => {
              setNewUserPassword(e.target.value);
            }}
            value={newUserPassword}
          />
        </Form.Item>
        <div className="flex gap-3 justify-end">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-red-800  h-12  font-semibold flex items-center justify-center text-white text-base font-sans w-28 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out "
          >
            Not Now
          </Button>
          <Button
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
            className="bg-gray-800  h-12  font-semibold flex items-center justify-center text-white text-base font-sans w-28 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out "
          >
            {isSubmitting ? "Saving" : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

ForcePasswordChange.propTypes = {
  modalVisible: PropTypes.bool,
  onClose: PropTypes.any,
  isLargeScreen: PropTypes.bool,
};

export default ForcePasswordChange;
