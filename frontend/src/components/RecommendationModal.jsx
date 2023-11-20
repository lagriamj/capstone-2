import { Table, Modal } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const columns = [
  {
    title: "Request Code",
    dataIndex: "request_code",
    key: "request_code",
  },
  {
    title: "Date Requested",
    dataIndex: "dateRequested",
    key: "dateRequested",
  },
  {
    title: "Assigned To",
    dataIndex: "assignedTo",
    key: "assignedTo",
  },
];

const RecommendationModal = ({ visible, handleCancel, data }) => {
  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });
  return (
    <Modal
      title="Recommendation Log"
      open={visible}
      onCancel={handleCancel}
      width={"75%"}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        onChange={(newPagination) => setPagination(newPagination)}
      />
    </Modal>
  );
};

RecommendationModal.propTypes = {
  visible: PropTypes.any,
  handleCancel: PropTypes.any,
  data: PropTypes.any,
};

export default RecommendationModal;
