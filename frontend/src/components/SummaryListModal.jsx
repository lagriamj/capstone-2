import { Modal, Table, Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import PrintSummaryList from "./PrintSummaryList";

const SummaryListModal = ({ isOpen, onClose, isLargeScreen }) => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const queryParams = {};
    if (fromDate) {
      queryParams.fromDate = fromDate;
    }
    if (toDate) {
      queryParams.toDate = toDate;
    }

    const apiUrl = "http://127.0.0.1:8000/api/summary-list";

    axios
      .get(apiUrl, { params: queryParams })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [fromDate, toDate]);

  const summaryListColumn = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      align: "center",
    },
    {
      title: "SR No.",
      dataIndex: "request_code",
      key: "request_code",
      align: "center",
    },
    {
      title: "Date Received",
      dataIndex: "dateReceived",
      key: "dateReceived",
      align: "center",
    },
    {
      title: "Office",
      dataIndex: "reqOffice",
      key: "reqOffice",
      align: "center",
    },
    {
      title: "Item",
      dataIndex: "unit",
      key: "unit",
      align: "center",
    },
    {
      title: "Type of Request",
      dataIndex: "natureOfRequest",
      key: "natureOfRequest",
      align: "center",
    },
    {
      title: "Date Accomplished",
      dataIndex: "updated_at",
      key: "updated_at",
      align: "center",
    },
    {
      title: "Action Taken",
      dataIndex: "remarks",
      key: "remarks",
      align: "center",
    },
    {
      title: "Date Released",
      dataIndex: "dateReleased",
      key: "dateReleased",
      align: "center",
    },
    {
      title: "Processing Time No. of Hours",
      dataIndex: "processing_hours",
      key: "processing_hours",
      width: "10%",
      align: "center",
    },
    {
      title: "Remarks",
      dataIndex: "toRecommend",
      key: "toRecommend",
      align: "center",
    },
  ];

  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  const [openGenerateReport, setOpenGenerateReport] = useState(false);

  const closeGenerateReport = () => {
    setOpenGenerateReport(false);
  };

  return (
    <Modal
      title={"Summary List"}
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
              className="p-2 w-36 outline-none border-none bg-transparent"
              value={toDate}
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
      <PrintSummaryList
        isOpen={openGenerateReport}
        onClose={closeGenerateReport}
        tableColumn={summaryListColumn}
        techData={data}
        pageSize={pagination.pageSize}
      />
      <Table
        columns={summaryListColumn}
        dataSource={data.map((item, index) => ({
          ...item,
          key: index,
        }))}
        pagination={true}
        onChange={(newPagination) => setPagination(newPagination)}
        className="gotoLarge:w-full overflow-auto print"
      />
    </Modal>
  );
};

SummaryListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
};

export default SummaryListModal;
