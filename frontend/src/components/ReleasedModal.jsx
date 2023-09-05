/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { message } from "antd";
import PropagateLoader from "react-spinners/PropagateLoader";

const ServiceReleaseModal = ({ isOpen, onClose, data, refreshData }) => {
  if (!isOpen) return null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daytime = new Date().toLocaleString(undefined);
  console.log("request_id", data.request_id);

  const [formData, setFormData] = useState({
    request_id: data.request_id,
    receivedReq_id: data.id,
    approvedBy: "",
    noteBy: "",
    releasedBy: "",
    received_By: "",
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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/to-closed",
        formData
      );

      if (response.status === 201) {
        setIsSubmitting(false);
        message.success("Updated Successfully");
        window.location.href = "/service-transaction";
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
      title={
        <div className="flex justify-between items-center">
          <span>CITC TECHNICAL SERVICE REQUEST SLIP</span>
          <span>REQUEST ID: {data.id}</span>
        </div>
      }
      centered
      footer={null}
      closable={false}
    >
      <div className="relative p-6 text-lg">
        {data && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2 text-black"
                htmlFor="propertyNo"
              >
                Requesting Office
              </label>
              <input
                className="shadow-md appearance-none border-2  rounded-lg w-full py-2 px-3 bg-gray-200  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                Date Service
              </label>
              <input
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="serviceBy"
                name="serviceBy"
                value={data.serviceBy}
                readOnly
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
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="dateServiced"
                name="dateServiced"
                value={data.dateServiced}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="propertyNo"
              >
                Findings/Particulars
              </label>
              <input
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="findings"
                name="findings"
                value={data.findings}
                readOnly
              />
              <input
                className="shadow-md bg-gray-200 appearance-none border rounded-lg py-2 px-3 ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="rootCause"
                name="rootCause"
                value={data.rootCause}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="propertyNo"
              >
                Action Taken
              </label>
              <input
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="actionTaken"
                name="actionTaken"
                value={data.actionTaken}
                readOnly
              />
              <input
                className="shadow-md bg-gray-200 appearance-none border rounded-lg py-2 px-3 ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="remarks"
                name="remarks"
                value={data.remarks}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="propertyNo"
              >
                Recommendation
              </label>

              <input
                className="shadow-md bg-gray-200 appearance-none border w-full rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="toRecommend"
                name="toRecommend"
                value={data.toRecommend}
                readOnly
              />
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mt-10 grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="propertyNo"
              >
                Approved By
              </label>
              <input
                className="shadow-md border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="approvedBy"
                name="approvedBy"
                defaultValue={data.approvedBy}
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
                Date Approved
              </label>
              <input
                className="shadow-md border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="dateApproved"
                name="dateApproved"
                value={daytime}
                disabled
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="propertyNo"
              >
                Released By
              </label>
              <input
                className="shadow-md border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="releasedBy"
                name="releasedBy"
                defaultValue={data.releasedBy}
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
                Date Released
              </label>
              <input
                className="shadow-md border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="dateReleased"
                name="dateReleased"
                value={daytime}
                disabled
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="propertyNo"
              >
                Noted By
              </label>
              <input
                className="shadow-md border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="noteBy"
                name="noteBy"
                defaultValue={data.noteBy}
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
                Date Noted
              </label>
              <input
                className="shadow-md border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="dateNoted"
                name="dateNoted"
                value={daytime}
                disabled
              />
            </div>
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="propertyNo"
              >
                Received By
              </label>
              <input
                className="shadow-md border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="received_By"
                name="received_By"
                defaultValue={data.received_By}
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
                Date Received
              </label>
              <input
                className="shadow-md border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="date_Received"
                name="date_Received"
                value={daytime}
                disabled
              />
            </div>
          </div>
          <div className="flex ml-auto w-full  gap-2 justify-end border-t-2 pt-5 pr-6">
            <button
              className="bg-gray-800 text-white font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
              type="submit"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-gray-800 text-white font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
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
      </div>
      {/* Footer */}
    </Modal>
  );
};

export default ServiceReleaseModal;

ServiceReleaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Ensure that 'visible' is a required boolean prop
  onClose: PropTypes.func.isRequired, // Ensure that 'onClose' is a required function prop
  data: PropTypes.object, // Ensure that 'itemData' is a required object prop
  refreshData: PropTypes.func.isRequired,
};
