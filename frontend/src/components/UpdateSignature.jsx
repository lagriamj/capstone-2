import Modal from "antd/es/modal/Modal";
import PropTypes from "prop-types";
import { Button, Col, Form, Row, Upload, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../AuthContext";

const UpdateSignature = ({
  onOpen,
  onCancel,
  modalMode,
  handlePasswordCheck,
  userPasswordChecker,
  setUserPasswordChecker,
  refreshSignature,
}) => {
  const [fileName, setFileName] = useState("");
  const [form] = Form.useForm();
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const { userID } = useAuth();
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
        `${import.meta.env.VITE_API_BASE_URL}/api/update-signature/${userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      refreshSignature();
      message.success(response.data.message);
      onCancel();
      setIsSavingChanges(false);

      setUserPasswordChecker("");
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
        `${import.meta.env.VITE_API_BASE_URL}/api/get-signatureFileName/`,
        {
          params: {
            userID: userID,
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

  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }

      if (!allowedFileTypes.includes(file.type)) {
        message.warning(
          "Invalid file type. Please select a PNG, JPEG, or JPG file."
        );
        // Remove the file from the fileList to prevent it from being uploaded
        return null;
      }

      return file;
    });

    // Remove any null entries from the fileList
    newFileList = newFileList.filter((file) => file !== null);

    setFileList(newFileList);
  };

  const props = {
    action: `${
      import.meta.env.VITE_API_BASE_URL
    }/api/update-signature/${userID}`,
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
  refreshSignature: PropTypes.func.isRequired,
};

export default UpdateSignature;
