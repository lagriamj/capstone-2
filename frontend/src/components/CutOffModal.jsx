import PropTypes from "prop-types";
import { Modal, message } from "antd";
import axios from "axios";
import { useState } from "react";

const CutOffModal = ({ isOpen, onClose }) => {
  const [cutOff, setCutOff] = useState("");
  const handleSetCutOff = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/cut-off`, {
        cutOff,
      });
      message.success("Cut-off time set successfully!");
      onClose();
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.status);
        console.error("Server Response Data:", error.response.data);
      } else if (error.request) {
        console.error("No Response from Server:", error.request);
      } else {
        console.error("Axios Error:", error.message);
      }
    }
  };

  return (
    <Modal
      title="Set Cut-Off Time"
      open={isOpen}
      onClose={onClose}
      footer={null}
    >
      <div className="flex flex-col gap-2">
        <input
          type="datetime-local"
          id="cutOff"
          name="cutOff"
          className="p-2 rounded-md border-2  border-gray-400  outline-none  text-black bg-transparent"
          value={cutOff}
          onChange={(e) => setCutOff(e.target.value)}
        />

        <div className="flex ml-auto gap-1">
          <button
            className="text-white bg-main font-medium px-3 w-16 py-2 rounded-lg"
            onClick={handleSetCutOff} // Call this function to send the cut-off value
          >
            Set
          </button>
          <button
            className="text-white bg-red-700 font-medium w-16 py-2 rounded-lg"
            onClick={onClose} // Call this function to send the cut-off value
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

CutOffModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CutOffModal;
