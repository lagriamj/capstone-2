/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { Skeleton } from "antd";

const ViewCancel = ({ isOpen, onClose, datas, role }) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isSingleRequest, setIsSingleRequest] = useState(false);

  useEffect(() => {
    fetchData();
  }, [datas]); // Trigger fetch when datas prop changes

  const getApiEndpoint = () => {
    // Determine the API endpoint based on the user's role
    if (role === "admin") {
      return `http://127.0.0.1:8000/api/view-cancelled/${datas.request_id}`;
    } else if (role === "user") {
      return `http://127.0.0.1:8000/api/view-cancelled/${datas.id}`;
    }
    // Handle other roles or scenarios as needed
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getApiEndpoint());
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
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Special Instruction
            </label>

            <input
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
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
          <div className="col-span-4 ">
            <label className="block text-sm font-bold mb-2" htmlFor="fullName">
              Cancelled Reason
            </label>
            <textarea
              rows={6}
              className="shadow-md bg-gray-200 appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="reason"
              name="reason"
              value={item.reason || "No data"}
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
          <span>REQUEST ID: E-{datas.id}</span>
        </div>
      }
      centered
      footer={null}
      closable={false}
    >
      <div className="relative p-6 text-lg">{RequestDetails()}</div>
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

ViewCancel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  datas: PropTypes.object,
};

export default ViewCancel;
