import { Table, Modal } from "antd";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";

const DelayedReasons = ({ visible, onCancel, data }) => {
  const columns = [
    {
      title: "#",
      dataIndex: "rowNumber",
      key: "rowNumber",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Reason Delay",
      dataIndex: "reasonDelay",
      key: "reasonDelay",
    },
  ];

  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/view-reasons`, {
          params: { request_id: data },
        })
        .then((response) => {
          const delayReasons = response.data.results.map((reason, index) => ({
            rowNumber: index + 1,
            ...reason,
          }));

          setTableData(delayReasons);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [data]);

  return (
    <Modal
      title="Delay Request Reasons"
      open={visible}
      onCancel={onCancel}
      width={"75%"}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        onChange={(newPagination) => setPagination(newPagination)}
      />
    </Modal>
  );
};

DelayedReasons.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  data: PropTypes.number,
};

export default DelayedReasons;
