/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import { Button, Modal, Form, Input, Row, Col, Select } from "antd";
import { message } from "antd";
import { useAuth } from "../AuthContext";

const ReceiveServiceModal = ({ isOpen, onClose, data, refreshData }) => {
  if (!isOpen) return null;

  const { TextArea } = Input;

  const [selectedTechnician, setSelectedTechnician] = useState("");

  const handleChangeAssignedTo = (value) => {
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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const values = await form.validateFields();
      const modifiedValues = {
        ...values,
        assignedTo: selectedTechnician,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/received-request/${
          data.request_id
        }/${fullName}`,
        modifiedValues
      );

      if (response.status === 201) {
        setIsSubmitting(false);
        message.success("Updated Successfully");
        onClose();
        refreshData();
      } else {
        console.error("Received an unexpected response:", response);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error);

      setIsSubmitting(false);
    }
  };

  const [technicians, setTechnicians] = useState([]);

  const fetchTechnicians = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/technician-list`
    );
    setTechnicians(response.data.results);
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const customFilterOption = (inputValue, option) =>
    option.value?.toLowerCase().includes(inputValue.toLowerCase());

  const isWalkIn = data.modeOfRequest === "Walk-In";

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width="75%"
      title={
        <div className="flex gap-20 items-center">
          <span>CITC TECHNICAL SERVICE REQUEST SLIP</span>
        </div>
      }
      centered={true}
      footer={null}
      closable={false}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          request_id: data.request_id,
          dateRequested: data.dateRequested,
          status: data.status,
          request_code: data.request_code,
          receivedBy: fullName,
          assignedTo: selectedTechnician,
          yearProcured: data.yearProcured,
          dateReceived: daytime,
          fullName: data.fullName,
          reqOffice: data.reqOffice,
          division: data.division,
          modeOfRequest: data.modeOfRequest,
          natureOfRequest: data.natureOfRequest,
          authorizedBy: data.authorizedBy,
          specialIns: data.specialIns,
          unit: data.unit,
          serialNo: data.serialNo,
          propertyNo: data.propertyNo,
        }}
        layout="vertical"
      >
        <div className="relative p-6 text-lg">
          {/* ADMIN SIDE */}
          {data && (
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Request ID
                    </label>
                  }
                  name="request_code"
                >
                  <Input
                    readOnly
                    value={data.request_code}
                    className={`h-[40px] font-bold text-lg border-0 `}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Request Date
                    </label>
                  }
                  name="dateRequested"
                >
                  <Input
                    readOnly
                    value={data.dateRequested}
                    className={`h-[40px] font-bold text-lg border-0 `}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Status
                    </label>
                  }
                  name="status"
                >
                  <div className="bg-red-500 text-white w-[50%] font-sans font-medium tracking-wide text-lg rounded-md text-center py-2">
                    {data.status}
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item name="HIDDEN1">
                  <Input hidden className={`h-[40px] }`} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Requesting Office
                    </label>
                  }
                  name="reqOffice"
                >
                  <Input
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Division
                    </label>
                  }
                  name="division"
                >
                  <Input
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Mode of Request
                    </label>
                  }
                  name="modeOfRequest"
                >
                  <Input readOnly={!isWalkIn} className={`h-[40px]`} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Nature of Request
                    </label>
                  }
                  name="natureOfRequest"
                >
                  <Input
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">Unit</label>
                  }
                  name="unit"
                >
                  <Input
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Serial No
                    </label>
                  }
                  name="serialNo"
                >
                  <Input
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Property No
                    </label>
                  }
                  name="propertyNo"
                >
                  <Input
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mt-2">
                      Year Procured
                    </label>
                  }
                  name="yearProcured"
                >
                  <Input
                    readOnly={!isWalkIn}
                    value={data.yearProcured}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={24}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Special Instructions
                    </label>
                  }
                  name="specialIns"
                >
                  <TextArea
                    rows={5}
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Requested By
                    </label>
                  }
                  name="fullName"
                >
                  <Input
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold mb-2">
                      Authorized By
                    </label>
                  }
                  name="authorizedBy"
                >
                  <Input
                    readOnly={!isWalkIn}
                    className={`h-[40px] ${isWalkIn ? "border-red-500" : ""}`}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item>
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item>
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
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
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
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
  refreshData: PropTypes.func.isRequired,
};
