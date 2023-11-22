import { Modal, Table, Button } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import PrintPieChartData from "./PrintPieChartData";
import { LoadingOutlined } from "@ant-design/icons";

const PieChartModal = ({
  modalVisible,
  closePieModal,
  clickedPortion,
  modalTitle,
  modalData,
  tableColumns,
  isLargeScreen,
  fromDate,
  toDate,
  pieLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: modalData.requests ? modalData.requests.length : 10,
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

  const totalItems = modalData.requests?.length;
  const lastPage = Math.ceil(totalItems / pagination.pageSize);
  const isLastPage = currentPage === lastPage;

  // Define a new column for the index
  const indexColumn = {
    title: "#",
    dataIndex: "rowIndex",
    key: "rowIndex",
    align: "center",
    render: (text, record, index) =>
      (currentPage - 1) * pagination.pageSize + index + 1,
  };

  // Add the index column to the table columns
  const columnsWithIndex = [indexColumn, ...tableColumns];

  return (
    <Modal
      title={
        <div className="flex text-lg gap-4 px-6 py-4 font-sans">
          <span>{clickedPortion} Requests</span>
          <span className="font-bold text-red-700">{modalTitle}%</span>
        </div>
      }
      open={modalVisible}
      onCancel={closePieModal}
      footer={null}
      width={isLargeScreen ? "100%" : "85%"}
    >
      <div className="flex flex-col w-full items-center justify-center lg:justify-end gap-4 mr-4 mb-4 lg:mb-2">
        <Button
          className="ml-auto"
          onClick={() => {
            setOpenGenerateReport(true);
          }}
        >
          Generate Report
        </Button>
        <PrintPieChartData
          isOpen={openGenerateReport}
          onClose={closeGenerateReport}
          techData={modalData}
          tableColumn={tableColumns}
          isLastPage={isLastPage}
          pageSize={modalData.requests ? modalData.requests.length : 10}
          currentPage={currentPage}
          isLargeScreen={isLargeScreen}
          fromDate={fromDate}
          toDate={toDate}
        />
        <Table
          loading={{
            indicator: <LoadingOutlined style={{ fontSize: 50 }} />,
            spinning: pieLoading,
          }}
          dataSource={modalData}
          columns={columnsWithIndex} // Use the columns with the added index
          pagination={pagination}
          onChange={(newPagination) => {
            handlePageChange(newPagination);
          }}
          scroll={isLargeScreen ? "" : { x: 1300 }}
          className="gotoLarge:w-full overflow-auto print"
        />
      </div>
    </Modal>
  );
};

PieChartModal.propTypes = {
  modalVisible: PropTypes.any,
  closePieModal: PropTypes.any,
  clickedPortion: PropTypes.any,
  modalTitle: PropTypes.any,
  modalData: PropTypes.any,
  tableColumns: PropTypes.any,
  isLargeScreen: PropTypes.bool,
  fromDate: PropTypes.any,
  toDate: PropTypes.any,
  pieLoading: PropTypes.bool,
};

export default PieChartModal;
