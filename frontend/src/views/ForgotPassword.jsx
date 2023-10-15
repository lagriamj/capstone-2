import { Button, message } from "antd";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changeButton, setChangeButton] = useState("verify");

  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();

  const handleCheckEmail = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/forgot-password",
        {
          email: email,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setSent(true);
      } else if (response.status === 404) {
        setError("Email not found");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response.data.message);
    }

    setLoading(false);
  };

  const handleOTPValidation = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/check-otp", {
        email: email,
        otpCode: otp,
      });
      console.log(response);
      if (response.status === 200) {
        setSent(true);
        setChangeButton("newPassword");
        setShowNewPassword(true);
      } else if (response.status === 404) {
        setError("Error");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }

    setLoading(false);
  };

  const handleNewPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/new-password",
        {
          email: email,
          userPassword: newPassword,
        }
      );
      console.log(response);
      if (response.status === 200) {
        message.success("Password changed successfully!");
        navigate("/login");
      } else if (response.status === 404) {
        setError("Error");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoadingResend(true);
    try {
      const response = await axios.put("http://127.0.0.1:8000/api/verify-otp", {
        email: email,
      });
      console.log(response);
      if (response.status === 200) {
        message.success(response.data.message);
      } else if (response.status === 404) {
        setError("Error");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }

    setLoadingResend(false);
  };

  return (
    <div className="flex">
      {/* Left side */}
      <div className="lg:w-1/2 h-screen box-border bg-main hidden lg:flex md:w-1/6 justify-center items-start lg:py-16">
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
      {/* ... */}
      <div className="lg:w-1/2 w-full h-screen  flex items-center justify-center font-sans">
        <div className="flex flex-col  bg-white lg:w-[70%] w-[90%] h-auto p-6 rounded-2xl lg:shadow-2xl text-4xl">
          <AnimatePresence>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl font-semibold text-center">
                  Enter OTP
                </h1>
                <p className="text-base text-center">
                  Please enter the OTP code sent to your email.
                </p>
                <p className="text-xs text-red-700 text-center">{error}</p>
                <div className="flex mt-2 flex-col gap-1 w-full">
                  <label htmlFor="otp" className="font-bold text-xs">
                    OTP Code
                  </label>
                  <motion.input
                    type="text"
                    className="outline-none h-10 border-2 rounded-lg text-sm pl-2 bg-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                {showNewPassword && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    className="flex mt-2 flex-col gap-1 w-full"
                  >
                    <label htmlFor="newPassword" className="font-bold text-xs">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      minLength={6}
                      className="outline-none h-10 border-2 rounded-lg text-sm pl-2 bg-gray-100"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                  </motion.div>
                )}
                <div className="flex gap-2 mt-2 w-full items-center justify-center">
                  <Button
                    loading={loadingResend}
                    className="w-[45%] h-12 text-lg font-medium border-2 border-main rounded-lg bg-white text-main"
                    onClick={handleResendOTP}
                  >
                    {loadingResend ? "Resending" : "Resend"}
                  </Button>
                  {changeButton === "verify" ? (
                    <Button
                      className="w-[45%] h-12 text-lg font-medium border-2 rounded-lg bg-main text-white"
                      htmlType="submit"
                      loading={loading}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5 }}
                      onClick={handleOTPValidation} // Implement this function for OTP validation
                    >
                      {loading ? "Verifying" : "Verify"}
                    </Button>
                  ) : (
                    <Button
                      className="w-[45%] h-12 text-lg font-medium border-2 rounded-lg bg-main text-white"
                      htmlType="submit"
                      loading={loading}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.5 }}
                      onClick={handleNewPassword} // Implement this function for OTP validation
                    >
                      {loading ? "Saving" : "Save"}
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl font-semibold text-center">
                  Trouble Logging In?
                </h1>
                <p className="text-base text-center">
                  Enter your email, and we&apos;ll send you an OTP code to
                  regain access to your account.
                </p>
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor="email" className="font-bold text-xs">
                    EMAIL
                  </label>
                  <motion.input
                    type="email"
                    className="outline-none h-10 border-2 rounded-lg text-sm pl-2 bg-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex mt-2 gap-2 w-full items-center justify-center">
                  <Button className="w-[45%] h-12 text-lg font-medium border-2 border-main rounded-lg bg-white text-main">
                    Cancel
                  </Button>
                  <Button
                    className="w-[45%] h-12 text-lg font-medium border-2 rounded-lg bg-main text-white"
                    htmlType="submit"
                    loading={loading}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleCheckEmail}
                  >
                    {loading ? "Sending" : "Send"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
