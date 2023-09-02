/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Modal } from "antd";
import "./ServiceTaskModal.css";
import { message } from "antd";
import PropagateLoader from "react-spinners/PropagateLoader";

const ServiceTaskModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const daytime = new Date().toLocaleString(undefined, options);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    request_id: data.request_id,
    receivedBy: data.receivedBy,
    dateReceived: data.dateReceived,
    assignedTo: data.assignedTo,
    serviceBy: "",
    toRecommend: "n/a",
    findings: "n/a",
    rootCause: "n/a",
    actionTaken: "n/a",
    remarks: "n/a",
  });
  const [error, setError] = useState("");
  console.log(data.id);

  const changeUserFieldHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/serviced/${data.id}`,
        formData
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        message.success("Updated Successfully");
        onClose(); // Close the modal
      } else {
        setIsSubmitting(false);
        console.error("Received an unexpected response:", response);
      }
    } catch (error) {
      if (error.response) {
        setIsSubmitting(false);
        console.error("Request failed with status:", error.response.status);
        console.log("Response error data:", error.response.data);
        setError("An error occurred while processing the request.");
      } else {
        setIsSubmitting(false);
        console.error("Error updating ReceiveService:", error);
        setError("An error occurred. Please try again later.");
      }
    }
  };

  console.log(formData);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width="75%"
      title="CITC TECHNICAL SERVICE REQUEST SLIP"
      centered
      footer={null}
    >
      <div className="relative p-6 text-lg">
        {data && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2 text-white"
                htmlFor="propertyNo"
              >
                Requesting Office
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="reqOffice"
                name="reqOffice"
                value={data.reqOffice}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="reqOffice"
              >
                Division
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="division"
                name="division"
                value={data.division}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="dateRequested"
              >
                Date Request
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="dateRequested"
                name="dateRequested"
                value={data.dateRequested}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="natureOfRequest"
              >
                Mode Request
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="modeOfRequest"
                name="modeOfRequest"
                value={data.modeOfRequest}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                Nature Request
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="natureOfRequest"
                name="natureOfRequest"
                value={data.natureOfRequest}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                Requested By
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="fullName"
                name="fullName"
                value={data.fullName}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                Authorized By
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="authorizedBy"
                name="authorizedBy"
                value={data.authorizedBy}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                Special Instruction
              </label>

              <textarea
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="SpecialIns"
                id="SpecialIns"
                cols="10"
                rows="5"
                readOnly
                value={data.specialIns}
              ></textarea>
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                Unit
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="unit"
                name="unit"
                value={data.unit}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                Property No
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="propertyNo"
                name="propertyNo"
                value={data.propertyNo}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="fullName"
              >
                Serial No
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="serialNo"
                name="serialNo"
                value={data.serialNo}
                readOnly
              />
            </div>

            {/* Add more columns as needed */}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative p-6 text-lg">
          {/* ADMIN SIDE */}
          {data && (
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="propertyNo"
                >
                  Received By
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="receivedBy"
                  name="receivedBy"
                  value={data.receivedBy}
                  readOnly
                />
              </div>
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="propertyNo"
                >
                  Date Received
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dateReceived"
                  name="dateReceived"
                  value={data.dateReceived}
                  readOnly
                />
              </div>
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="propertyNo"
                >
                  Assigned To
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={data.assignedTo}
                  readOnly
                />
              </div>
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="propertyNo"
                >
                  Date Procured
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="date"
                  id="dateProcured"
                  name="dateProcured"
                  value={data.dateProcured}
                  readOnly
                />
              </div>
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="propertyNo"
                >
                  Serviced By
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="serviceBy"
                  name="serviceBy"
                  required
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="propertyNo"
                >
                  Date Service
                </label>
                <input
                  className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="dateServiced"
                  name="dateServiced"
                  value={daytime}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex ml-auto w-full  gap-2 justify-end border-t-2 pt-5 pr-6">
          <button
            className="bg-white text-black font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-gray-800 hover:text-white hover:border-2 hover:border-white"
            type="submit"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-white text-black font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-gray-800 hover:text-white hover:border-2 hover:border-white"
            type="submit"
          >
            {isSubmitting ? (
              <PropagateLoader color="#FFFFFF" size={10} className="mb-3" />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
      {/* Footer */}
    </Modal>
  );
};

export default ServiceTaskModal;

ServiceTaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Ensure that 'visible' is a required boolean prop
  onClose: PropTypes.func.isRequired, // Ensure that 'onClose' is a required function prop
  data: PropTypes.object, // Ensure that 'itemData' is a required object prop
};