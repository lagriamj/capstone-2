import { Modal, Form, Input, Button } from "antd";
import PropTypes from "prop-types";
import axios from "axios";

const { TextArea } = Input;

const AddARTAReasonModal = ({
  visible,
  onCancel,
  data,
  updateReasonDelay,
  refreshData,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const requestData = {
        request_id: data?.request_id,
        reasonDelay: values.ARTAdetails,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/add-arta-reason`,
        requestData
      );

      if (response.status === 200) {
        console.log("API request was successful", response.data);
        updateReasonDelay(requestData.reasonDelay);
        form.resetFields();
        refreshData();
        onCancel();
        refreshData();
      } else {
        console.error("API request failed", response.data);
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }

    onCancel();
  };

  return (
    <Modal
      open={visible}
      title="Add ARTA Details"
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          className="bg-red-700 text-white"
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="bg-main text-white"
          onClick={handleSubmit}
        >
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="ARTAdetails"
          label="Details"
          rules={[{ required: true, message: "Please enter a detail" }]}
        >
          <TextArea
            placeholder="Enter a detail"
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddARTAReasonModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  data: PropTypes.object,
  fullName: PropTypes.string,
  updateReasonDelay: PropTypes.func.isRequired,
  refreshData: PropTypes.any,
};

export default AddARTAReasonModal;
