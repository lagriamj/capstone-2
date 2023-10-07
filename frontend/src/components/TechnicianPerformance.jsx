import { Modal, Table, Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import PrintTechPerformance from "./PrintTechPerformance";

const TechnicianPerformance = ({ isOpen, onClose, isLargeScreen }) => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    fetchTechnicianData();
  }, [fromDate, toDate]);

  const fetchTechnicianData = () => {
    const params = {};

    if (fromDate) {
      params.fromDate = fromDate;
    }

    if (toDate) {
      params.toDate = toDate;
    }

    axios
      .get("http://127.0.0.1:8000/api/tech-performance", { params })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  const techPerformanceColumn = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Technician",
      dataIndex: "technician",
      key: "technician",
    },
    {
      title: "Total Assigned Requests",
      dataIndex: "all_req",
      key: "all_req",
    },
    {
      title: "Closed Requests",
      dataIndex: "closed_req",
      key: "closed_req",
    },
    {
      title: "Unclosed Requests",
      dataIndex: "unclosed_req",
      key: "unclosed_req",
    },
    {
      title: "Performance by Percentage",
      dataIndex: "performance",
      key: "performance",
    },
    {
      title: "Ratings",
      dataIndex: "rating",
      key: "rating",
    },
  ];

  const [openGenerateReport, setOpenGenerateReport] = useState(false);

  const closeGenerateReport = () => {
    setOpenGenerateReport(false);
  };

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
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
            <span className="font-semibold">To:</span>
            <input
              type="date"
              className="p-2 w-36 outline-none border-none bg-transparent"
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setOpenGenerateReport(true);
          }}
        >
          Generate Report
        </Button>
      </div>
      <PrintTechPerformance
        isOpen={openGenerateReport}
        onClose={closeGenerateReport}
        tableColumn={techPerformanceColumn}
        techData={data}
      />
      <Table
        columns={techPerformanceColumn}
        dataSource={data.map((item, index) => ({ ...item, key: index }))}
        pagination={pagination}
        className="gotoLarge:w-full overflow-auto print"
        onChange={(newPagination) => setPagination(newPagination)}
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
