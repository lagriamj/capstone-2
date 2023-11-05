import { useState } from "react";
import { Button, Modal, message } from "antd";
import axios from "axios";
import { useAuth } from "../AuthContext";
import PropTypes from "prop-types";

const AdminPassConfirmationModal = ({ visible, onCancel, handleUpdate }) => {
  const [adminPasswordChecker, setAdminPasswordChecker] = useState("");
  const { userID } = useAuth();
  const [isSavingChange, setIsSavingChange] = useState(false);

  const handleVerifyPhone = async (e) => {
    e.preventDefault();

    setIsSavingChange(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/check-password`,
        {
          password: adminPasswordChecker,
          userID: userID,
        }
      );

      if (response.status === 200) {
        handleUpdate();
        setIsSavingChange(false);
      } else {
        setIsSavingChange(false);
        message.error("Incorrect Password");
      }
    } catch (error) {
      setIsSavingChange(false);
      message.error("Incorrect Password");
      console.log(error);
    }
  };

  return (
    <Modal
      open={visible}
      title="Enter Admin Password"
      onCancel={onCancel}
      footer={null}
    >
      <div className="font-sans">
        <label className="font-semibold text-lg" htmlFor="userPasswordChecker">
          Password:
        </label>
        <input
          type="password"
          name="userPasswordChecker"
          id="userPasswordChecker"
          value={adminPasswordChecker}
          onChange={(e) => setAdminPasswordChecker(e.target.value)}
          className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
        />
        <Button
          loading={isSavingChange}
          type="primary"
          htmlType="submit"
          className="bg-main pt-5 w-32  pb-6 px-8 text-lg font-semibold mt-4 flex items-center justify-center"
          onClick={handleVerifyPhone}
        >
          {isSavingChange ? "Updating" : "Update"}
        </Button>
      </div>
    </Modal>
  );
};

AdminPassConfirmationModal.propTypes = {
  visible: PropTypes.bool.isRequired, // visible should be a boolean and is required
  onCancel: PropTypes.func.isRequired, // onCancel should be a function and is required
  handleUpdate: PropTypes.func.isRequired, // handleUpdate should be a function and is required
};

export default AdminPassConfirmationModal;
