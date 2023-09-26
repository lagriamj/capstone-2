/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import { Button, Modal, Form, Input, Row, Col, Select } from "antd";
import { message } from "antd";
import { useAuth } from "../AuthContext";

const ReceiveServiceModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const { TextArea } = Input;

  const [selectedTechnician, setSelectedTechnician] = useState("");
  console.log(selectedTechnician);

  const handleChangeAssignedTo = (value) => {
    console.log("Selected Technician:", value);
    setSelectedTechnician(value);
  };

  const [form] = Form.useForm();
  const { Option } = Select;

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
  const [dataForm, setDataForm] = useState(null);
  console.log(dataForm);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const values = await form.validateFields();
    const modifiedValues = {
      ...values,
      serviceBy: "n/a",
      assignedTo: selectedTechnician,
    };
    setDataForm(values);
    setSelectedTechnician(values.assignedTo);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/received-request",
        modifiedValues
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
      } else {
        setIsSubmitting(false);
        console.error("Error creating received request:", error);
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

  const customFilterOption = (inputValue, option) =>
    option.value?.toLowerCase().includes(inputValue.toLowerCase());

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
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2 text-black">
                Requesting Office
              </label>
              <Input value={data.reqOffice} readOnly className="h-[40px] " />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">Division</label>
              <Input value={data.division} readOnly className="h-[40px] " />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Date Request
              </label>
              <Input
                value={data.dateRequested}
                readOnly
                className="h-[40px] "
              />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Mode Request
              </label>
              <Input
                value={data.modeOfRequest}
                readOnly
                className="h-[40px] "
              />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Nature of Request
              </label>
              <Input
                value={data.natureOfRequest}
                readOnly
                className="h-[40px] "
              />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Requested By
              </label>
              <Input value={data.fullName} readOnly className="h-[40px] " />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Authorized By
              </label>
              <Input value={data.authorizedBy} readOnly className="h-[40px] " />
            </Col>
            <Col xs={24} lg={24}>
              <label className="block text-sm font-bold mb-2">
                Special Instructions
              </label>
              <TextArea
                rows={5}
                value={data.specialIns}
                readOnly
                className="h-[40px] "
              />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">Unit</label>
              <Input value={data.unit} readOnly className="h-[40px] " />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Property No
              </label>
              <Input value={data.propertyNo} readOnly className="h-[40px] " />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">Serial No</label>
              <Input value={data.serialNo} readOnly className="h-[40px] " />
            </Col>

            {/* Add more columns as needed */}
          </Row>
        )}
      </div>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          request_id: data.id,
          receivedBy: fullName,
          assignedTo: selectedTechnician,
          serviceBy: "n/a",
          dateProcured: data.dateProcured,
          dateReceived: daytime,
          toRecommend: "n/a",
          findings: "n/a",
          rootCause: "n/a",
          actionTaken: "n/a",
          remarks: "n/a",
        }}
        layout="vertical"
      >
        <div className="relative p-6  text-lg">
          {/* ADMIN SIDE */}
          {data && (
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Received By
                    </label>
                  }
                  name="receivedBy"
                >
                  <Input readOnly value={data.fullName} className="h-[40px] " />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold ">
                      Date Received
                    </label>
                  }
                  name="dateReceived"
                >
                  <Input readOnly value={daytime} className="h-[40px] " />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Assigned To
                    </label>
                  }
                  name={["assignedTo", "technician"]}
                >
                  <Select
                    size="large"
                    showSearch
                    filterOption={customFilterOption}
                    className="h-[40px] "
                    onChange={handleChangeAssignedTo}
                    value={selectedTechnician}
                  >
                    {technicians.map((option) => (
                      <Option
                        key={option.userID}
                        value={`${option.userFirstName} ${option.userLastName}`}
                      >
                        {`${option.userFirstName} ${option.userLastName}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold ">
                      Date Procured
                    </label>
                  }
                  name="dateProcured"
                >
                  <Input
                    readOnly
                    value={data.dateProcured}
                    className="h-[40px] "
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="request_id">
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="servicedBy">
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="actionTaken">
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="findings">
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="remarks">
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="rootCause">
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="toRecommend">
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
            </Row>
          )}{" "}
          <div className="flex ml-auto w-full h-10 gap-2 justify-end border-t-2 pt-5 pr-6">
            <Button
              className="bg-red-700 text-white h-12 font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
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
        </div>
      </Form>
    </Modal>
  );
};

export default ReceiveServiceModal;

ReceiveServiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};
