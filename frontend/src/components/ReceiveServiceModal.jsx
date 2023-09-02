/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Modal } from "antd";
import PropagateLoader from "react-spinners/PropagateLoader";
import { message } from "antd";

const ReceiveServiceModal = ({ isOpen, onClose, data }) => {
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
    request_id: data.id,
    receivedBy: "n/a",
    assignedTo: "n/a",
    serviceBy: "n/a",
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
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/received-request",
        formData
      );

      if (response.status === 201) {
        console.log("Request received successfully.");
        setIsSubmitting(false);
        message.success("Updated Successfully");
        window.location.href = "/service-task";
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
        console.error("Error creating received request:", error);
        setError("An error occurred. Please try again later.");
      }
    }
  };

  console.log(formData);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="CITC TECHNICAL SERVICE REQUEST SLIP"
      width="70%"
      footer={null}
    >
      <div className="relative p-6">
        {/* Display your data in a 4x5 grid */}
        {data && (
          <div className="grid lg:grid-cols-4 gap-4 grid-cols-1">
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="reqOffice"
              >
                Requesting Office
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                htmlFor="modeOfRequest"
              >
                Mode Request
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                htmlFor="natureOfRequest"
              >
                Nature Request
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                htmlFor="authorizedBy"
              >
                Authorized By
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                htmlFor="specialIns"
              >
                Special Ins
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
              <label className="block text-sm font-bold mb-2" htmlFor="unit">
                Unit
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                htmlFor="propertyNo"
              >
                Property No
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                htmlFor="serialNo"
              >
                Serial No
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
        <div className="relative p-6 mb-10">
          {/* ADMIN SIDE */}
          {data && (
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="receivedBy"
                >
                  Received By
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="receivedBy"
                  name="receivedBy"
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="dateReceived"
                >
                  Date Received
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="dateReceived"
                  name="dateReceived"
                  value={daytime}
                  required
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="assignedTo"
                >
                  Assigned To
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  required
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="dateProcured"
                >
                  Date Procured
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="date"
                  id="dateProcured"
                  name="dateProcured"
                  value={data.dateProcured}
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
              <PropagateLoader color="#FFFFFF" size={5} className="mb-3" />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReceiveServiceModal;

ReceiveServiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};