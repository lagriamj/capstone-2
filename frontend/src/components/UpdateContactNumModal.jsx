import Modal from "antd/es/modal/Modal";
import PropTypes from "prop-types";
import { Button } from "antd";

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
        <div className="font-sans">
          <label
            className="font-semibold text-lg"
            htmlFor="userPasswordChecker"
          >
            Password:
          </label>
          <input
            type="password"
            name="userPasswordChecker"
            id="userPasswordChecker"
            value={userPasswordChecker}
            onChange={(e) => setUserPasswordChecker(e.target.value)}
            className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
          />
          <Button
            loading={isSavingChanges}
            type="primary"
            htmlType="submit"
            className="bg-main pt-5 w-32  pb-6 px-8 text-lg font-semibold mt-4 flex items-center justify-center"
            onClick={handlePasswordCheck}
          >
            {isSavingChanges ? "Checking" : "Check"}
          </Button>
        </div>
      ) : (
        // Contact number input
        <div className="font-sans">
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
            <Button
              loading={isSavingChanges}
              type="primary"
              htmlType="submit"
              className="bg-main pt-5 w-32  pb-6 px-8 text-lg font-semibold mt-4 flex items-center justify-center"
            >
              {isSavingChanges ? "Updating" : "Update"}
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
};

UpdateContactNumModal.propTypes = {
  onOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  modalMode: PropTypes.string.isRequired,
  handlePasswordCheck: PropTypes.func.isRequired,
  userPasswordChecker: PropTypes.string.isRequired,
  setUserPasswordChecker: PropTypes.func.isRequired,
  userNewContactNumber: PropTypes.string.isRequired,
  setUserNewContactNumber: PropTypes.func.isRequired,
  handleContactNumberUpdate: PropTypes.func.isRequired,
  isSavingChanges: PropTypes.bool.isRequired,
};

export default UpdateContactNumModal;
