import { Modal, Table, Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import PrintTechPerformance from "./PrintTechPerformance";

const TechnicianPerformance = ({
  isOpen,
  onClose,
  isLargeScreen,
  startDate,
  endDate,
}) => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(startDate);
  const [toDate, setToDate] = useState(endDate);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setFromDate(startDate);
    setToDate(endDate);
  }, [startDate, endDate]);

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
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
            <span className="font-semibold">To:</span>
            <input
              type="date"
              value={toDate}
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
        pageSize={pagination.pageSize}
        currentPage={currentPage}
        isLargeScreen={isLargeScreen}
        fromDate={fromDate}
        toDate={toDate}
      />
      <Table
        columns={techPerformanceColumn}
        dataSource={data.map((item, index) => ({ ...item, key: index }))}
        pagination={pagination}
        onChange={(newPagination) => {
          handlePageChange(newPagination);
        }}
        scroll={isLargeScreen ? "" : { x: 1300 }}
        className="gotoLarge:w-full overflow-auto print"
      />
    </Modal>
  );
};

TechnicianPerformance.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
};

export default TechnicianPerformance;
