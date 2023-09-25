/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { Skeleton } from "antd";
import { message } from "antd";
import PropagateLoader from "react-spinners/PropagateLoader";

const ClosedModal = ({ isOpen, onClose, datas, refreshData }) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isSingleRequest, setIsSingleRequest] = useState(false);

  useEffect(() => {
    fetchData();
  }, [datas]); // Trigger fetch when datas prop changes

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/closed-view/${datas.id}`
      );
      if (response.status === 200) {
        setLoading(false);
        setData(response.data.results);
        setIsSingleRequest(response.data.results.length === 1);
      } else {
        setLoading(false);
        console.error("Failed to fetch utility settings. Response:", response);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching utility settings:", error);
    }
  };

  // Function to render input fields based on data
  const RequestDetails = () => {
    if (loading) {
      return <Skeleton active />;
    } else if (data.length === 0) {
      return <p>No Records Yet.</p>;
    } else {
      return data.map((item, index) => (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" key={index}>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2 text-black"
              htmlFor={`reqOffice`}
            >
              Requesting Office
            </label>
            <input
              className="shadow-md appearance-none border-2 rounded-lg w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={item.reqOffice || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2" htmlFor="reqOffice">
              Division
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={item.division || "No data"}
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
              value={item.dateRequested || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Mode of Request
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={item.modeOfRequest || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Nature of Request
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={item.natureOfRequest || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Requested By
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="fullName"
              name="fullName"
              value={item.fullName || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Authorized By
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="authorizedBy"
              name="authorizedBy"
              value={item.authorizedBy || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1 col-start-4 row-span-2">
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Special Instruction
            </label>

            <textarea
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              rows={5}
              id="specialIns"
              name="specialIns"
              value={item.specialIns || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Unit
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="unit"
              name="unit"
              value={item.unit || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Property No
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="propertyNo"
              name="propertyNo"
              value={item.propertyNo || "No data"}
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Serial No
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="serialNo"
              name="serialNo"
              value={item.serialNo || "No data"}
              readOnly
            />
          </div>
        </div>
      ));
    }
  };

  const ReceivedDetails = () => {
    if (loading) {
      return <Skeleton active />;
    } else if (data.length === 0) {
      return <p>No Records Yet.</p>;
    } else {
      return data.map((item, index) => (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" key={index}>
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
              value={item.receivedBy || "No data"}
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
              value={item.dateReceived || "No data"}
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
              value={item.assignedTo || "No data"}
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
              value={item.dateProcured || "No data"}
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
              value={item.serviceBy || "No data"}
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
              value={item.dateServiced || "No data"}
              readOnly
            />
          </div>
          <div className="col-start-3 row-span-2">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="propertyNo"
            >
              Findings/Particulars
            </label>
            <div className="flex flex-col gap-3">
              <input
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="findings"
                name="findings"
                value={item.findings || "No data"}
                readOnly
              />
              <textarea
                rows={5}
                className="shadow-md bg-gray-200 appearance-none border rounded-lg py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="rootCause"
                name="rootCause"
                value={item.rootCause || "No data"}
                readOnly
              />
            </div>
          </div>
          <div className="col-start-4 row-span-2">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="propertyNo"
            >
              Action Taken
            </label>
            <div className="flex flex-col gap-3">
              <input
                className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="actionTaken"
                name="actionTaken"
                value={item.actionTaken || "No data"}
                readOnly
              />
              <textarea
                className="shadow-md bg-gray-200 appearance-none border rounded-lg py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={5}
                type="text"
                id="remarks"
                name="remarks"
                value={item.remarks || "No data"}
                readOnly
              />
            </div>
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
              value={item.toRecommend || "No data"}
              readOnly
            />
          </div>
        </div>
      ));
    }
  };

  const ReleasedDetails = () => {
    if (loading) {
      return <Skeleton active />;
    } else if (data.length === 0) {
      return <p>No Records Yet.</p>;
    } else {
      return data.map((item, index) => (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" key={index}>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="propertyNo"
            >
              Approved By
            </label>
            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="approvedBy"
              name="approvedBy"
              value={item.approvedBy || "No data"}
              readOnly
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
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="dateApproved"
              name="dateApproved"
              value={item.dateApproved || "No data"}
              readOnly
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
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="releasedBy"
              name="releasedBy"
              value={item.releasedBy || "No data"}
              readOnly
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
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="dateReleased"
              name="dateReleased"
              value={item.dateReleased || "No data"}
              readOnly
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
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="noteBy"
              name="noteBy"
              value={item.noteBy || "No data"}
              readOnly
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
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="dateNoted"
              name="dateNoted"
              value={item.dateNoted || "No data"}
              readOnly
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
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="received_By"
              name="received_By"
              value={item.received_By || "No data"}
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
              type="text"
              id="date_Received"
              name="date_Received"
              value={item.date_Received || "No data"}
              readOnly
            />
          </div>
        </div>
      ));
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width="75%"
      title={
        <div className="flex justify-between items-center">
          <span>CITC TECHNICAL SERVICE REQUEST SLIP</span>
          <span>REQUEST ID: {datas.id}</span>
        </div>
      }
      centered
      footer={null}
      closable={false}
    >
      <div className="relative p-6 text-lg">{RequestDetails()}</div>
      <div className="relative p-6 text-lg">{ReceivedDetails()}</div>
      <div className="relative p-6 text-lg">{ReleasedDetails()}</div>

      <div className="flex ml-auto w-full  gap-2 justify-end border-t-2 pt-5 pr-6">
        <button
          className="bg-gray-800 text-white font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
          type="submit"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>

      {/* Footer */}
    </Modal>
  );
};

ClosedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  datas: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
};

export default ClosedModal;
