import PropTypes from "prop-types";
import { Button, Modal, Form, Input, Row, Col } from "antd";
import axios from "axios";
import { message } from "antd";

const ViewToApproveModal = ({
  isOpen,
  onClose,
  data,
  refreshData,
  fromApprovedList,
}) => {
  if (!isOpen) return null;

  const { TextArea } = Input;

  const handleApprove = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/approve-request/${data.id}`
      );
      // Update data after approval (you might need to refresh the data from the parent component)
      refreshData();
      message.success("Request successfully approved");
      onClose();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const daytime = new Date().toLocaleString(undefined, options);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width="75%"
      title={
        <div className="flex justify-between items-center">
          <span>CITC TECHNICAL SERVICE REQUEST SLIP</span>
          <span>REQUEST ID: {data?.request_code}</span>
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
                Year Procured
              </label>
              <Input
                value={data?.yearProcured}
                readOnly
                className="h-[40px] "
              />
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
        initialValues={{
          request_id: data?.requestid,
          dateProcured: data?.dateProcured,
          dateReceived: daytime,
        }}
        layout="vertical"
      >
        <div className="relative p-6  text-lg">
          {/* ADMIN SIDE */}
          {data && <Row gutter={[16, 16]}></Row>}{" "}
          <div className="flex ml-auto w-full h-10 gap-2 justify-end border-t-2 pt-5 pr-6">
            <Button
              className="bg-red-700 text-white h-12 font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
              htmlType="submit"
              onClick={onClose}
            >
              Close
            </Button>
            {!fromApprovedList && (
              <Button
                className="bg-green-700 text-white h-12 font-semibold text-base font-sans w-32 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
                htmlType="button"
                onClick={handleApprove}
              >
                Approve
              </Button>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ViewToApproveModal;

ViewToApproveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  refreshData: PropTypes.func,
  fromApprovedList: PropTypes.bool,
};
