/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Modal, Input, Row, Col } from "antd";
import { Skeleton } from "antd";
import PrintPreviewModal from "./PrintPreviewModal";

const ToRateModal = ({ isOpen, onClose, datas }) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { TextArea } = Input;
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [dataForPrinting, setDataForPrinting] = useState("");
  const [requestID, setRequestID] = useState(null);

  const closePrintModal = () => {
    setPrintModalOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, [datas]); // Trigger fetch when datas prop changes

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/closed-view/${datas.request_id}`
      );
      if (response.status === 200) {
        setLoading(false);
        setData(response.data.results);
        setRequestID(response.data.results.map((item) => item.request_id));
        setDataForPrinting(response.data.results);
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
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} lg={6}>
            <label
              htmlFor="reqOffice"
              className="block text-sm font-bold mb-2 text-black"
            >
              Requesting Office
            </label>
            <Input
              value={item.reqOffice}
              id="reqOffice"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="division"
              className="block text-sm font-bold mb-2 text-black"
            >
              Division
            </label>
            <Input
              value={item.division}
              id="division"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="dateRequested"
              className="block text-sm font-bold mb-2 text-black"
            >
              Date Requested
            </label>
            <Input
              value={item.dateRequested}
              id="dateRequested"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="modeOfRequest"
              className="block text-sm font-bold mb-2 text-black"
            >
              Mode of Request
            </label>
            <Input
              value={item.modeOfRequest}
              id="modeOfRequest"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="natureOfRequest"
              className="block text-sm font-bold mb-2 text-black"
            >
              Nature of Request
            </label>
            <Input
              value={item.natureOfRequest}
              id="natureOfRequest"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="requestedBy"
              className="block text-sm font-bold mb-2 text-black"
            >
              Requested By
            </label>
            <Input
              value={item.fullName}
              id="requestedBy"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="authorizedBy"
              className="block text-sm font-bold mb-2 text-black"
            >
              Authorized By
            </label>
            <Input
              value={item.authorizedBy}
              id="authorizedBy"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={24}>
            <label
              htmlFor="specialIns"
              className="block text-sm font-bold mb-2 text-black"
            >
              Special Instructions
            </label>
            <TextArea
              rows={3}
              value={item.specialIns}
              id="specialIns"
              readOnly
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="unit"
              className="block text-sm font-bold mb-2 text-black"
            >
              Unit
            </label>
            <Input value={item.unit} id="unit" readOnly className="h-[40px] " />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="propertyNo"
              className="block text-sm font-bold mb-2 text-black"
            >
              Property No.
            </label>
            <Input
              value={item.propertyNo}
              id="propertyNo"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="serialNo"
              className="block text-sm font-bold mb-2 text-black"
            >
              SerialNo
            </label>
            <Input
              value={item.serialNo}
              id="serialNo"
              readOnly
              className="h-[40px] "
            />
          </Col>
        </Row>
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
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} lg={6}>
            <label
              htmlFor="receivedBy"
              className="block text-sm font-bold mb-2 text-black"
            >
              Received By
            </label>
            <Input
              value={item.received_By}
              id="receivedBy"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="dateReceived"
              className="block text-sm font-bold mb-2 text-black"
            >
              Date Received
            </label>
            <Input
              value={item.date_Received}
              id="dateReceived"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="asssigendTo"
              className="block text-sm font-bold mb-2 text-black"
            >
              Assigned To
            </label>
            <Input
              value={item.assignedTo}
              id="assigendTo"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="dateProcured"
              className="block text-sm font-bold mb-2 text-black"
            >
              Date Procured
            </label>
            <Input
              value={item.dateProcured}
              id="dateProcured"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="servicedBy"
              className="block text-sm font-bold mb-2 text-black"
            >
              Serviced By
            </label>
            <Input
              value={item.serviceBy}
              id="servicedBy"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="dateServiced"
              className="block text-sm font-bold mb-2 text-black"
            >
              Date Serviced
            </label>
            <Input
              value={item.dateServiced}
              id="dateServiced"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <Input hidden />
          </Col>
          <Col xs={24} lg={12}>
            <label
              htmlFor="rootCause"
              className="block text-sm font-bold mb-2 text-black"
            >
              Findings/Particulars
            </label>
            <Input
              value={item.findings}
              id="findings"
              readOnly
              className="h-[40px] mb-1"
            />
            <TextArea rows={4} id="rootCause" value={item.rootCause} />
          </Col>
          <Col xs={24} lg={12}>
            <label
              htmlFor="remarks"
              className="block text-sm font-bold mb-2 text-black"
            >
              Action Taken
            </label>
            <Input
              value={item.actionTaken}
              id="actionTaken"
              readOnly
              className="h-[40px] mb-1 "
            />
            <TextArea rows={4} id="remarks" value={item.remarks} />
          </Col>
          <Col xs={24} lg={24}>
            <label
              htmlFor="recommendation"
              className="block text-sm font-bold mb-2 text-black"
            >
              Recommendation
            </label>
            <TextArea
              value={item.toRecommend}
              id="recommendation"
              readOnly
              rows={3}
            />
          </Col>
        </Row>
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
        <Row gutter={[16, 16]} key={index}>
          <Col xs={24} lg={6}>
            <label
              htmlFor="approvedBy"
              className="block text-sm font-bold mb-2 text-black"
            >
              Approved By
            </label>
            <Input
              value={item.approvedBy}
              id="approvedBy"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="dateApproved"
              className="block text-sm font-bold mb-2 text-black"
            >
              Date Approved
            </label>
            <Input
              value={item.dateApproved}
              id="dateApproved"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="releasedBy"
              className="block text-sm font-bold mb-2 text-black"
            >
              Released By
            </label>
            <Input
              value={item.releasedBy}
              id="releasedBy"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="dateReleased"
              className="block text-sm font-bold mb-2 text-black"
            >
              Date Released
            </label>
            <Input
              value={item.dateReleased}
              id="dateReleased"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="notedBy"
              className="block text-sm font-bold mb-2 text-black"
            >
              Noted By
            </label>
            <Input
              value={item.noteBy}
              id="notedBy"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="dateNoted"
              className="block text-sm font-bold mb-2 text-black"
            >
              Date Noted
            </label>
            <Input
              value={item.dateNoted}
              id="dateNoted"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="received_By"
              className="block text-sm font-bold mb-2 text-black"
            >
              Received By
            </label>
            <Input
              value={item.received_By}
              id="received_By"
              readOnly
              className="h-[40px] "
            />
          </Col>
          <Col xs={24} lg={6}>
            <label
              htmlFor="dateReceived"
              className="block text-sm font-bold mb-2 text-black"
            >
              Date Received
            </label>
            <Input
              value={item.date_Received}
              id="dateReceived"
              readOnly
              className="h-[40px] "
            />
          </Col>
        </Row>
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
          <span>REQUEST ID: {datas.request_id}</span>
        </div>
      }
      centered
      footer={null}
      closable={false}
    >
      <PrintPreviewModal
        visible={printModalOpen}
        onClose={closePrintModal}
        itemData={dataForPrinting[0]}
        reqID={requestID}
      />
      <div className="relative p-6 text-lg">{RequestDetails()}</div>
      <div className="relative p-6 text-lg">{ReceivedDetails()}</div>
      <div className="relative p-6 text-lg">{ReleasedDetails()}</div>

      <div className="flex ml-auto w-full  gap-2 justify-end border-t-2 pt-5 pr-6">
        <button
          className="bg-gray-800 text-white font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
          type="submit"
          onClick={() => {
            setPrintModalOpen(true);
          }}
        >
          Print
        </button>
        <button
          className="bg-red-800 text-white font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
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

ToRateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  datas: PropTypes.object,
};

export default ToRateModal;
