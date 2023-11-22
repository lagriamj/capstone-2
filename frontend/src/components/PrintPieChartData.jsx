import { Table, Modal } from "antd";
import PropTypes from "prop-types";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import { useAuth } from "../AuthContext";

// ... (import statements)

const PrintPieChartData = ({
  isOpen,
  onClose,
  tableColumn,
  techData,
  isLargeScreen,
  fromDate,
  toDate,
}) => {
  const contentRef = useRef();
  const printRef = useRef();
  const { fullName } = useAuth();

  const handlePrint = () => {
    if (printRef.current) {
      printRef.current.handlePrint();
    }
  };

  const fromDateObj = fromDate ? new Date(fromDate) : null;
  const toDateObj = toDate ? new Date(toDate) : null;

  const formatDate = (dateObj) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
  };

  const formattedDateRange =
    fromDateObj && toDateObj
      ? ` ${formatDate(fromDateObj)} - ${formatDate(toDateObj)}`
      : "";

  // Define a new column for the index
  const indexColumn = {
    title: "#",
    dataIndex: "rowIndex",
    key: "rowIndex",
    align: "center",
    render: (text, record, index) => index + 1,
  };

  // Add the index column to the table columns
  const columnsWithIndex = [indexColumn, ...tableColumn];

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
          <div className="flex items-center justify-center gap-1">
            <h3 className="text-sm">For the period</h3>
            <h1 className="font-bold">{formattedDateRange}</h1>
          </div>
        </div>
        <Table
          className="mt-4"
          columns={columnsWithIndex} // Use the columns with the added index
          dataSource={techData}
          scroll={isLargeScreen ? "" : { x: 1300 }}
          pagination={false} // Disable pagination
        />
        <div className="flex relative">
          <div className="grid grid-cols-3 w-[80%] gap-4 font-sans mt-20">
            <div className="flex flex-col">
              <label htmlFor="">Prepared by:</label>
              <input
                type="text"
                className="text-black outline-none h-[20px]  text-base font-bold"
                placeholder="Prepared by name here"
                value={fullName}
                onChange={() => {}}
              />
              <p>Date: {formatDate(toDateObj)}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

PrintPieChartData.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tableColumn: PropTypes.any.isRequired,
  techData: PropTypes.array.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  fromDate: PropTypes.any,
  toDate: PropTypes.any,
};

export default PrintPieChartData;
