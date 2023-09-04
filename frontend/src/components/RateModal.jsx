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
import { Button } from "antd";
import PropTypes from "prop-types";

const RateModal = ({ isOpen, onClose, id, user_id }) => {
  const backdropClasses = isOpen
    ? "fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
    : "hidden"; // Hidden class when the modal is closed

  const modalClasses = "relative w-auto max-w-3xl mx-auto my-6";
  const [loading, setLoading] = useState(false);

  console.log(id);
  console.log(user_id);

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
    department: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
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
        "http://127.0.0.1:8000/api/service-rating",
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
    <div
      className={
        isOpen
          ? "fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50"
          : "hidden"
      }
    >
      <form onSubmit={onSubmitChange}>
        <div className={backdropClasses}>
          <div className={modalClasses}>
            {/* Content */}
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                <h3 className="text-3xl font-semibold">Rate Transaction</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              {/* Body */}
              <div className="relative p-6 flex-auto grid grid-rows-4 grid-cols-5 gap-4">
                <div className="col-span-5">
                  <label htmlFor="dateDate" className="text-lg font-semibold">
                    Date Rate
                  </label>
                  <input
                    className="ml-2"
                    id="dateDate"
                    name="dateDate"
                    type="text"
                    value={daytime}
                    readOnly
                  />
                </div>
                <div className="col-span-5">
                  <label htmlFor="department" className="text-lg font-semibold">
                    Office/Department
                  </label>
                  <input
                    className="ml-2 bg-gray-300"
                    id="department"
                    name="department"
                    type="text"
                    value={selectedRatings.department}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Add other rating fields here */}
                {/* Example for question 1 */}
                <div className="col-span-5">
                  <label htmlFor="q1" className="text-lg font-semibold">
                    1. Timeless Delivery of Service (Kapaspason sa paghatag og
                    serbisyo)
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value}>{renderRatingIcon(value, 1)}</div>
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <label htmlFor="name" className="text-lg font-semibold">
                    2. Quality of Service (Kalidad serbisyo)
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value}>{renderRatingIcon(value, 2)}</div>
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <label htmlFor="name" className="text-lg font-semibold">
                    3. Access and Facilities (Paagi ug pag-gamit sa pasilidad)
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value}>{renderRatingIcon(value, 3)}</div>
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <label htmlFor="name" className="text-lg font-semibold">
                    4. Communication (Kahanas sa pag abi-abi)
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value}>{renderRatingIcon(value, 4)}</div>
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <label htmlFor="name" className="text-lg font-semibold">
                    5. Employee Attitude towards Client (Saktong pamatasan sa
                    empleyado)
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value}>{renderRatingIcon(value, 5)}</div>
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <label htmlFor="name" className="text-lg font-semibold">
                    6. Integrity (Pagkamatarongon sinsero sa empleyado)
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value}>{renderRatingIcon(value, 6)}</div>
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <label htmlFor="name" className="text-lg font-semibold">
                    7. Transaction Costs (Kantidad sa serbisyo)
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value}>{renderRatingIcon(value, 7)}</div>
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <label htmlFor="name" className="text-lg font-semibold">
                    8. Overall Experience/Satisfaction (Kinatibuk-ang
                    kasinatian)
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value}>{renderRatingIcon(value, 8)}</div>
                    ))}
                  </div>
                </div>
                <div className="col-span-5">
                  <label className="text-lg font-semibold">Commendation</label>
                  <input
                    className="ml-2 bg-gray-300"
                    id="commendation"
                    name="commendation"
                    type="text"
                    value={selectedRatings.commendation}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-5">
                  <label className="text-lg font-semibold">Suggestion</label>
                  <input
                    className="ml-2 bg-gray-300"
                    id="suggestion"
                    name="suggestion"
                    type="text"
                    value={selectedRatings.suggestion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-5">
                  <label className="text-lg font-semibold">Request</label>
                  <input
                    className="ml-2 bg-gray-300"
                    id="request"
                    name="request"
                    type="text"
                    value={selectedRatings.request}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-span-5">
                  <label className="text-lg font-semibold">Complaint</label>
                  <input
                    className="ml-2 bg-gray-300"
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
                  className="text-red-500 hover:text-red-700 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={onClose}
                >
                  Close
                </button>
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="bg-gray-800  py-7  font-semibold flex items-center justify-center text-white text-base font-sans w-28 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out "
                >
                  {loading ? "Submitting" : "Submit"}
                </Button>
              </div>
              {/* End of Footer */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

RateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  user_id: PropTypes.string.isRequired,
};

export default RateModal;
