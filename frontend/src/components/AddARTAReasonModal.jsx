import { Modal, Form, Input, Button } from "antd";
import PropTypes from "prop-types";

const { TextArea } = Input;

const AddARTAReasonModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();

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
        <Button key="submit" type="primary" className="bg-main text-white">
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
};

export default AddARTAReasonModal;
