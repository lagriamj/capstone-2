import React from "react";
import Modal from "antd/es/modal/Modal";
import PropagateLoader from "react-spinners/PropagateLoader";

const UpdateContactNumModal = ({
  onOpen,
  onCancel,
  modalMode,
  handlePasswordCheck,
  userPasswordChecker,
  setUserPasswordChecker,
  userNewContactNumber,
  setUserNewContactNumber,
  handleContactNumberUpdate,
  isSavingChanges,
}) => {
  return (
    <Modal
      title={
        modalMode === "password" ? "Enter Password" : "Update Contact Number"
      }
      open={onOpen}
      onCancel={onCancel}
      footer={null}
    >
      {modalMode === "password" ? (
        // Password input
        <div>
          <label className="font-semibold text-lg" htmlFor="passwordChecker">
            Password:
          </label>
          <input
            type="password"
            name="userCurrentPassword"
            id="passwordChecker"
            value={userPasswordChecker}
            onChange={(e) => setUserPasswordChecker(e.target.value)}
            className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
          />
          <button
            type="button"
            className="bg-main text-white px-4 py-3 rounded-lg w-40 text-lg mt-4"
            onClick={handlePasswordCheck}
          >
            {isSavingChanges ? (
              <PropagateLoader color="#FFFFFF" className="mb-3" />
            ) : (
              "Check Password"
            )}
          </button>
        </div>
      ) : (
        // Contact number input
        <div>
          <label
            className="font-semibold text-lg"
            htmlFor="userContactNumberUpdate"
          >
            Contact Number:
          </label>
          <form action="" onSubmit={handleContactNumberUpdate}>
            <input
              type="text"
              name="userContactNumberUpdate"
              id="userContactNumberUpdate"
              pattern="[0-9]{11}"
              required
              value={userNewContactNumber}
              onChange={(e) => setUserNewContactNumber(e.target.value)}
              className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
              onInvalid={(e) => {
                if (e.target.validity.valueMissing) {
                  e.target.setCustomValidity("Contact Number is required.");
                } else if (e.target.validity.patternMismatch) {
                  e.target.setCustomValidity(
                    `Contact Number must be a 11-digit mobile number.`
                  );
                }
              }}
              onInput={(e) => {
                e.target.setCustomValidity("");
              }}
            />
            <button
              type="submit"
              className="bg-main text-white px-4 py-3 rounded-lg text-lg mt-4 w-60"
            >
              {isSavingChanges ? (
                <PropagateLoader color="#FFFFFF" className="mb-3" />
              ) : (
                "Update Contact Number"
              )}
            </button>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default UpdateContactNumModal;
