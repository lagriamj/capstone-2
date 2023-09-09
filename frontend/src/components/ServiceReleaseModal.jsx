/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Button, Modal } from "antd";
import { message } from "antd";

const ServiceReleaseModal = ({ isOpen, onClose, data, refreshData }) => {
  if (!isOpen) return null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    request_id: data.request_id,
    receivedBy: data.receivedBy,
    dateReceived: data.dateReceived,
    assignedTo: data.assignedTo,
    serviceBy: data.serviceBy,
    dateServiced: data.dateServiced,
    toRecommend: "",
    findings: "",
    rootCause: "",
    actionTaken: "",
    remarks: "",
  });
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  console.log(data.id);

  const changeUserFieldHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [utility, setUtility] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/api/category-list");

      setUtility(result.data.results);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/torelease-request/${data.id}`,
        formData
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        message.success("Updated Successfully");
        onClose();
        refreshData();
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
      <form onSubmit={handleSubmit}>
        <div className="relative p-6 text-lg">
          {/* ADMIN SIDE */}
          {data && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
                <select
                  className="shadow-md appearance-none border-2 border-gray-800 mb-2 lg:mb-0 rounded-lg w-20 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="findings"
                  name="findings"
                  required
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                  defaultValue={""}
                >
                  <option value="">Select an option...</option>
                  {utility.map((option, index) => (
                    <option key={index} value={option.utilityCategory}>
                      {option.utilityCategory}
                    </option>
                  ))}
                </select>
                <input
                  className="shadow-md appearance-none border-2 border-gray-800 rounded-lg  py-2 px-3 lg:ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="rootCause"
                  name="rootCause"
                  required
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>
              <div className="col-span-1 ">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="propertyNo"
                >
                  Action Taken
                </label>
                <select
                  className="shadow-md appearance-none border-2 border-gray-800 rounded-lg w-20 mb-2 lg:mb-0 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="actionTaken"
                  name="actionTaken"
                  required
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                  defaultValue={""}
                >
                  <option value="">Select an option...</option>
                  {utility.map((option, index) => (
                    <option key={index} value={option.utilityCategory}>
                      {option.utilityCategory}
                    </option>
                  ))}
                </select>
                <input
                  className="shadow-md appearance-none border-2 border-gray-800 rounded-lg py-2 px-3 lg:ml-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="remarks"
                  name="remarks"
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
                  Recommendation
                </label>

                <input
                  className="shadow-md appearance-none border-2 border-gray-800 w-full rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  id="toRecommend"
                  name="toRecommend"
                  required
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex ml-auto w-full  gap-2 justify-end border-t-2 pt-5 pr-6">
          <button
            className="bg-gray-800 text-white font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
            type="submit"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
            className="bg-gray-800  py-7  font-semibold flex items-center justify-center text-white text-base font-sans w-28 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out "
          >
            {isSubmitting ? "Updating" : "Update"}
          </Button>
        </div>
      </form>
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
