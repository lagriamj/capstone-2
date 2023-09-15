import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faSadTear,
  faFrown,
  faMeh,
  faSmile,
  faGrinStars,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "antd";
import PropTypes from "prop-types";

const RateModal = ({
  isOpen,
  onClose,
  id,
  user_id,
  office,
  isLargeScreen,
  isScreenWidth1366,
}) => {
  const [loading, setLoading] = useState(false);

  console.log("reqid", id);
  console.log("userid", user_id);

  if (!isOpen) return null;

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const daytime = new Date().toLocaleString(undefined, options);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedRatings, setSelectedRatings] = useState({
    user_id: user_id,
    request_id: id,
    department: office,
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    commendation: "",
    suggestion: "",
    request: "",
    complaint: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRatings({
      ...selectedRatings,
      [name]: value,
    });
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/transanction-rate",
        selectedRatings
      );
      const data = response.data;
      console.log(data);
      window.location.href = "/transactions";
    } catch (err) {
      if (err.response && err.response.status === 422) {
        // The server returned validation errors
        const validationErrors = err.response.data.errors;
        console.log("Validation Errors:", validationErrors);

        // Display validation errors to the user
        // You can update your UI to show these errors to the user
      } else {
        // Handle other types of errors
        console.error("Axios Error:", err);
      }

      setLoading(false);
    }
  };

  const handleRatingClick = (value, questionNumber) => {
    setSelectedRatings({
      ...selectedRatings,
      [`q${questionNumber}`]: value,
    });
  };

  const renderRatingIcon = (value, questionNumber) => {
    const isActive = value === selectedRatings[`q${questionNumber}`];
    let icon = null;
    let color = "text-gray-400"; // Default gray color

    switch (value) {
      case 1:
        icon = faSadTear;
        color = isActive ? "text-red-600" : "text-gray-400";
        break;
      case 2:
        icon = faFrown;
        color = isActive ? "text-orange-600" : "text-gray-400";
        break;
      case 3:
        icon = faMeh;
        color = isActive ? "text-yellow-500" : "text-gray-400";
        break;
      case 4:
        icon = faSmile;
        color = isActive ? "text-green-500" : "text-gray-400";
        break;
      case 5:
        icon = faGrinStars;
        color = isActive ? "text-green-600" : "text-gray-400";
        break;
      default:
        break;
    }

    const iconProps = {
      className: `text-3xl cursor-pointer ${color}`,
      onClick: () => handleRatingClick(value, questionNumber),
    };

    return <FontAwesomeIcon icon={icon} {...iconProps} />;
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={
        <div className="flex">
          <div className="flex-auto">
            <label htmlFor="dateRate">Date Rate:</label>
            <input
              className="ml-2"
              id="dateRate"
              name="dateRate"
              type="text"
              value={daytime}
              readOnly
            />
          </div>
          <div className="ml-2">
            {" "}
            {/* Add margin to create space between the two sections */}
            <label htmlFor="dateRate">Office/Department:</label>
            <input
              className="ml-2"
              id="department"
              name="department"
              type="text"
              value={office}
              readOnly
            />
          </div>
        </div>
      }
      width={isLargeScreen ? "50%" : "80%"}
      footer={null}
      centered
    >
      <form onSubmit={onSubmitChange}>
        <div
          className={`relative p-6 flex-auto grid grid-rows-4 ${
            isScreenWidth1366 ? "text-sm" : "text-lg"
          } grid-cols-5 lg:grid-rows-2 lg:grid-cols-4 gap-4`}
        >
          <div className="col-span-5 lg:col-span-2">
            <label htmlFor="q1" className=" font-semibold ">
              1. Timeless Delivery of Service (Kapaspason sa paghatag og
              serbisyo)
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value}>{renderRatingIcon(value, 1)}</div>
              ))}
            </div>
          </div>
          <div className="col-span-5 lg:col-span-2">
            <label htmlFor="name" className=" font-semibold">
              2. Quality of Service (Kalidad serbisyo)
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value}>{renderRatingIcon(value, 2)}</div>
              ))}
            </div>
          </div>
          <div className="col-span-5 lg:col-span-2">
            <label htmlFor="name" className=" font-semibold">
              3. Access and Facilities (Paagi ug pag-gamit sa pasilidad)
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value}>{renderRatingIcon(value, 3)}</div>
              ))}
            </div>
          </div>
          <div className="col-span-5 lg:col-span-2">
            <label htmlFor="name" className=" font-semibold">
              4. Communication (Kahanas sa pag abi-abi)
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value}>{renderRatingIcon(value, 4)}</div>
              ))}
            </div>
          </div>
          <div className="col-span-5 lg:col-span-2">
            <label htmlFor="name" className=" font-semibold">
              5. Employee Attitude towards Client (Saktong pamatasan sa
              empleyado)
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value}>{renderRatingIcon(value, 5)}</div>
              ))}
            </div>
          </div>
          <div className="col-span-5 lg:col-span-2">
            <label htmlFor="name" className=" font-semibold">
              6. Integrity (Pagkamatarongon sinsero sa empleyado)
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value}>{renderRatingIcon(value, 6)}</div>
              ))}
            </div>
          </div>
          <div className="col-span-5 lg:col-span-2">
            <label htmlFor="name" className=" font-semibold">
              7. Transaction Costs (Kantidad sa serbisyo)
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value}>{renderRatingIcon(value, 7)}</div>
              ))}
            </div>
          </div>
          <div className="col-span-5 lg:col-span-2">
            <label htmlFor="name" className=" font-semibold">
              8. Overall Experience/Satisfaction (Kinatibuk-ang kasinatian)
            </label>
            <div className="flex items-center justify-center space-x-4 mt-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value}>{renderRatingIcon(value, 8)}</div>
              ))}
            </div>
          </div>
          <div className="col-span-5 ">
            <label className="font-semibold">Commendation</label>
            <input
              className="ml-2 bg-gray-300 w-full h-10 rounded-md outline-none p-2 text-base"
              id="commendation"
              name="commendation"
              type="text"
              value={selectedRatings.commendation}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-5">
            <label className=" font-semibold">Suggestion</label>
            <input
              className="ml-2 bg-gray-300 w-full h-10 rounded-md outline-none p-2 text-base"
              id="suggestion"
              name="suggestion"
              type="text"
              value={selectedRatings.suggestion}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-5">
            <label className=" font-semibold">Request</label>
            <input
              className="ml-2 bg-gray-300 w-full h-10 rounded-md outline-none p-2 text-base"
              id="request"
              name="request"
              type="text"
              value={selectedRatings.request}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-5">
            <label className=" font-semibold">Complaint</label>
            <input
              className="ml-2 bg-gray-300 w-full h-10 rounded-md outline-none p-2 text-base"
              id="complaint"
              name="complaint"
              type="text"
              value={selectedRatings.complaint}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
          <button
            className={` font-sans text-white bg-red-700 ${
              isScreenWidth1366 ? "text-sm py-3" : "text-sm py-2"
            }  rounded-lg  background-transparent font-bold px-6  outline-none focus:outline-none mr-1  ease-linear transition-all duration-150`}
            type="button"
            onClick={onClose}
          >
            Close
          </button>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className={`bg-gray-800  ${
              isScreenWidth1366 ? "text-sm py-6" : "text-base py-7"
            }  font-semibold flex items-center justify-center text-white  font-sans w-28  rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out `}
          >
            {loading ? "Submitting" : "Submit"}
          </Button>
        </div>
        {/* End of Footer */}
      </form>
    </Modal>
  );
};

RateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  user_id: PropTypes.number.isRequired,
  isLargeScreen: PropTypes.bool,
  office: PropTypes.string.isRequired,
  isScreenWidth1366: PropTypes.bool.isRequired,
};

export default RateModal;
