/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Button, Modal, Form, Input, Row, Col, Select } from "antd";
import { message } from "antd";
import { useAuth } from "../AuthContext";

const ServiceReleaseModal = ({
  isOpen,
  onClose,
  data,
  refreshData,
  isLargeScreen,
}) => {
  if (!isOpen) return null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { Option } = Select;
  const { fullName } = useAuth();

  const [findingsValue, setFindingsValue] = useState("");
  console.log(findingsValue);

  const handleChangeFindings = (value) => {
    setFindingsValue(value);
  };

  const [actionTakenValue, setActionTakenValue] = useState("");
  console.log(actionTakenValue);

  const handleChangeActionTaken = (value) => {
    setActionTakenValue(value);
  };

  const [rootCauseValue, setRootCauseValue] = useState("");
  const handleChangeRootCause = (e) => {
    const rootCauseText = e.target.value;
    setRootCauseValue(rootCauseText);
  };

  const [remarksValue, setRemarksValue] = useState("");
  const handleChangeRemarks = (e) => {
    const remarksText = e.target.value;
    setRemarksValue(remarksText);
  };

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  console.log(data.id);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const values = await form.validateFields();
    const modifiedValues = {
      ...values,
      findings: findingsValue,
      actionTaken: actionTakenValue,
      rootCause: rootCauseValue,
      remarks: remarksValue,
    };

    setFindingsValue(values.findings);
    setActionTakenValue(values.actionTaken);

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/torelease-request/${data.request_id}/${fullName}`,
        modifiedValues
      );

      if (response.status === 200) {
        setIsSubmitting(false);
        message.success("Updated Successfully");
        onClose();
        refreshData();
        console.log(modifiedValues);
      } else {
        setIsSubmitting(false);
        console.error("Received an unexpected response:", response);
        console.log(modifiedValues);
      }
    } catch (error) {
      if (error.response) {
        setIsSubmitting(false);
        console.error("Request failed with status:", error.response.status);
        console.log("Response error data:", error.response.data);
        setError("An error occurred while processing the request.");
        console.log(modifiedValues);
      } else {
        setIsSubmitting(false);
        console.error("Error updating ReceiveService:", error);
        setError("An error occurred. Please try again later.");
        console.log(modifiedValues);
      }
      console.log(modifiedValues);
    }
  };

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
          <span>REQUEST ID: {data.request_code}</span>
        </div>
      }
      centered
      footer={null}
      closable={false}
    >
      <div className="relative p-6 text-lg">
        {data && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2 text-black">
                Requesting Office
              </label>
              <Input value={data.reqOffice} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">Division</label>
              <Input value={data.division} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Date Request
              </label>
              <Input value={data.dateRequested} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Mode Request
              </label>
              <Input value={data.modeOfRequest} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Nature of Request
              </label>
              <Input
                value={data.natureOfRequest}
                readOnly
                className="h-[40px]"
              />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Requested By
              </label>
              <Input value={data.fullName} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Authorized By
              </label>
              <Input value={data.authorizedBy} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={24}>
              <label className="block text-sm font-bold mb-2">
                Special Instructions
              </label>
              <TextArea
                rows={4}
                value={data.specialIns}
                readOnly
                className="h-[40px]"
              />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">Unit</label>
              <Input value={data.unit} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">
                Property No
              </label>
              <Input value={data.propertyNo} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2">Serial No</label>
              <Input value={data.serialNo} readOnly className="h-[40px]" />
            </Col>

            {/* Add more columns as needed */}
          </Row>
        )}
      </div>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          request_id: data.request_id,
          receivedBy: data.receivedBy,
          dateReceived: data.dateReceived,
          dateProcured: data.dateProcured,
          assignedTo: data.assignedTo,
          serviceBy: data.serviceBy,
          dateServiced: data.dateServiced,
          toRecommend: "",
          findings: findingsValue,
          rootCause: rootCauseValue,
          actionTaken: actionTakenValue,
          remarks: remarksValue,
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
                    <label className="block text-sm font-bold">
                      Received By
                    </label>
                  }
                  name="receivedBy"
                >
                  <Input
                    readOnly
                    value={data.receivedBy}
                    className="h-[40px]"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Date Received
                    </label>
                  }
                  name="dateReceived"
                >
                  <Input
                    readOnly
                    value={data.dateReceived}
                    className="h-[40px]"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Assigned To
                    </label>
                  }
                  name="assignedTo"
                >
                  <Input
                    readOnly
                    value={data.assignedTo}
                    className="h-[40px]"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Date Procured
                    </label>
                  }
                  name="dateProcured"
                >
                  <Input
                    readOnly
                    value={data.dateProcured}
                    className="h-[40px]"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Serviced By
                    </label>
                  }
                  name="serviceBy"
                >
                  <Input readOnly value={data.serviceBy} className="h-[40px]" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Date Serviced
                    </label>
                  }
                  name="dateServiced"
                >
                  <Input
                    readOnly
                    value={data.dateServiced}
                    className="h-[40px]"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item>
                  <Input readOnly className="h-[40px]" hidden />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item>
                  <Input readOnly className="h-[40px]" hidden />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Findings Particulars
                    </label>
                  }
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    showSearch
                    style={{
                      width: isLargeScreen ? "" : "50%",
                    }}
                    className="h-[40px]"
                    filterOption={customFilterOption}
                    onChange={handleChangeFindings}
                    value={findingsValue} // Set the value of the Select component
                  >
                    {utility.map((option, index) => (
                      <Option key={index} value={option.utilityCategory}>
                        {option.utilityCategory}
                      </Option>
                    ))}
                  </Select>
                  <TextArea
                    rows={4}
                    onChange={handleChangeRootCause}
                    className="h-[40px] mt-2"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Action Taken
                    </label>
                  }
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    showSearch
                    style={{
                      width: isLargeScreen ? "" : "50%",
                    }}
                    className="h-[40px]"
                    filterOption={customFilterOption}
                    onChange={handleChangeActionTaken}
                    value={actionTakenValue} // Set the value of the Select component
                  >
                    {utility.map((option, index) => (
                      <Option key={index} value={option.utilityCategory}>
                        {option.utilityCategory}
                      </Option>
                    ))}
                  </Select>
                  <TextArea
                    rows={4}
                    value={remarksValue}
                    onChange={handleChangeRemarks}
                    className="h-[40px] mt-2"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={24}>
                <Form.Item
                  label={
                    <label className="block text-sm font-bold">
                      Recommendation
                    </label>
                  }
                  rules={[
                    {
                      required: true,
                      message: "This field is required",
                    },
                  ]}
                  name="toRecommend"
                >
                  <TextArea rows={3} className="h-[40px]" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="request_id">
                  <Input readOnly hidden className="h-[40px]" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </div>
        <div className="flex ml-auto w-full  gap-2 justify-end border-t-2 pt-5 pr-6">
          <button
            className="bg-red-700 text-white font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
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
      </Form>
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
  isLargeScreen: PropTypes.bool.isRequired,
};
