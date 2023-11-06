/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
import "../index.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdCard, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Button, message } from "antd";
import { useActiveTab } from "../ActiveTabContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

function Login() {
  const [role, setRole] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [userGovernmentID, setUserGovernmentID] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { userRole, isAuthenticated, login, fullName } = useAuth();
  const location = useLocation();
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);
  const { setActive } = useActiveTab();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If the user is already authenticated, redirect them to the appropriate page
    if (isAuthenticated) {
      if (userRole === "admin") {
        navigate("/dashboard");
        setActive("dashboard");
      } else if (userRole === "user") {
        navigate("/request");
        setActive("request");
      } else if (userRole === "head") {
        navigate("/head/request");
        setActive("request");
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
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        credentials
      );
      const data = response.data;
      const fullName = `${data.firstName} ${data.lastName}`;

      if (response.status === 200) {
        message.success("Welcome " + fullName);
        login(data.role, data.userID, data.userStatus, fullName);
        //setUserID(data.userID);
        setRole(data.role);
        setUserStatus(data.userStatus);
        const token = response.data.access_token;

        if (data.userStatus === "verified") {
          if (data.role === "admin") {
            navigate("/dashboard");
            setActive("dashboard");
          } else if (data.role === "user") {
            navigate("/request");
            setActive("request");
          } else {
            navigate("/approve-requests");
            setActive("approve-requests");
          }
        } else if (data.userStatus === "unverified") {
          navigate("/verify-otp", {
            state: { user: data, userEmail: data.userEmail },
          });
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.log(error);
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="flex">
        {/* Left side */}
        <div className="lg:w-[40%] h-screen box-border bg-main hidden lg:flex md:w-1/6 justify-center items-start ">
          <div className=" w-full  h-[100%] flex flex-col items-center justify-center text-center gap-3">
            <div className="mb-4">
              <p className=" text-white text-xl">
                City Information Technology Center
              </p>
              <h2 className="text-white text-2xl font-semibold tracking-wider">
                eRequest
              </h2>
            </div>
            <div className="flex gap-2">
              <img className="w-28 h-28" src="/cityhalllogo.png" alt="" />
              <img className="w-28 h-28" src="/citclogo.png" alt="" />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="lg:w-[60%] w-full h-screen  flex items-center justify-center font-sans">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col  bg-white lg:w-[70%] w-[90%] h-auto pb-10 rounded-2xl lg:shadow-2xl text-4xl"
            >
              <div className="w-full  flex flex-col gap-4">
                <div className="lg:hidden flex my-5 gap-4 items-center justify-center">
                  <img className="w-20 h-20" src="/cityhalllogo.png" alt="" />
                  <img className="w-20 h-20" src="/citc1.png" alt="" />
                </div>
                <div className="lg:pl-10 lg:mt-10">
                  <h1 className="lg:text-5xl font-semibold text-center lg:text-start">
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
                        className="w-full h-14 border-2 rounded-lg pl-14 pr-14 text-lg border-slate-400 focus:outline-none"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                        <FontAwesomeIcon
                          icon={faLock}
                          style={{ color: "white" }}
                        />
                      </div>
                      <div className="absolute inset-y-0 right-0 flex items-center p-3 rounded-r-lg">
                        {showPassword ? (
                          <EyeOutlined
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ fontSize: "20px", color: "black" }}
                          />
                        ) : (
                          <EyeInvisibleOutlined
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ fontSize: "20px", color: "black" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-center flex-col w-3/4">
                    <a
                      className="flex self-end justify-center underline lg:text-lg md:text-base text-sm text-main cursor-pointer"
                      onClick={() => {
                        navigate("/forgot-password");
                      }}
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="flex items-start justify-center flex-col w-3/4">
                    <Button
                      loading={loading}
                      className="w-full h-14 text-lg font-medium border-2 rounded-lg pl-2 bg-main text-white"
                      htmlType="submit"
                    >
                      {loading ? "Logging In" : "Log in"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-center flex-col w-3/4">
                    <p className="font-medium lg:text-lg md:text-base text-sm">
                      Don't have an account?{" "}
                      <button
                        href=""
                        className="text-red-600 font-semibold"
                        onClick={() => {
                          navigate("/register");
                        }}
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default Login;
