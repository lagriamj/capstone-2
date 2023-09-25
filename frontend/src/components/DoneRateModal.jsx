/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { Skeleton } from "antd";
import { message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSadTear,
  faFrown,
  faMeh,
  faSmile,
  faGrinStars,
} from "@fortawesome/free-solid-svg-icons";

const DoneRateModal = ({ isOpen, onClose, id }) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  console.log(id);

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`http://127.0.0.1:8000/api/view-rate/${id}`)
        .then((response) => {
          setData(response.data.results);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching rating details:", error);
          setLoading(false);
          message.error("Failed to fetch rating details. Please try again.");
        });
    }
  }, [isOpen, id]);

  const renderRatingIcon = (value) => {
    const ratingValue = parseInt(value, 10);
    const ratingIcons = [faSadTear, faFrown, faMeh, faSmile, faGrinStars];

    return ratingIcons.map((icon, index) => {
      let colorClass = "text-gray-400"; // Default gray color for all icons

      if (ratingValue === index + 1) {
        if (ratingValue === 1) {
          colorClass = "text-red-600";
        } else if (ratingValue === 2) {
          colorClass = "text-orange-600";
        } else if (ratingValue === 3) {
          colorClass = "text-yellow-500";
        } else if (ratingValue === 4) {
          colorClass = "text-green-500";
        } else if (ratingValue === 5) {
          colorClass = "text-green-600";
        }
      }

      return (
        <FontAwesomeIcon
          key={index}
          icon={icon}
          className={`text-3xl cursor-pointer ${colorClass}`}
        />
      );
    });
  };

  const calculateTotalRate = () => {
    if (!data.length) return 0; // Return 0 if there are no rating data

    const totalRating = data.reduce((acc, item) => {
      return (
        acc +
        parseInt(item.q1) +
        parseInt(item.q2) +
        parseInt(item.q3) +
        parseInt(item.q4) +
        parseInt(item.q5) +
        parseInt(item.q6) +
        parseInt(item.q7) +
        parseInt(item.q8)
      );
    }, 0);

    return (totalRating / 40) * 100;
  };
  const totalRate = calculateTotalRate();

  const RatingDetails = () => {
    if (loading) {
      return <Skeleton active />;
    } else if (data.length === 0) {
      return <p>No Records Yet.</p>;
    } else {
      return data.map((item, index) => (
        <div
          className="lg:grid flex flex-col  lg:grid-cols-4 gap-4"
          key={index}
        >
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2 text-black"
              htmlFor={`reqOffice`}
            >
              Request ID: E-{item.request_id || "No data"}
            </label>
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2 text-black"
              htmlFor={`reqOffice`}
            >
              Department: {item.department || "No data"}
            </label>
          </div>
          <div className="col-span-2">
            <label
              className="block text-sm font-bold mb-2 text-black"
              htmlFor={`reqOffice`}
            >
              Date Rate: {item.dateRate || "No data"}
            </label>
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2 text-black"
              htmlFor={`reqOffice`}
            >
              Question 1
            </label>
            {renderRatingIcon(item.q1)}
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-bold mb-2" htmlFor="reqOffice">
              Question 2
            </label>
            {renderRatingIcon(item.q2)}
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Question 3
            </label>
            {renderRatingIcon(item.q3)}
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Question 4
            </label>
            {renderRatingIcon(item.q4)}
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Question 5
            </label>
            {renderRatingIcon(item.q5)}
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Question 6
            </label>
            {renderRatingIcon(item.q6)}
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Question 7
            </label>
            {renderRatingIcon(item.q7)}
          </div>
          <div className="col-span-1">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Question 8
            </label>
            {renderRatingIcon(item.q8)}
          </div>
          <div className="col-span-1 w-full">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Commendation
            </label>
            <TextTruncate
              text={item.commendation || "No data"}
              maxLength={150}
            />
          </div>
          <div className="col-span-1 w-full">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Suggestion
            </label>
            <TextTruncate text={item.suggestion || "No data"} maxLength={150} />
          </div>
          <div className="col-span-1 w-full">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Request
            </label>
            <TextTruncate text={item.request || "No data"} maxLength={150} />
          </div>
          <div className="col-span-1 w-full">
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="dateRequested"
            >
              Complaint
            </label>
            <TextTruncate text={item.complaint || "No data"} maxLength={150} />
          </div>
        </div>
      ));
    }
  };

  function TextTruncate({ text, maxLength }) {
    const [isTruncated, setIsTruncated] = useState(true);

    const toggleTruncate = () => {
      setIsTruncated(!isTruncated);
    };

    return (
      <div>
        {isTruncated ? (
          <div>
            {text.length > maxLength ? (
              <>
                {text.slice(0, maxLength)}
                <span
                  onClick={toggleTruncate}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  ...Show more
                </span>
              </>
            ) : (
              text
            )}
          </div>
        ) : (
          <div>
            {text}
            <span
              onClick={toggleTruncate}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Show less
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width="75%"
      title={
        <div className="flex justify-between items-center">
          <span>Rating Details</span>
        </div>
      }
      centered
      footer={null}
      closable={false}
    >
      <div className="relative p-6 text-lg">{RatingDetails()}</div>
      <div className="relative p-6 text-lg">
        {" "}
        Total Rate: {totalRate.toFixed(2)}%{" "}
      </div>

      <div className="flex ml-auto w-full  gap-2 justify-end border-t-2 pt-5 pr-6">
        <button
          className="bg-gray-800 text-white font-semibold text-base font-sans w-24 p-2 rounded-xl hover:bg-white hover:text-gray-800 hover:border-2 hover:border-gray-800 transition duration-500 ease-in-out"
          type="submit"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

DoneRateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  datas: PropTypes.number,
  id: PropTypes.number,
  text: PropTypes.string,
  maxLength: PropTypes.number,
};

export default DoneRateModal;
