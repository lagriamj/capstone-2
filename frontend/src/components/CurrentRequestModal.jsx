import PrintPreviewModal from "./PrintPreviewModal";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Input } from "antd";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import "../assets/Stepper.css";
import axios from "axios";
import { Select, message } from "antd";

export default function CurrentRequestModal({
  display,
  itemData,
  onClose,
  isLargeScreen,
  isScreenWidth1366,
  fetchData,
}) {
  const [isPrintPreviewModalVisible, setIsPrintPreviewModalVisible] =
    useState(false);
  const [natureOptions, setNatureOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/nature-list`)
      .then((response) => {
        setNatureOptions(response.data.results);
      })
      .catch((error) => {
        console.error("Error loading natureOfRequest options:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/category-list`)
      .then((response) => {
        setUnitOptions(response.data.results);
      })
      .catch((error) => {
        console.error("Error loading unit options:", error);
      });
  }, []);

  const [updateData, setUpdateData] = useState({
    natureOfRequest: itemData.natureOfRequest,
    unit: itemData.unit,
    propertyNo: itemData.propertyNo,
    serialNo: itemData.serialNo,
    yearProcured: itemData.yearProcured,
    specialIns: itemData.specialIns,
  });

  const renderDataRow = (label, value) => (
    <div className="mb-3 font-sans">
      <div className="text-lg font-semibold">{label}:</div>
      <div className="mt-1 text-lg">{value}</div>
    </div>
  );

  const updateRequest = async (requestId, updateData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/update-request/${requestId}`,
        updateData
      );

      if (response.status === 200) {
        message.success("Request updated successfully");
        onClose();
        fetchData();
      } else {
        message.error("Request update failed");
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const handleUpdateClick = () => {
    updateRequest(itemData.request_id, updateData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({ ...prevData, [name]: value }));
  };
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

  const { TextArea } = Input;

  const footerContent = (
    <div className="flex gap-3">
      {itemData.status === "Pending" && (
        <button
          onClick={() => handleUpdateClick()}
          disabled={itemData.status !== "Pending"}
          className={`text-white rounded-lg font-bold uppercase px-3 flex ml-auto hover:opacity-90
        ${isScreenWidth1366 ? "text-sm py-3" : "text-base py-4"}
        ${
          itemData.status !== "Pending"
            ? "bg-gray-400 cursor-not-allowed pointer-events-none"
            : "bg-blue-600 hover:bg-opacity-95"
        }
        outline-none focus:outline-none ease-linear transition-all duration-150`}
        >
          Update
        </button>
      )}
      <button
        onClick={() => setIsPrintPreviewModalVisible(true)}
        className={`text-white bg-main rounded-lg hover:bg-opacity-95 font-bold uppercase px-3 flex  ${
          isScreenWidth1366 ? "text-sm py-3" : "text-base py-4"
        }   outline-none focus:outline-none ease-linear transition-all duration-150`}
      >
        Print Preview
      </button>
      <button
        onClick={onClose}
        className={`text-white bg-red-700 rounded-lg hover:bg-opacity-95 font-bold uppercase px-3 flex  ${
          isScreenWidth1366 ? "text-sm py-3" : "text-base py-4"
        }   outline-none focus:outline-none ease-linear transition-all duration-150`}
      >
        Close
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
        <div>
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
            <div className="w-[95%]">
              <div className="w-full">
                {renderDataRow(label[3])}
                <Input
                  name="propertyNo"
                  value={updateData.propertyNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-[95%]">
              <div className="w-full">
                {renderDataRow(label[4])}
                <Input
                  name="serialNo"
                  value={updateData.serialNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="w-full">
                {renderDataRow(label[5])}
                <Select
                  name="unit"
                  value={updateData.unit}
                  className="w-[95%]"
                  onChange={(value) =>
                    setUpdateData({ ...updateData, unit: value })
                  }
                >
                  {unitOptions.map((option) => (
                    <Select.Option
                      key={option.utilityCategory}
                      value={option.utilityCategory}
                    >
                      {option.utilityCategory}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className=" w-full">
              <div className="w-full">
                {renderDataRow(label[6])}
                <Select
                  name="natureOfRequest"
                  className="w-[95%]"
                  value={updateData.natureOfRequest}
                  onChange={(value) =>
                    setUpdateData({ ...updateData, natureOfRequest: value })
                  }
                >
                  {natureOptions.map((option) => (
                    <Select.Option
                      key={option.natureRequest}
                      value={option.natureRequest}
                    >
                      {option.natureOfRequest}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className=" w-full">
              <div className="w-full">
                {renderDataRow(label[7])}
                <Select
                  name="yearProcured"
                  className="w-[95%]"
                  value={updateData.yearProcured}
                  onChange={(value) =>
                    setUpdateData({ ...updateData, yearProcured: value })
                  }
                >
                  <Select.Option value="N/A">N/A</Select.Option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <Select.Option key={year} value={year.toString()}>
                        {year.toString()}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <div className="w-[95%]">
              <div className="w-full">
                {renderDataRow(label[8])}
                <TextArea
                  rows={4}
                  name="specialIns"
                  value={updateData.specialIns}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className=" w-full">
              <div className="w-full">
                {renderDataRow(label[9], itemData.authorizedBy)}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

CurrentRequestModal.propTypes = {
  display: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemData: PropTypes.object.isRequired,
  isLargeScreen: PropTypes.bool.isRequired,
  isScreenWidth1366: PropTypes.bool.isRequired,
  fetchData: PropTypes.any,
};
