import { Modal } from "antd";
import PropagateLoader from "react-spinners/PropagateLoader";
import PropTypes from "prop-types";

const UtilityModal = ({
  isOpen,
  onClose,
  onUpdate,
  updatedCategory,
  onChange,
  onSavingUpdate,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="Update Category"
      okText={
        onSavingUpdate ? (
          <PropagateLoader color="#FFFFFF" size={7} className="mb-2" />
        ) : (
          "Update"
        )
      }
      okButtonProps={{
        color: "black",
        className: "text-black border-1 border-gray-300 w-20",
        size: "large",
      }}
      cancelButtonProps={{
        size: "large",
      }}
      onOk={onUpdate}
    >
      {/* Content */}
      <div className="relative flex flex-col w-full bg-white border-0 rounded-lg outline-none focus:outline-none">
        <div className="relative  flex-auto">
          <input
            type="text"
            value={updatedCategory}
            onChange={onChange}
            placeholder="Enter Updated Category"
            className="w-full h-12 border-2 rounded-lg pl-4 pr-4 text-lg border-slate-400 outline-none"
          />
        </div>
      </div>
    </Modal>
  );
};

UtilityModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  updatedCategory: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSavingUpdate: PropTypes.bool.isRequired,
};

export default UtilityModal;
