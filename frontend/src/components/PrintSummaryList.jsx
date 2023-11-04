import { Table, Modal } from "antd";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { useAuth } from "../AuthContext";

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
  totalReleased,
  totalUnclaimed,
  totalDefect,
}) => {
  const contentRef = useRef();
  const printRef = useRef();
  const { fullName } = useAuth();

  const fromDateObj = fromDate ? new Date(fromDate) : null;
  const toDateObj = toDate ? new Date(toDate) : null;

  // Helper function to format a Date object as "Month day, year"
  const formatDate = (dateObj) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObj?.toLocaleDateString(undefined, options);
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

  const [approvedBy, setApprovedBy] = useState("IVAN V. LIZARONDO");
  const [approvedByRole, setApprovedByRole] = useState(
    "Computer Maint. Technologist III"
  );
  const [head, setHead] = useState("Acting Division Head");
  const [notedBy, setNotedBy] = useState("NEPTHALY C. TALAVERA");
  const [notedByRole, setNotedByRole] = useState("Officer In-Charge, CITC");

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 font-sans">
          {" "}
          <span>Summary List Print Preview</span>{" "}
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

        <div className="flex relative">
          <div className="flex mt-2 text-sm absolute right-0 flex-col">
            <p>Total Released: {totalReleased}</p>
            <p>Total Unclaimed: {totalUnclaimed}</p>
            <p>Total Defect: {totalDefect}</p>
          </div>
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
            <div className="flex flex-col">
              <label htmlFor="">Approved by:</label>
              <input
                type="text"
                className="text-black outline-none h-[20px]  text-base  font-bold"
                placeholder="Approved by name here"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
              />
              <input
                type="text"
                className="text-black outline-none h-[20px] "
                placeholder="ex. Computer Main. Technologist..."
                value={approvedByRole}
                onChange={(e) => setApprovedByRole(e.target.value)}
              />
              <input
                type="text"
                className="text-black outline-none h-[20px] "
                placeholder="head here"
                value={head}
                onChange={(e) => setHead(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="">Noted by:</label>
              <input
                type="text"
                className="text-black outline-none h-[20px]  text-base font-bold"
                placeholder="Noted by name here"
                value={notedBy}
                onChange={(e) => setNotedBy(e.target.value)}
              />
              <input
                type="text"
                className="text-black outline-none h-[20px]"
                placeholder="officer in-charge here"
                value={notedByRole}
                onChange={(e) => setNotedByRole(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

PrintSummaryList.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tableColumn: PropTypes.any.isRequired,
  techData: PropTypes.any,
  pageSize: PropTypes.any.isRequired,
  currentPage: PropTypes.any.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  fromDate: PropTypes.any,
  toDate: PropTypes.any,
  totalReleased: PropTypes.any,
  totalUnclaimed: PropTypes.any,
  totalDefect: PropTypes.any,
};

export default PrintSummaryList;
