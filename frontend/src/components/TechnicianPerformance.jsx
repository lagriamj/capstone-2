import { Modal, Table, Button, message } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";
import PrintTechPerformance from "./PrintTechPerformance";
import TechnicianRemarks from "./TechnicianRemarks";

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
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/tech-performance`, {
        params,
      })
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const [selectedRemarksData, setSelectedRemarksData] = useState(null);
  const [openModalRemarks, setOpenModalRemarks] = useState(false);

  const openRemarksModal = async (data) => {
    if (openModalRemarks) {
      return;
    }

    setOpenModalRemarks(true);
    await axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/view-remarks`, {
        params: {
          technician: data.technician,
          fromDate: startDate,
          toDate: endDate,
        },
      })
      .then((response) => {
        const responseData = response.data;
        console.log(response);
        if (
          responseData &&
          responseData.data &&
          Array.isArray(responseData.data)
        ) {
          const dataArray = responseData.data; // Access the array of data
          setSelectedRemarksData(dataArray);
        } else {
          // Handle the case where the data is not as expected
          message.error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closeRemarksModal = () => {
    setOpenModalRemarks(false);
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
    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (record) => (
        <button
          className="bg-blue-500 py-[0.30rem] px-4 text-white rounded-md hover:opacity-90"
          onClick={() => openRemarksModal(record)}
        >
          View
        </button>
      ),
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
        techData={data}
        pageSize={pagination.pageSize}
        currentPage={currentPage}
        isLargeScreen={isLargeScreen}
        fromDate={fromDate}
        toDate={toDate}
      />
      <TechnicianRemarks
        visible={openModalRemarks}
        onCancel={closeRemarksModal}
        data={selectedRemarksData}
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
