/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Form, Input, Modal, message } from "antd";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";

const UpdateTechnicianModal = ({
  isOpen,
  onCancel,
  onUpdate,
  technicianData,
  refreshData,
}) => {
  if (!isOpen) return null;
  const [form] = Form.useForm();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const newFormData = await form.validateFields();
      const response = await axios.put(
        "http://127.0.0.1:8000/api/update-technician",
        newFormData
      );

      if (response.status === 201) {
        onUpdate();
        refreshData();
        setIsUpdating(false);
        message.success("Category Updated successfully");
      }
    } catch (error) {
      console.log(error);
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      title="Update Technician"
      onOk={onUpdate}
      footer={null}
    >
      {/* Content */}
      <Form form={form} initialValues={technicianData}>
        <Form.Item
          name="technician"
          label={
            <label
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                fontFamily: "Poppins",
              }}
            >
              Technician
            </label>
          }
          labelAlign="top"
          labelCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please enter the technician name",
            },
          ]}
          style={{ height: "8vh" }}
        >
          <Input className="h-12 text-base" placeholder="Technician Name" />
        </Form.Item>
        <Form.Item name="id" hidden>
          <Input size="large" />
        </Form.Item>
        <div className="flex justify-end">
          <Button
            variant="outlined"
            onClick={onCancel}
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
            onClick={handleUpdate}
            color="primary"
            style={{ width: "5rem", height: "2.5rem" }}
            loading={isUpdating}
          >
            {isUpdating ? "..." : "Update"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

UpdateTechnicianModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  technicianData: PropTypes.object,
  refreshData: PropTypes.func.isRequired,
};

export default UpdateTechnicianModal;
