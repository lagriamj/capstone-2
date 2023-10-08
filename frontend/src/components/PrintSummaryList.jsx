import { Table, Modal } from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";

const PrintSummaryList = ({
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

  useEffect(() => {
    console.log("currentPage prop updated:", currentPage);
  }, [currentPage]);

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

  const handlePrint = () => {
    if (printRef.current) {
      printRef.current.handlePrint(); // Trigger the print action
    }
  };

  return (
    <Modal
      title="Summary List Print Preview"
      open={isOpen}
      onCancel={onClose}
      onOk={handlePrint}
      okButtonProps={{
        color: "red",
        className: "text-white bg-main border-1 border-gray-300",
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
          <h4 className="text-xs">City Information Technology Center</h4>
          <h3 className="text-sm font-bold">
            Computer Equipment Maintenance and Systems Engineering Division
          </h3>
          <h1 className="text-base font-bold">
            SUMMARY LIST OF REQUESTS RECEIVED AND RELEASED
          </h1>
          <div className="flex items-center justify-center gap-1">
            <h3 className="text-sm">For the period</h3>
            <h1 className="font-bold">{formattedDateRange}</h1>
          </div>
        </div>
        <Table
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

PrintSummaryList.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tableColumn: PropTypes.any.isRequired,
  techData: PropTypes.any.isRequired,
  pageSize: PropTypes.any.isRequired,
  currentPage: PropTypes.any.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  fromDate: PropTypes.any.isRequired,
  toDate: PropTypes.any.isRequired,
};

export default PrintSummaryList;
