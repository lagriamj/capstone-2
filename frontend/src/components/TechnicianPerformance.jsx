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
