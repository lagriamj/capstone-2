/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Button, Modal, Form, Input, Row, Col, Select } from "antd";
import { message } from "antd";
import { useAuth } from "../AuthContext";
import ReasonModal from "./ReasonModal";

const ServiceTaskModal = ({ isOpen, onClose, data, refreshData }) => {
  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { TextArea } = Input;
  const [serviceByValue, setServiceByValue] = useState(data.assignedTo);
  const { fullName, userRole } = useAuth();
  const [showReasonModal, setShowReasonModal] = useState(false);

  const handleChangeServiceBy = (value) => {
    setServiceByValue(value);
  };

  const handleCancel = () => {
    setShowReasonModal(true);
  };

  const onCloseModal = () => {
    setShowReasonModal(false);
    onClose();
  };

  const onReloadTable = () => {
    refreshData();
  };

  const handleReasonModalSubmit = () => {
    message.success("Request Cancelled Successfully");
  };

  const [ARTAValue, setARTAValue] = useState(null);

  const handleChangeARTA = (value) => {
    setARTAValue(value);
  };

  const [form] = Form.useForm();

  const currentDate = new Date(); // Create a Date object for the current date and time
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const daytime = currentDate.toLocaleString(undefined, options);

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [dataForm, setDataForm] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const values = await form.validateFields();
    const modifiedValues = {
      ...values,
      serviceBy: serviceByValue,
      arta: ARTAValue,
    };

    setDataForm(values);
    setServiceByValue(values.serviceBy);
    form.resetFields();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/onprogress-request/${
          data.request_id
        }/${fullName}`,
        modifiedValues
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
      message.error("Fill-in all necessary informations");
      if (error.response) {
        setIsSubmitting(false);
        console.log(error.response.data);
        setError("An error occurred while processing the request.");
      } else {
        setIsSubmitting(false);
        console.error("Error updating ReceiveService:", error);
        setError("An error occurred. Please try again later.");
      }
    }
  };
  useEffect(() => {
    fetchTechnicians();
  }, []);

  const [technicians, setTechnicians] = useState([]);

  const fetchTechnicians = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/technician-list`
    );
    setTechnicians(response.data.results);
  };

  const { Option } = Select;

  const customFilterOption = (inputValue, option) =>
    option.value?.toLowerCase().includes(inputValue.toLowerCase());

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={onClose}
        width="75%"
        title={
          <div className="flex justify-between items-center">
            <span>CITC TECHNICAL SERVICE REQUEST SLIP</span>
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
                  Request ID
                </label>
                <Input
                  value={data.request_code}
                  readOnly
                  className="h-[40px] border-0 font-bold text-lg"
                />
              </Col>
              <Col xs={24} lg={6}>
                <label className="block text-sm font-bold mb-2 text-black">
                  Request Date
                </label>
                <Input
                  value={data.dateRequested}
                  readOnly
                  className="h-[40px] border-0 font-bold text-lg"
                />
              </Col>
              <Col xs={24} lg={6}>
                <label className="block text-sm font-bold mb-2 text-black">
                  Status
                </label>
                <div className="bg-orange-500 text-white w-[50%] font-sans font-medium tracking-wide text-lg rounded-md text-center py-2">
                  {data.status}
                </div>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item>
                  <Input readOnly hidden />
                </Form.Item>
              </Col>
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
                  Mode Request
                </label>
                <Input
                  value={data.modeOfRequest}
                  readOnly
                  className="h-[40px]"
                />
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
                <label className="block text-sm font-bold mb-2">Unit</label>
                <Input value={data.unit} readOnly className="h-[40px]" />
              </Col>
              <Col xs={24} lg={6}>
                <label className="block text-sm font-bold mb-2">
                  Serial No
                </label>
                <Input value={data.serialNo} readOnly className="h-[40px]" />
              </Col>
              <Col xs={24} lg={6}>
                <label className="block text-sm font-bold mb-2">
                  Property No
                </label>
                <Input value={data.propertyNo} readOnly className="h-[40px]" />
              </Col>
              <Col xs={24} lg={6}>
                <label className="block text-sm font-bold mb-2">
                  Year Procured
                </label>
                <Input
                  value={data.yearProcured}
                  readOnly
                  className="h-[40px]"
                />
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
                <label className="block text-sm font-bold mb-2">
                  Requested By
                </label>
                <Input value={data.fullName} readOnly className="h-[40px]" />
              </Col>
              <Col xs={24} lg={6}>
                <label className="block text-sm font-bold mb-2">
                  Authorized By
                </label>
                <Input
                  value={data.authorizedBy}
                  readOnly
                  className="h-[40px]"
                />
              </Col>
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
            assignedTo: data.assignedTo,
            yearProcured: data.yearProcured,
            dateServiced: daytime,
            serviceBy: serviceByValue,
            arta: ARTAValue,
            reasonDelay: "n/a",
            toRecommend: "n/a",
            findings: "n/a",
            rootCause: "n/a",
            actionTaken: "n/a",
            remarks: "n/a",
          }}
          layout="vertical"
        >
          <div className="relative p-6 text-lg">
            {/* ADMIN SIDE */}
            {data && (
              <Row gutter={[16, 16]}>
                {" "}
                {/* Responsive row with gutter */}
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
                        Service By
                      </label>
                    }
                    name={["serviceBy", "technician"]}
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
                      className="h-[40px]"
                      filterOption={customFilterOption}
                      onChange={handleChangeServiceBy}
                      value={serviceByValue} // Set the value of the Select component
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
                      <label className="block text-sm font-bold">
                        Processing Day
                      </label>
                    }
                  >
                    <Select
                      size="large"
                      showSearch
                      className="h-[40px]"
                      filterOption={customFilterOption}
                      onChange={handleChangeARTA}
                      value={ARTAValue}
                    >
                      <Option value={"3"}>3</Option>
                      <Option value={"7"}>7</Option>
                      <Option value={"20"}>20</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name="request_id">
                    <Input readOnly hidden className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name="actionTaken">
                    <Input readOnly hidden className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name="findings">
                    <Input readOnly hidden className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name="remarks">
                    <Input readOnly hidden className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name="rootCause">
                    <Input readOnly hidden className="h-[40px]" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name="toRecommend">
                    <Input readOnly hidden className="h-[40px]" />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </div>
          <div className="flex ml-auto w-full  gap-2 justify-end border-t-2 pt-5 pr-6">
            <Button
              className="bg-red-700 text-white h-12 font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
              onClick={handleCancel} // Updated onClick to call handleCancel
            >
              Cancel
            </Button>
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
      {showReasonModal && (
        <ReasonModal
          display={true}
          onClose={onCloseModal}
          onReloadTable={onReloadTable}
          itemData={data}
          isLargeScreen={true}
          refreshData={refreshData}
          role={userRole}
          name={fullName}
          onSubmit={handleReasonModalSubmit}
        />
      )}
    </>
  );
};

export default ServiceTaskModal;

ServiceTaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Ensure that 'visible' is a required boolean prop
  onClose: PropTypes.func.isRequired, // Ensure that 'onClose' is a required function prop
  data: PropTypes.object, // Ensure that 'itemData' is a required object prop
  refreshData: PropTypes.func.isRequired,
};
