import Modal from "antd/es/modal/Modal";
import PropTypes from "prop-types";
import { Button, Col, Form, Row, Upload, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

const UpdateSignature = ({
  onOpen,
  onCancel,
  modalMode,
  handlePasswordCheck,
  userPasswordChecker,
  setUserPasswordChecker,
  fullName,
  refreshSignature,
}) => {
  const [fileName, setFileName] = useState("");
  const [form] = Form.useForm();
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: `${fileName}`,
      status: "done",
      url: fileName,
    },
  ]);

  const handleSubmit = async () => {
    setIsSavingChanges(true);
    if (fileList.length === 0) {
      message.error("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("signatureImage", fileList[0].originFileObj);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/update-signature/${fullName}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success(response.data.message);
      refreshSignature();
      onCancel();
      setIsSavingChanges(false);
    } catch (error) {
      message.error("Errror");
      console.log(error);
      setIsSavingChanges(false);
    }
  };
  useEffect(() => {
    fetchFileName();
  }, []);

  const fetchFileName = async () => {
    try {
      const fileNameRes = await axios.get(
        `http://127.0.0.1:8000/api/get-signatureFileName/`,
        {
          params: {
            fullName: fullName,
          },
        }
      );
      setFileName(fileNameRes.data);
      setFileList([
        {
          uid: "-1",
          name: fileNameRes.data,
          status: "done",
          url: fileNameRes.data,
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-1);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };
  const props = {
    action: `http://127.0.0.1:8000/api/update-signature/${fullName}`,
    onChange: handleChange,
    multiple: false,
  };

  return (
    <Modal
      title={modalMode === "password" ? "Enter Password" : "Update Signature"}
      open={onOpen}
      onCancel={onCancel}
      footer={null}
    >
      {modalMode === "password" ? (
        // Password input
        <div className="font-sans">
          <label
            className="font-semibold text-lg"
            htmlFor="userPasswordChecker"
          >
            Password:
          </label>
          <input
            type="password"
            name="userPasswordChecker"
            id="userPasswordChecker"
            value={userPasswordChecker}
            onChange={(e) => setUserPasswordChecker(e.target.value)}
            className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none"
          />
          <Button
            loading={isSavingChanges}
            type="primary"
            htmlType="submit"
            className="bg-main pt-5 w-32  pb-6 px-8 text-lg font-semibold mt-4 flex items-center justify-center"
            onClick={handlePasswordCheck}
          >
            {isSavingChanges ? "Checking" : "Check"}
          </Button>
        </div>
      ) : (
        // Contact number input
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={24}>
              <Form.Item
                label={
                  <label className="block text-sm font-bold">Signature:</label>
                }
                name="signatureImage"
                valuePropName="filelist"
              >
                <Upload
                  {...props}
                  fileList={fileList}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Button
              loading={isSavingChanges}
              type="primary"
              htmlType="submit"
              className="bg-main pt-5 w-40 rounded-lg h-14  pb-6 px-8 text-lg font-semibold mt-4 flex items-center justify-center"
            >
              {isSavingChanges ? "Saving Changes" : "Save Changes"}
            </Button>
          </Row>
        </Form>
      )}
    </Modal>
  );
};

UpdateSignature.propTypes = {
  onOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  modalMode: PropTypes.string.isRequired,
  handlePasswordCheck: PropTypes.func.isRequired,
  userPasswordChecker: PropTypes.string.isRequired,
  setUserPasswordChecker: PropTypes.func.isRequired,
  fullName: PropTypes.string.isRequired,
  refreshSignature: PropTypes.func.isRequired,
};

export default UpdateSignature;
