import { Modal, Table } from "antd";
import PropTypes from "prop-types";

const TechnicianPerformance = ({ isOpen, onClose, isLargeScreen }) => {
  const techPerformanceColumn = [
    {
      title: "Technician",
      dataIndex: "servicedBy",
      key: "servicedBy",
    },
    {
      title: "Assigned Requests",
      dataIndex: "jsonName",
      key: "jsonName",
    },
    {
      title: "Closed Requests",
      dataIndex: "servicedBy",
      key: "servicedBy",
    },
    {
      title: "Unclosed Requests",
      dataIndex: "servicedBy",
      key: "servicedBy",
    },
    {
      title: "Performance by Percentage",
      dataIndex: "servicedBy",
      key: "servicedBy",
    },
    {
      title: "Ratings",
      dataIndex: "servicedBy",
      key: "servicedBy",
    },
  ];

  return (
    <Modal
      title={"Technician Performance"}
      width={isLargeScreen ? "100%" : "70%"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div className="flex w-full items-center justify-center lg:justify-end gap-4 mr-4 mb-4 lg:mb-2">
        <div className="flex lg:flex-row flex-col items-center text-black gap-2">
          <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
            <span className="font-semibold">From:</span>
            <input
              type="date"
              className="p-2 w-36 outline-none border-none bg-transparent"
            />
          </div>
          <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
            <span className="font-semibold">To:</span>
            <input
              type="date"
              className="p-2 w-36 outline-none border-none bg-transparent"
            />
          </div>
        </div>
      </div>
      <Table
        columns={techPerformanceColumn}
        pagination={true}
        className="gotoLarge:w-full overflow-auto"
      />
    </Modal>
  );
};

TechnicianPerformance.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
};

export default TechnicianPerformance;
