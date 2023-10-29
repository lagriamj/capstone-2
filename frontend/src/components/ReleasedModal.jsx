/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import { message } from "antd";
import { useAuth } from "../AuthContext";

const ReleasedModal = ({ isOpen, onClose, data, refreshData }) => {
  if (!isOpen) return null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const { fullName } = useAuth();

  const daytime = new Date().toLocaleString(undefined);
  console.log("request_id", data.request_id);

  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  console.log(data.id);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const values = await form.validateFields();

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/torate-request/${data.request_id}/${fullName}`,
        values
      );

      if (response.status === 201) {
        setIsSubmitting(false);
        message.success("Updated Successfully");
        onClose();
        refreshData();
        console.log(values);
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

  console.log(data);

  const [approvedBy, setApprovedBy] = useState("IVAN V. LIZARONDO");
  const [notedBy, setNotedBy] = useState("NEPTHALY C. TALAVERA");

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
                Date Requested
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
          </Row>
        )}
      </div>
      <div className="relative p-6 text-lg">
        {/* ADMIN SIDE */}
        {data && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2 text-black">
                Received By
              </label>
              <Input value={data.receivedBy} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2 text-black">
                Year Procured
              </label>
              <Input value={data.yearProcured} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2 text-black">
                Serviced By
              </label>
              <Input value={data.serviceBy} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2 text-black">
                Date Service
              </label>
              <Input value={data.dateServiced} readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2 text-black">
                ARTA
              </label>
              <Input readOnly value={data.arta} className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <label className="block text-sm font-bold mb-2 text-black">
                ARTA Status
              </label>
              <Input readOnly value={data.artaStatus} className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <Input hidden readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={6}>
              <Input hidden readOnly className="h-[40px]" />
            </Col>
            <Col xs={24} lg={12}>
              <label className="block text-sm font-bold mb-2 text-black">
                Findings/Particulars
              </label>
              <Input value={data.findings} className="lg:w-1/2 w-full mb-2" />
              <TextArea
                rows={4}
                value={data.rootCause}
                readOnly
                className="h-[40px]"
              />
            </Col>
            <Col xs={24} lg={12}>
              <label className="block text-sm font-bold mb-2 text-black">
                Action Taken
              </label>
              <Input
                value={data.actionTaken}
                className="lg:w-1/2 w-full mb-2"
              />
              <TextArea
                rows={4}
                value={data.remarks}
                readOnly
                className="h-[40px]"
              />
            </Col>
            <Col xs={24} lg={24}>
              <label className="block text-sm font-bold mb-2 text-black">
                Recommendation
              </label>
              <TextArea
                rows={3}
                value={data.toRecommend}
                readOnly
                className="h-[40px]"
              />
            </Col>
          </Row>
        )}
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{
            request_id: data.id,
            receivedReq_id: data.id,
            dateApproved: daytime,
            dateReleased: daytime,
            dateNoted: daytime,
            date_Received: daytime,
            approvedBy: approvedBy,
            noteBy: notedBy,
            releasedBy: "",
            received_By: "",
          }}
          layout="vertical"
          className="mt-8"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={6}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">Approved By</label>
                }
                rules={[
                  {
                    required: true,
                    message: "This field is required",
                  },
                ]}
                name="approvedBy"
              >
                <Input
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  className="h-[40px]"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={6}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">
                    Date Approved
                  </label>
                }
                name="dateApproved"
              >
                <Input readOnly value={daytime} className="h-[40px]" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={6}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">Released By</label>
                }
                rules={[
                  {
                    required: true,
                    message: "This field is required",
                  },
                ]}
                name="releasedBy"
              >
                <Input value={data.releasedBy} className="h-[40px]" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={6}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">
                    Date Released
                  </label>
                }
                name="dateReleased"
              >
                <Input readOnly value={daytime} className="h-[40px]" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={6}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">Noted By</label>
                }
                rules={[
                  {
                    required: true,
                    message: "This field is required",
                  },
                ]}
                name="noteBy"
              >
                <Input
                  value={notedBy}
                  onChange={(e) => setNotedBy(e.target.value)}
                  className="h-[40px]"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={6}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">Date Noted</label>
                }
                name="dateNoted"
              >
                <Input readOnly value={daytime} className="h-[40px]" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={6}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">Received By</label>
                }
                rules={[
                  {
                    required: true,
                    message: "This field is required",
                  },
                ]}
                name="received_By"
              >
                <Input value={data.received_By} className="h-[40px]" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={6}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">
                    Date Received
                  </label>
                }
                name="date_Received"
              >
                <Input readOnly value={daytime} className="h-[40px]" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="receivedReq_id">
                <Input readOnly hidden className="h-[40px]" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="request_id">
                <Input readOnly hidden className="h-[40px]" />
              </Form.Item>
            </Col>
          </Row>
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
      </div>
      {/* Footer */}
    </Modal>
  );
};

export default ReleasedModal;

ReleasedModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Ensure that 'visible' is a required boolean prop
  onClose: PropTypes.func.isRequired, // Ensure that 'onClose' is a required function prop
  data: PropTypes.object, // Ensure that 'itemData' is a required object prop
  refreshData: PropTypes.func.isRequired,
};
