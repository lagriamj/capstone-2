import { Modal, Table, Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import PrintSummaryList from "./PrintSummaryList";

const SummaryListModal = ({
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
      params.startDate = fromDate;
    }

    if (toDate) {
      params.endDate = toDate;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/summary-list`, {
        params,
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const summaryListColumn = [
    {
      title: "#",
      dataIndex: "rowIndex",
      key: "rowIndex",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Property No.",
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
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "center",
      render: (text) => {
        return text || 1;
      },
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
    pageSize: data.requests ? data.requests.length : 10,
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

  const totalItems = data.requests?.length;
  const lastPage = Math.ceil(totalItems / pagination.pageSize);
  const isLastPage = currentPage === lastPage;

  return (
    <Modal
      title={"Summary List"}
      width={isLargeScreen ? "100%" : "85%"}
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
              defaultValue={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
            <span className="font-semibold">To:</span>
            <input
              type="date"
              className="p-2 w-36 outline-none border-none bg-transparent"
              defaultValue={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setOpenGenerateReport(true);
            }}
          >
            Generate Reports
          </Button>
        </div>
      </div>

      <>
        <PrintSummaryList
          isOpen={openGenerateReport}
          onClose={closeGenerateReport}
          tableColumn={summaryListColumn}
          techData={data.requests}
          pageSize={data.requests ? data.requests.length : 10}
          currentPage={currentPage}
          isLargeScreen={isLargeScreen}
          fromDate={fromDate}
          toDate={toDate}
          isLastPage={isLastPage}
          totalReleased={data.totalReleased}
          totalUnclaimed={data.totalUnclaimed}
          totalDefect={data.totalDefect}
        />

        <Table
          columns={summaryListColumn}
          dataSource={data.requests?.map((item, index) => ({
            ...item,
            key: index,
          }))}
          pagination={pagination}
          onChange={(newPagination) => {
            handlePageChange(newPagination);
          }}
          scroll={isLargeScreen ? "" : { x: 1300 }}
          className="gotoLarge:w-full overflow-auto print"
        />
      </>
    </Modal>
  );
};

SummaryListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
};

export default SummaryListModal;
