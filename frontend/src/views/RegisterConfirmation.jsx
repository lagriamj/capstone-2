import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";

const RegisterConfirmation = () => {
  const InputBox = ({
    value,
    type,
    id,
    name,
    placeholder,
    onChange,
    labelText,
    htmlFor,
    icon,
    iconColor,
    min,
    max,
  }) => {
    return (
      <div className="flex items-start justify-center text-lg flex-col w-3/4">
        <label className="font-semibold" htmlFor={htmlFor}>
          {labelText}
        </label>
        <div className="relative w-full">
          <input
            type={type}
            id={id}
            name={name}
            min={min}
            max={max}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
          />
          <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
            <svg
              className="w-6 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <FontAwesomeIcon icon={icon} style={{ color: iconColor }} />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const [otpCode, setOtpCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  console.log(location.state);
  const { user, contactNumber: contactNumberFromLogin } = location.state;
  console.log(user.userID);

  // In case the user is coming from the registration page, use the contactNumber from the state
  const contactNumberFromRegistration = user ? user.userContactNumber : "";
  const [contactNumber, setContactNumber] = useState(
    contactNumberFromLogin || contactNumberFromRegistration
  );

 
  useEffect(() => {
    setContactNumber(contactNumberFromLogin || contactNumberFromRegistration);
  }, [contactNumberFromLogin, contactNumberFromRegistration]);

  const confirmOTP = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/verify-otp`,
        { action: "confirm", otpCode, userId: user.userID }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        setLoading(false);
        setVerificationMessage(response.data.message);
        setMessageColor("text-green-700");
        // Handle successful OTP confirmation here
      } else {
        console.error(response.data.error);
        // Handle specific OTP error here
        setLoading(false);
        setVerificationMessage(response.data.message);
        setMessageColor("text-red-700");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the error response has a specific message, use it
        setVerificationMessage(error.response.data.message);
        // Handle other errors here
      } else {
        setVerificationMessage("An error occurred.");
      }
    }
  };

  const resendOTP = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/verify-otp`,
        { action: "resend", otpCode, userId: user.userID } // Use userID instead of id
      );

      console.log(response);

      if (response.status === 200) {
        console.log(response.data.message);
        setVerificationMessage(response.data.message);
        setMessageColor("text-green-700");
        // Handle successful OTP confirmation here
        setRemainingTime(60);
        setIsResending(true);

        const countdownInterval = setInterval(() => {
          setRemainingTime((prevTime) => prevTime - 1); // Decrement remaining time
        }, 1000);

        setTimeout(() => {
          clearInterval(countdownInterval); // Stop countdown interval after 60 seconds
          setIsResending(false); // Enable the button
          setRemainingTime(0);
        }, 60000); // 60 sec
      } else {
        console.error(response.data.error);
        // Handle specific OTP error here
        setVerificationMessage(response.data.message);
        setMessageColor("text-red-700");
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // If the error response has a specific message, use it
        setVerificationMessage(error.response.data.message);
        // Handle other errors here
      } else {
        setVerificationMessage("An error occurred.");
      }
    }
  };

  return (
    <div className="bg-transparent">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <HashLoader color="#ffffff" size={80} />
        </div>
      )}
      <div className="flex">
        {/* Left side */}
        <div className="lg:w-1/2 h-screen box-border bg-main hidden lg:flex md:w-1/6 justify-center items-start lg:pt-16">
          <div className=" w-full flex flex-col items-center text-center  gap-3">
            <div className="flex mb-32 gap-4">
              <img className="w-28 h-28" src="/cityhalllogo.png" alt="" />
              <img className="w-28 h-28" src="/citclogo.png" alt="" />
            </div>
            <div>
              <img src="/davaologo.png" alt="" />
              <p className="text-4xl lg:tracking-mostWidest text-white font-bold">
                LIFE IS HERE
              </p>
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="w-full lg:w-1/2 h-screen relative lg:absolute lg:right-0 z-10 overflow-auto  flex flex-col items-center justify-center">
          <a
            href="/register"
            className="bg-main text-white text-xl absolute right-10 top-10 py-3 px-6 rounded-lg  flex gap-2 items-center"
          >
            <FontAwesomeIcon
              className="w-8 h-6"
              icon={faArrowLeft}
              style={{ color: "#ffffff" }}
              fade
            />
          </a>
          <div className="bg-white w-[80%] shadow-xl h-auto flex flex-col items-center justify-center text-5xl rounded-xl pb-16 lg:pt-16 px-4 gap-y-6">
            <div className="lg:hidden flex ml-10 my-8 gap-4 w-full justify-center">
              <img className="w-28 h-28" src="/cityhalllogo.png" alt="" />
              <img className="w-28 h-28" src="/citc1.png" alt="" />
            </div>
            <h1 className="font-semibold text-center">Verification Code</h1>
            <p className="text-lg font-semibold text-center">
              Please enter the Verification code that was sent to your
              {` ${contactNumber} `} in order to activate your account
            </p>
            <img src="/confrm1.svg" alt="" className="h-64" />
            {verificationMessage && (
              <p className={`text-lg ${messageColor}`}>{verificationMessage}</p>
            )}
            <InputBox
              type={"number"}
              id={"otpCode"}
              placeholder={"OTP CODE"}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              icon={faKey}
            />
            <div className="flex flex-col gap-y-2 w-full items-center justify-center">
              <button
                onClick={confirmOTP}
                className="text-xl text-white font-semibold bg-main w-[75%]  py-4 rounded-lg"
              >
                Confirm Code
              </button>
              <button
                onClick={resendOTP}
                disabled={isResending}
                className="text-xl text-main font-semibold bg-gray-200 w-[75%]  py-4 rounded-lg"
              >
                {isResending ? `Resending in ${remainingTime}s` : "Resend Code"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirmation;
