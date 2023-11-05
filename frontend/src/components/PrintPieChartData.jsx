import { Table, Modal } from "antd";
import PropTypes from "prop-types";
import { useRef } from "react";
import ReactToPrint from "react-to-print";

const PrintPieChartData = ({
  isOpen,
  onClose,
  tableColumn,
  techData,
  pageSize,
  currentPage,
  isLargeScreen,
  fromDate,
  toDate,
}) => {
  const contentRef = useRef();
  const printRef = useRef();

  const handlePrint = () => {
    if (printRef.current) {
      printRef.current.handlePrint(); // Trigger the print action
    }
  };

  const fromDateObj = fromDate ? new Date(fromDate) : null;
  const toDateObj = toDate ? new Date(toDate) : null;

  // Helper function to format a Date object as "Month day, year"
  const formatDate = (dateObj) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
  };

  // Format the date range for display
  const formattedDateRange =
    fromDateObj && toDateObj
      ? ` ${formatDate(fromDateObj)} - ${formatDate(toDateObj)}`
      : "";

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 font-sans">
          {" "}
          <span>Print Preview</span>{" "}
          <button
            className="text-white px-5 py-2 ml-auto mr-5 rounded-md border-1 border-gray-300 bg-main hover:opacity-90"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handlePrint}
      okButtonProps={{
        color: "red",
        className: "text-white bg-main border-1 border-gray-300 hidden",
        size: "large",
      }}
      okText="Print"
      cancelButtonProps={{
        color: "red",
        className: "text-black border-1 border-gray-300",
        size: "large",
      }}
      width="100%"
    >
      <ReactToPrint ref={printRef} content={() => contentRef.current} />
      <div
        className="flex flex-col gap-2 pt-8 px-12 hide-pagination"
        ref={contentRef}
      >
        <div className="flex flex-col gap-2 items-center justify-center">
          <h4 className="text-lg">City Information Technology Center</h4>
          <h3 className="text-base font-bold">
            Computer Equipment Maintenance and Systems Engineering Division
          </h3>
          <div className="flex items-center justify-center gap-1">
            <h3 className="text-base">For the period</h3>
            <h1 className="font-bold text-base">{formattedDateRange}</h1>
          </div>
        </div>
        <Table
          className="mt-4"
          columns={tableColumn}
          dataSource={techData.map((item, index) => ({
            ...item,
            key: index,
          }))}
          scroll={isLargeScreen ? "" : { x: 1300 }}
          pageSize={pageSize}
          pagination={{
            pageSize: pageSize,
            current: currentPage,
          }}
        />
      </div>
    </Modal>
  );
};

PrintPieChartData.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tableColumn: PropTypes.any.isRequired,
  techData: PropTypes.any.isRequired,
  pageSize: PropTypes.any.isRequired,
  currentPage: PropTypes.any.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  fromDate: PropTypes.any,
  toDate: PropTypes.any,
};

export default PrintPieChartData;
