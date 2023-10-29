import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";

const UpdateNatureModal = ({
  isOpen,
  onCancel,
  onUpdate,
  natureData,
  refreshData,
  isScreenWidth1366,
}) => {
  const [form] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const newFormData = await form.validateFields();
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/update-nature`,
        newFormData
      );

      if (response.status === 201) {
        onUpdate();
        refreshData();
        setIsUpdating(false);
        message.success("Nature of Request Updated successfully");
      }
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      title="Update Nature of Request"
      open={isOpen}
      onCancel={onCancel}
      onOk={onUpdate}
      footer={null}
    >
      <Form
        form={form}
        initialValues={natureData}
        className={`${isScreenWidth1366 ? "flex flex-col gap-6" : ""} `}
      >
        <Form.Item
          labelAlign="top"
          labelCol={{ span: 24 }}
          name="natureRequest"
          label={
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Nature of Request
            </label>
          }
          rules={[
            {
              required: true,
              message: "Please enter the Nature of Request name",
            },
          ]}
          style={{ height: "8vh" }}
        >
          <Input
            placeholder="Nature of Request Name"
            className="h-12 text-base"
          />
        </Form.Item>
        <Form.Item name="id" hidden>
          <Input size="large" />
        </Form.Item>
        <div className="flex justify-end">
          <Button
            onClick={onCancel}
            variant="outlined"
            style={{
              marginRight: "1rem",
              width: "5rem",
              height: "2.5rem",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "5rem", height: "2.5rem" }}
            loading={isUpdating}
            htmlType="submit"
            onClick={handleUpdate}
          >
            {isUpdating ? "..." : "Update"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

UpdateNatureModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  natureData: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
  isScreenWidth1366: PropTypes.bool.isRequired,
};

export default UpdateNatureModal;
