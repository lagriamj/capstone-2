import PrintPreviewModal from "./PrintPreviewModal";
import { useState } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

export default function CurrentRequestModal({
  display,
  itemData,
  onClose,
  isLargeScreen,
}) {
  const [isPrintPreviewModalVisible, setIsPrintPreviewModalVisible] =
    useState(false);

  const renderDataRow = (label, value) => (
    <div className="mb-3 font-sans">
      {" "}
      {/* Reduced margin-bottom */}
      <div className="text-lg font-semibold">{label}:</div>
      <div className="mt-1">{value}</div>
    </div>
  );

  const label = [
    "Requesting Office",
    "Division",
    "Mode of Request",
    "Property No",
    "Serial No",
    "Unit",
    "Nature of Request",
    "Date Procured",
    "Special Instruction",
    "Authorized By",
  ];

  const footerContent = (
    <div className="flex gap-3">
      <button
        onClick={() => setIsPrintPreviewModalVisible(true)}
        className="text-white bg-main rounded-lg hover:bg-opacity-95 font-bold uppercase px-3 flex ml-auto py-4  text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
      >
        Print Preview
      </button>
      <button
        className="bg-red-800 text-white w-24 text-base font-bold  rounded-lg pb-1"
        onClick={onClose}
      >
        EXIT
      </button>
    </div>
  );

  const steps = ["Pending", "Received", "On Progress", "To Release"];

  const activeIndex = steps.indexOf(itemData.status);

  return (
    <>
      <Modal
        open={display}
        onCancel={onClose}
        centered
        title={
          <div className="flex flex-col lg:flex-row font-sans text-xl py-6 px-10">
            <label>{`Request ID: ${itemData.id}`}</label>
            <label className="ml-auto ">{`Date Requested: ${
              itemData.dateRequested.split(" ")[0]
            }`}</label>
          </div>
        }
        width={isLargeScreen ? "60%" : "80%"}
        footer={footerContent}
      >
        {" "}
        <h3 className="text-2xl font-semibold ml-4  text-white">
          Request Details
        </h3>
        <PrintPreviewModal
          visible={isPrintPreviewModalVisible}
          onClose={() => setIsPrintPreviewModalVisible(false)}
          itemData={itemData}
        />
        <Stepper alternativeLabel className="mb-10">
          {steps.map((status, index) => (
            <Step key={index} completed={index < activeIndex}>
              <StepLabel icon={index}>{status}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="my-6 pb-4 w-full border-b-2 border-gray-400">
          <label className="m-10 text-2xl font-sans font-semibold">
            Request Details:
          </label>
        </div>
        <div className="px-10 flex-auto border-b-2 border-gray-400 text-base pb-2 place-content-center grid grid-cols-1 lg:grid-cols-3 gap-y-10">
          {" "}
          {/* Reduced padding */}
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[0], itemData.reqOffice)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[1], itemData.division)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[2], itemData.modeOfRequest)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[3], itemData.propertyNo)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[4], itemData.serialNo)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[5], itemData.unit)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[6], itemData.natureOfRequest)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[7], itemData.dateProcured)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[8], itemData.specialIns)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              {renderDataRow(label[9], itemData.authorizedBy)}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

CurrentRequestModal.propTypes = {
  display: PropTypes.bool.isRequired, // Ensure that 'visible' is a required boolean prop
  onClose: PropTypes.func.isRequired, // Ensure that 'onClose' is a required function prop
  itemData: PropTypes.object.isRequired, // Ensure that 'itemData' is a required object prop
  isLargeScreen: PropTypes.bool.isRequired,
};
