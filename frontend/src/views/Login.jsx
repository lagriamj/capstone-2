import "../index.css";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import HashLoader from "react-spinners/HashLoader";
import { useAuth } from "../AuthContext";
import { message } from "antd";
import { Snackbar } from "@mui/material";

function Login() {
  const [role, setRole] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [userGovernmentID, setUserGovernmentID] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userRole, isAuthenticated, userID, login } = useAuth();
  const location = useLocation();
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);

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


  useEffect(() => {
    const locationState = location.state;

    if (locationState && locationState.successMessage) {
      setDisplaySuccessMessage(true);
      navigate("/login"); // Clear the location state from the URL
    }
  }, []);

  useEffect(() => {
    if (displaySuccessMessage) {
      // Display the success message using Ant Design message component
      const successMessage = message.success(
        "Registered successfully. You can now log in."
      );

      // Close the message after a certain duration
      setTimeout(() => {
        successMessage(); // Close the message
      }, 5000); // Duration of 5 seconds
    }
  }, [displaySuccessMessage]);

  const credentials = {
    userGovernmentID: userGovernmentID,
    userPassword: userPassword,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        credentials
      );
      const data = response.data;
      console.log(data);

      if (response.status === 200) {
        console.log(data.userID);
        login(data.role, data.userID, data.userStatus);
        //setUserID(data.userID);
        setRole(data.role);
        setUserStatus(data.userStatus);

        if (data.userStatus === "verified") {
          if (data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/request");
          }
        } else if (data.userStatus === "unverified") {
          navigate("/verify-otp", {
            state: { user: data, contactNumber: data.contactNumber },
          });
        }
      } else {
        setError(data.message);
        console.log("Error logging in: " + error);
      }
    } catch (error) {
      setError("Invalid Government ID or Password");
      console.log("Error logging in: " + error);
    } finally {
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
        {/* Left side */}
        <div className="lg:w-1/2 h-screen box-border bg-main hidden lg:flex md:w-1/6 justify-center items-start lg:pt-16">
          <div className=" w-full flex flex-col items-center text-center gap-3">
            <div className="flex mb-32 gap-4">
              <img className="w-28 h-28" src="/cityhalllogo.png" alt="" />
              <img className="w-28 h-28" src="/citclogo.png" alt="" />
            </div>
            <div className="w-[70%]">
              <img src="/davaologo.png" alt="" />
              <p className="text-4xl w-full \  lg:tracking-mostWidest text-white font-bold">
                LIFE IS HERE
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="lg:w-1/2 w-full h-screen bg-gray-200 flex items-center justify-center font-sans">
          <div className="flex flex-col bg-white w-[70%] h-auto pb-10 rounded-2xl shadow-xl text-4xl">
            <div className="w-full  flex flex-col gap-4">
              <div className="lg:hidden flex my-5 gap-4 items-center justify-center">
                <img className="w-20 h-20" src="/cityhalllogo.png" alt="" />
                <img className="w-20 h-20" src="/citc1.png" alt="" />
              </div>
              <div className="lg:pl-10 lg:mt-10">
                <h1 className="lg:text-6xl font-semibold text-center lg:text-start">
                  Welcome
                </h1>
                <p className="text-center lg:text-start text-2xl">
                  Login to your account
                </p>
              </div>
              <form
                action=""
                onSubmit={handleSubmit}
                className="w-full lg:mt-10 mt-5 flex flex-col items-center justify-center gap-y-5"
              >
                {error && <div className="text-red-700 text-lg">{error}</div>}
                <div className="flex items-start justify-center flex-col w-3/4">
                  <label
                    className="flex font-semibold text-lg"
                    htmlFor="userGovernmentID"
                  >
                    Government ID
                  </label>
                  <div className="relative w-full">
                    <input
                      className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
                      type="text"
                      name="userGovernmentID"
                      id="userGovernmentID"
                      placeholder="Government ID"
                      value={userGovernmentID}
                      onChange={(e) => setUserGovernmentID(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        {/* Replace with your icon component */}
                        <FontAwesomeIcon icon={faIdCard} />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-center flex-col w-3/4">
                  <label
                    className="flex font-semibold text-lg"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative w-full">
                    <input
                      className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        {/* Replace with your icon component */}
                        <FontAwesomeIcon icon={faLock} />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-center flex-col w-3/4">
                  <a
                    className="flex self-end justify-center underline text-lg text-main"
                    href="/register"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="flex items-start justify-center flex-col w-3/4">
                  <button
                    className="w-full h-14 text-lg font-medium border-2 rounded-lg pl-2 bg-main text-white"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
                <div className="flex items-center justify-center flex-col w-3/4">
                  <p className="font-medium text-lg">
                    Don't have an account?{" "}
                    <a href="/register" className="text-red-600 font-semibold">
                      Register here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
