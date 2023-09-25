/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import PropTypes from "prop-types";
import { Button, Modal } from "antd";
import { message } from "antd";
import { useAuth } from "../AuthContext";

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
  const { fullName } = useAuth();

  const [formData, setFormData] = useState({
    request_id: data.id,
    receivedBy: fullName,
    assignedTo: "n/a",
    serviceBy: "n/a",
    toRecommend: "n/a",
    findings: "n/a",
    rootCause: "n/a",
    actionTaken: "n/a",
    remarks: "n/a",
  });
  // eslint-disable-next-line no-unused-vars
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

  const [technicians, setTechnicians] = useState([]);

  const fetchTechnicians = async () => {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/technician-list"
    );
    setTechnicians(response.data.results);
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  console.log(formData);

  const [selectedTechnician, setSelectedTechnician] = useState(null);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      height: "100%",
      width: "100%",
      outline: "none",
      display: "flex",
      overflowX: "auto",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#343467" : "white",
      color: state.isSelected ? "white" : "black",
    }),
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width="75%"
      title={
        <div className="flex justify-between items-center">
          <span>CITC TECHNICAL SERVICE REQUEST SLIP</span>
          <span>REQUEST ID: E-{data.id}</span>
        </div>
      }
      centered={true}
      footer={null}
      closable={false}
    >
      <div className="relative p-6 text-lg">
        {/* Display your data in a 4x5 grid */}
        {data && (
          <div className="grid lg:grid-cols-4 gap-y-4 gap-x-12 grid-cols-1">
            <div className="col-span-1">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="reqOffice"
              >
                Requesting Office
              </label>
              <input
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
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
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
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
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
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
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
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
                className=" border-b-2  border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
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
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
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
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
                type="text"
                id="authorizedBy"
                name="authorizedBy"
                value={data.authorizedBy}
                readOnly
              />
            </div>
            <div className="col-span-1 lg:row-start-3">
              <label className="block text-sm font-bold mb-2" htmlFor="unit">
                Unit
              </label>
              <input
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
                type="text"
                id="unit"
                name="unit"
                value={data.unit}
                readOnly
              />
            </div>
            <div className="col-span-1 lg:row-start-3">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="propertyNo"
              >
                Property No
              </label>
              <input
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
                type="text"
                id="propertyNo"
                name="propertyNo"
                value={data.propertyNo}
                readOnly
              />
            </div>
            <div className="col-span-1 lg:row-start-3">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="serialNo"
              >
                Serial No
              </label>
              <input
                className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
                type="text"
                id="serialNo"
                name="serialNo"
                value={data.serialNo}
                readOnly
              />
            </div>
            <div className="col-span-full">
              <label
                className="block text-sm font-bold mb-2"
                htmlFor="specialIns"
              >
                Special Ins
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

            {/* Add more columns as needed */}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative p-6 mb-10 text-lg">
          {/* ADMIN SIDE */}
          {data && (
            <div className="grid lg:grid-cols-4 gap-y-4 gap-x-12">
              <div className="col-span-1">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="receivedBy"
                >
                  Received By
                </label>
                <input
                  className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
                  placeholder="Received By"
                  type="text"
                  id="receivedBy"
                  name="receivedBy"
                  value={fullName}
                  onChange={(e) => {
                    changeUserFieldHandler(e);
                  }}
                  readOnly
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
                  className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
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
                <Select
                  name="assignedTo"
                  id="assignedTo"
                  required
                  className=" w-full border-b-2 border-gray-400    focus:outline-none"
                  value={selectedTechnician}
                  onChange={(selectedOption) => {
                    setSelectedTechnician(selectedOption); // Update selected option
                    changeUserFieldHandler({
                      target: {
                        name: "assignedTo",
                        value: selectedOption.value,
                      },
                    });
                  }}
                  options={technicians.map((option) => ({
                    value: option.userFirstName + " " + option.userLastName,
                    label: option.userFirstName + " " + option.userLastName,
                  }))}
                  placeholder="select..."
                  styles={customStyles}
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
                  className=" border-b-2 border-gray-400 bg-white appearance-none outline-none  w-full py-2 px-3 text-gray-700 leading-tight"
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
          <Button
            className="bg-gray-800 text-white h-12 font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
            htmlType="submit"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            loading={isSubmitting}
            type="primary"
            htmlType="submit"
            className="bg-gray-800  h-12  font-semibold flex items-center justify-center text-white text-base font-sans w-28 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out "
          >
            {isSubmitting ? "Updating" : "Update"}
          </Button>
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
