import PrintPreviewModal from "./PrintPreviewModal";
import { useState } from "react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import "../assets/Stepper.css";

export default function CurrentRequestModal({
  display,
  itemData,
  onClose,
  isLargeScreen,
  isScreenWidth1366,
}) {
  const [isPrintPreviewModalVisible, setIsPrintPreviewModalVisible] =
    useState(false);

  const renderDataRow = (label, value) => (
    <div className="mb-3 font-sans">
      {" "}
      {/* Reduced margin-bottom */}
      <div className="text-lg font-semibold">{label}:</div>
      <div className="mt-1 text-lg">{value}</div>
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
    "Year Procured",
    "Special Instruction",
    "Authorized By",
  ];

  const footerContent = (
    <div className="flex gap-3">
      <button
        onClick={() => setIsPrintPreviewModalVisible(true)}
        className={`text-white bg-main rounded-lg hover:bg-opacity-95 font-bold uppercase px-3 flex ml-auto ${
          isScreenWidth1366 ? "text-sm py-3" : "text-base py-4"
        }   outline-none focus:outline-none ease-linear transition-all duration-150`}
      >
        Print Preview
      </button>
      <button
        className={`bg-red-800 text-white w-24 ${
          isScreenWidth1366 ? "text-sm" : "text-base"
        } font-bold  rounded-lg `}
        onClick={onClose}
      >
        EXIT
      </button>
    </div>
  );

  const steps = ["Pending", "Received", "On Progress", "To Release"];

  const activeIndex = steps.indexOf(itemData.status);

  function TextTruncate({ text, maxLength }) {
    const [isTruncated, setIsTruncated] = useState(true);

    const toggleTruncate = () => {
      setIsTruncated(!isTruncated);
    };

    return (
      <div>
        {isTruncated ? (
          <div className="text-base">
            {text.length > maxLength ? (
              <>
                {text.slice(0, maxLength)}
                <span
                  onClick={toggleTruncate}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  ...Show more
                </span>
              </>
            ) : (
              text
            )}
          </div>
        ) : (
          <div>
            {text}
            <span
              onClick={toggleTruncate}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Show less
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Modal
        open={display}
        onCancel={onClose}
        centered
        title={
          <div
            className={`flex flex-col lg:flex-row font-sans ${
              isScreenWidth1366 ? "text-base" : "text-xl"
            } py-6 px-10`}
          >
            <label>{`Request ID: ${itemData.request_code}`}</label>
            <label className="ml-auto ">{`Date Requested: ${
              itemData.dateRequested.split(" ")[0]
            }`}</label>
          </div>
        }
        width={isLargeScreen ? "60%" : "80%"}
        footer={footerContent}
      >
        <PrintPreviewModal
          visible={isPrintPreviewModalVisible}
          onClose={() => setIsPrintPreviewModalVisible(false)}
          itemData={itemData}
          reqID={itemData.request_id}
        />
        <Stepper
          alternativeLabel
          className={`${isScreenWidth1366 ? "mb-5" : "mb-10"}`}
        >
          {steps.map((status, index) => (
            <Step key={index} completed={index < activeIndex}>
              <StepLabel sx={{ fontSize: "24px" }} icon={index}>
                <span className="text-lg">{status}</span>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="my-6 pb-4 w-full border-b-2 border-gray-400">
          <label
            className={`m-10 ${
              isScreenWidth1366 ? "text-xl" : "text-2xl"
            } font-sans font-semibold`}
          >
            Request Details:
          </label>
        </div>
        <div
          className={`px-10 flex-auto border-b-2 border-gray-400 ${
            isScreenWidth1366 ? "text-sm gap-y-5" : "text-base gap-y-10"
          } pb-2 place-content-center grid grid-cols-1 lg:grid-cols-3 `}
        >
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
              {renderDataRow(label[7], itemData.yearProcured)}
            </div>
          </div>
          <div className=" w-full">
            <div className="w-full">
              <div className="text-lg font-semibold">{label[8]}</div>
              <TextTruncate text={itemData.specialIns} maxLength={150} />
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
  isScreenWidth1366: PropTypes.bool.isRequired,
  text: PropTypes.string,
  maxLength: PropTypes.number,
};
