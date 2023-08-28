import React from "react";
import PrintPreviewModal from "./PrintPreviewModal";
import { useState } from "react";
import Modal from "antd/es/modal/Modal";

export default function CurrentRequestModal({ display, itemData, onClose }) {
  const [isPrintPreviewModalVisible, setIsPrintPreviewModalVisible] =
    useState(false);

  const renderDataRow = (label, value) => (
    <div className="mb-3">
      {" "}
      {/* Reduced margin-bottom */}
      <div className="text-lg font-semibold">{label}:</div>
      <div className="mt-1">{value}</div>
    </div>
  );

  const data = [
    { label: "Requesting Office", value: itemData.reqOffice },
    { label: "Division", value: itemData.division },
    { label: "Nature of Request", value: itemData.natureOfRequest },
    { label: "Date Requested", value: itemData.dateRequested },
    { label: "Mode of Request", value: itemData.modeOfRequest },
    { label: "Unit", value: itemData.unit },
    { label: "Property No", value: itemData.propertyNo },
    { label: "Serial No", value: itemData.serialNo },
    { label: "Authorized By", value: itemData.authorizedBy },
    { label: "Date Procured", value: itemData.dateProcured },
    { label: "Special Instruction", value: itemData.specialIns },
  ];

  const numRows = 3;
  const numCols = 4;

  const footerContent = (
    <div>
      <button
        className="bg-red-800 text-white rounded-lg px-4 py-2"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );

  return (
    <>
      <Modal
        open={display}
        onCancel={onClose}
        width="50%"
        footer={footerContent}
      >
        <div className="border-0 rounded-2xl shadow-lg relative flex flex-col w-full h-[65vh] bg-white outline-none focus:outline-none">
          <div className="bg-main p-3 flex items-center justify-center py-7 rounded-t-2xl">
            {" "}
            {/* Reduced padding */}
            <h3 className="text-2xl font-semibold ml-4  text-white">
              Request Details
            </h3>
            <button
              onClick={() => setIsPrintPreviewModalVisible(true)}
              className="text-main bg-white rounded-lg  hover:bg-opacity-95 font-bold uppercase px-3 flex ml-auto py-4 mr-4 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
            >
              Print Preview
            </button>
            <PrintPreviewModal
              visible={isPrintPreviewModalVisible}
              onClose={() => setIsPrintPreviewModalVisible(false)}
              itemData={itemData}
            />
          </div>
          <div className="p-3 flex-auto landscape-content lg:pl-20 place-content-center grid grid-cols-3 gap-3">
            {" "}
            {/* Reduced padding */}
            {data.slice(0, numRows * numCols).map(({ label, value }, index) => (
              <div key={index}>{renderDataRow(label, value)}</div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
