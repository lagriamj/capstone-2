import { useState, useEffect } from "react";
import { Button, Table } from "antd";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { Modal } from "antd";
import PrintDelayedReport from "./PrintDelayedReport";

const columns = [
  {
    title: "Request ID",
    dataIndex: "request_code",
    key: "request_code",
  },
  {
    title: "Date Requested",
    dataIndex: "dateRequested",
    key: "dateRequested",
  },
  {
    title: "Nature of Request",
    dataIndex: "natureOfRequest",
    key: "natureOfRequest",
  },
  {
    title: "Serviced By",
    dataIndex: "serviceBy",
    key: "serviceBy",
  },
  {
    title: "ARTA",
    dataIndex: "arta",
    key: "arta",
  },
  {
    title: "Delay Reason",
    dataIndex: "reasonDelay",
    key: "reasonDelay",
  },
];

const DelayedReport = ({ isOpen, onClose, isLargeScreen }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/delay-report`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    setLoading(false);
  }, []);

  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  useEffect(() => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: currentPage,
    }));
  }, [currentPage]);

  const handlePageChange = (newPagination) => {
    setCurrentPage(newPagination.current);
  };

  const [openGenerateReport, setOpenGenerateReport] = useState(false);

  const closeGenerateReport = () => {
    setOpenGenerateReport(false);
  };

  return (
    <Modal
      title="Delayed Report"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={isLargeScreen ? "80%" : "100%"}
    >
      <div className="flex w-full items-center justify-center lg:justify-end gap-4 mr-4 mb-4 lg:mb-2">
        <Button
          onClick={() => {
            setOpenGenerateReport(true);
          }}
        >
          Generate Report
        </Button>
      </div>
      <PrintDelayedReport
        isOpen={openGenerateReport}
        onClose={closeGenerateReport}
        tableColumn={columns}
        techData={data}
        pageSize={pagination.pageSize}
        currentPage={currentPage}
        isLargeScreen={isLargeScreen}
      />
      <Table
        loading={{
          indicator: <LoadingOutlined style={{ fontSize: 50 }} />,
          spinning: loading,
        }}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={pagination}
        onChange={(newPagination) => {
          handlePageChange(newPagination);
        }}
        scroll={isLargeScreen ? "" : { x: 1300 }}
      />
    </Modal>
  );
};

export default DelayedReport;

DelayedReport.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
};
