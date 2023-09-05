/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faUser,
  faIdCard,
  faEnvelope,
  faLock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { useAuth } from "../AuthContext";

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
  minLength,
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
          minLength={minLength}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          required
          className={
            "w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
          }
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

const Register = () => {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userGovernmentID, setUserGovernmentID] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userContactNumber, setUserContactNumber] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { userRole, isAuthenticated } = useAuth();

  useEffect(() => {
    // If the user is already authenticated, redirect them to the appropriate page
    if (isAuthenticated) {
      if (userRole === "admin") {
        navigate("/dashboard");
      } else if (userRole === "user") {
        navigate("/request");
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  if (isAuthenticated) {
    return null; // or return a loading message, or redirect immediately
  }

  const registerUser = async (e) => {
    e.preventDefault();

    const userData = {
      userFirstName: userFirstName,
      userLastName: userLastName,
      userGovernmentID: userGovernmentID,
      userEmail: userEmail,
      userContactNumber: userContactNumber,
      userPassword: userPassword,
    };

    setLoading(true);

    try {
      const response = await axios
        .post("http://127.0.0.1:8000/api/register", userData)
        .then((response) => {
          if (response.status === 201) {
            const registeredUser = response.data;
            console.log(registeredUser);
            setUser(registeredUser);
            setUserId(registeredUser.userID);
            navigate("/verify-otp", {
              state: {
                user: registeredUser,
                contactNumber: registeredUser.userContactNumber,
              },
            });
          } else if (response.status === 422) {
            setErrorMessage("That government ID is not available");
            setLoading(false);
          }
        });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(
          `The government ID ${userGovernmentID} is not available`
        );
      } else {
        setErrorMessage("An error occurred.");
      }
      console.error(error);
      setLoading(false);
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
        {/* Left Column */}
        <div className="lg:w-1/2 h-screen box-border bg-main hidden lg:flex md:w-1/6 justify-center items-start lg:pt-16">
          <div className=" w-full flex flex-col items-center text-center gap-3">
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

        {/* Right Column */}
        <div className="w-full lg:w-1/2 h-auto  bg-gray-200  flex flex-col items-center justify-center overflow-auto">
          <div className="  bg-white lg:w-[70%] w-[90%] py-5 mt-20 mb-20 h-auto rounded-2xl shadow-xl text-4xl">
            <div className="w-full  flex flex-col gap-4">
              <div className="lg:hidden flex my-5 gap-4 items-center justify-center">
                <img className="w-20 h-20" src="/cityhalllogo.png" alt="" />
                <img className="w-20 h-20" src="/citc1.png" alt="" />
              </div>
              <div className="lg:pl-5 lg:mt-5">
                <h1 className="lg:text-6xl font-semibold text-center">
                  Register
                </h1>
              </div>
              {errorMessage && (
                <p className="text-lg text-center text-red-900 font-semibold">
                  {errorMessage}
                </p>
              )}
            </div>
            <form
              action=""
              method="post"
              onSubmit={registerUser}
              className="w-full lg:mt-5 mt-5 flex flex-col items-center justify-center gap-y-5"
            >
              <div className="flex items-start justify-center w-3/4 lg:flex-row flex-col gap-5">
                {/* First Name */}
                <div className="flex flex-col lg:w-1/2 w-full">
                  <label className="font-semibold text-lg" htmlFor="firstName">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
                      type="text"
                      name="userFirstName"
                      id="userFirstNamee"
                      value={userFirstName}
                      placeholder="First Name"
                      required
                      onChange={(e) => setUserFirstName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                      <svg
                        className="w-6 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <FontAwesomeIcon
                          icon={faUser}
                          style={{ color: "#ffffff" }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Last Name */}
                <div className="flex flex-col lg:w-1/2 w-full lg:ml-4">
                  <label className="font-semibold text-lg" htmlFor="lastName">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
                      type="text"
                      name="userLastName"
                      id="userLastName"
                      value={userLastName}
                      placeholder="Last Name"
                      required
                      onChange={(e) => setUserLastName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                      <svg
                        className="w-6 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <FontAwesomeIcon
                          icon={faUser}
                          style={{ color: "#ffffff" }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <InputBox
                type={"text"}
                id={"userGovernmentID"}
                name={"userGovernmentID"}
                placeholder={"Government ID"}
                labelText={"Government ID"}
                htmlFor={"userGovernmentID"}
                icon={faIdCard}
                value={userGovernmentID}
                onChange={(e) => setUserGovernmentID(e.target.value)}
              />
              {/* Confirm email */}
              <InputBox
                type={"email"}
                id={"userEmail"}
                name={"userEmail"}
                placeholder={"Email Address"}
                labelText={"Email"}
                htmlFor={"userEmail"}
                icon={faEnvelope}
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <div className="flex items-start justify-center text-lg flex-col w-3/4">
                <label className="font-semibold" htmlFor={"userContactNumber"}>
                  Contact Number
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="userContactNumber"
                    name="userContactNumber"
                    pattern="[0-9]{11}"
                    required
                    placeholder="Contact Number"
                    onChange={(e) => setUserContactNumber(e.target.value)}
                    value={userContactNumber}
                    className={`w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none
                    }`}
                    onInvalid={(e) => {
                      if (e.target.validity.valueMissing) {
                        e.target.setCustomValidity(
                          "Contact Number is required."
                        );
                      } else if (e.target.validity.patternMismatch) {
                        e.target.setCustomValidity(
                          `Contact Number must be a 11-digit mobile number.`
                        );
                      }
                    }}
                    onInput={(e) => {
                      e.target.setCustomValidity("");
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                    <svg
                      className="w-6 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <FontAwesomeIcon
                        icon={faPhone}
                        style={{ color: "#ffffff" }}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Password */}
              <div className="flex items-start justify-center text-lg flex-col w-3/4">
                <label className="font-semibold" htmlFor={"userPassword"}>
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type="password"
                    id="userPassword"
                    name="userPassword"
                    minLength="6"
                    required
                    placeholder="Password"
                    onChange={(e) => setUserPassword(e.target.value)}
                    value={userPassword}
                    className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
                    onInvalid={(e) => {
                      if (e.target.validity.valueMissing) {
                        e.target.setCustomValidity("Password is required.");
                      } else if (e.target.validity.tooShort) {
                        e.target.setCustomValidity(
                          "Password must be at least 6 characters long."
                        );
                      }
                    }}
                    onInput={(e) => {
                      e.target.setCustomValidity("");
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                    <svg
                      className="w-6 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <FontAwesomeIcon
                        icon={faLock}
                        style={{ color: "#ffffff" }}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}

              <div className="flex items-start justify-center flex-col w-3/4">
                <button
                  className="w-full h-14 text-lg font-medium border-2 rounded-lg pl-2 bg-main text-white"
                  type="submit"
                >
                  Next
                </button>
              </div>
              <div className="flex items-center justify-center flex-col w-3/4">
                <p className="font-medium text-lg">
                  Already have an account?{" "}
                  <a href="/" className="text-red-600 font-semibold">
                    Login here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
