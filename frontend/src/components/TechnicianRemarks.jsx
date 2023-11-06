import { Table, Modal } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const TechnicianRemarks = ({ visible, onCancel, data }) => {
  const columns = [
    {
      title: "Request Code",
      dataIndex: "request_code",
      key: "request_code",
    },
    {
      title: "Commendation",
      dataIndex: "commendation",
      key: "commendation",
    },
    {
      title: "Suggestion",
      dataIndex: "suggestion",
      key: "suggestion",
    },
    {
      title: "Request",
      dataIndex: "request",
      key: "request",
    },
    {
      title: "Complaint",
      dataIndex: "complaint",
      key: "complaint",
    },
  ];

  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });
  return (
    <Modal
      title="Techncian Feedbacks"
      open={visible}
      onCancel={onCancel}
      width={"75%"}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={(newPagination) => setPagination(newPagination)}
      />
    </Modal>
  );
};

TechnicianRemarks.propTypes = {
  visible: PropTypes.any,
  onCancel: PropTypes.any,
  data: PropTypes.any,
};

export default TechnicianRemarks;
