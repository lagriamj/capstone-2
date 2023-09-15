import { useState } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import axios from "axios";

export default function ReasonModal({
  display,
  itemData,
  onClose,
  isLargeScreen,
  onSubmit,
}) {
  const [reason, setReason] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmationVisible(true);
  };

  const handleConfirm = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/cancel-reason/${itemData.id}`,
        {
          reason: reason,
        }
      );

      setConfirmationVisible(false);
      onSubmit();
      onClose();
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  const handleCancel = () => {
    setConfirmationVisible(false);
  };

  const footerContent = (
    <div className="flex gap-3">
      <button
        className="bg-red-800 text-white w-24 font-sans ml-auto tracking-widest text-base font-bold py-3 flex items-center justify-center  rounded-lg "
        onClick={onClose}
      >
        Exit
      </button>
    </div>
  );

  const CustomCancelButton = () => (
    <button
      onClick={() => handleCancel()}
      className="bg-red-700 text-white px-4 ml-auto py-3 rounded-lg hover:bg-opacity-80"
    >
      Cancel
    </button>
  );

  const CustomOkButton = () => (
    <button
      onClick={() => handleConfirm()}
      className="bg-main text-white px-4 py-3 rounded-lg hover:bg-opacity-80"
    >
      Confirm
    </button>
  );

  return (
    <>
      <Modal
        open={display}
        onCancel={onClose}
        centered
        title={
          <div className="flex flex-col lg:flex-row font-sans text-xl py-6 px-10">
            <label>{`Request ID: ${itemData.id}`}</label>
            <label className="ml-auto ">{`Date Requested: ${
              itemData.dateRequested.split(" ")[0]
            }`}</label>
          </div>
        }
        width={isLargeScreen ? "60%" : "80%"}
        footer={footerContent}
      >
        <form onSubmit={handleSubmit}>
          <div className="px-10 flex-auto border-b-2 border-gray-400 text-base pb-2 place-content-center flex flex-col  gap-y-2">
            <div className="w-full">
              <label htmlFor="dateRequested" className="font-semibold text-lg">
                Reason to Cancel:
              </label>
              <textarea
                required
                rows={"6"}
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <button
                type="submit"
                className="text-white items-center justify-center w-28 tracking-wider bg-main rounded-lg hover:bg-opacity-95 font-bold font-sans text-base px-3 flex ml-auto py-4   outline-none focus:outline-none ease-linear transition-all duration-150"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={confirmationVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        title="Confirm Cancelation"
        okText="Confirm"
        cancelText="Cancel"
        footer={
          <div className="flex gap-2 ml-auto">
            <CustomCancelButton /> <CustomOkButton />
          </div>
        }
      >
        Are you sure you want to cancel this request?
      </Modal>
    </>
  );
}

ReasonModal.propTypes = {
  display: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemData: PropTypes.object.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
