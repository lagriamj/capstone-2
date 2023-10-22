/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faUser,
  faIdCard,
  faEnvelope,
  faPhone,
  faBuildingUser,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import HashLoader from "react-spinners/HashLoader";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { useAuth } from "../AuthContext";
import Select from "react-select";
import TermsAndConditionsModal from "../components/TermsAndConditionsModal";
import { Helmet, HelmetProvider } from "react-helmet-async";

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
    <div className="flex items-start justify-center text-lg flex-col lg:w-[80%] w-[90%]">
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
  const [division, setDivision] = useState("");
  const [userGovernmentID, setUserGovernmentID] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userContactNumber, setUserContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { userRole, isAuthenticated } = useAuth();
  const [officeOptions, setOfficeOptions] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);

  useEffect(() => {
    // If the user is already authenticated, redirect them to the appropriate page
    if (isAuthenticated) {
      if (isAuthenticated) {
        if (userRole === "admin") {
          navigate("/dashboard");
        } else if (userRole === "user") {
          navigate("/request");
        } else if (userRole === "head") {
          navigate("/head/request");
        }
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  if (isAuthenticated) {
    return null; // or return a loading message, or redirect immediately
  }

  useEffect(() => {
    fetchOfficeList();
  }, []);

  const fetchOfficeList = async () => {
    try {
      const result = await axios.get("http://127.0.0.1:8000/api/office-list");
      console.log(result.data.results);
      setOfficeOptions(result.data.results);
      console.log(officeOptions);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  useEffect(() => {
    console.log(`Selected Office: ${selectedOffice}`);
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused
        ? "2px solid #cbd5e0"
        : "2px solid rgb(148 163 184)",
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      boxShadow: "none",
      height: "3.5rem",
      outline: "none",
      fontSize: "1rem",
      paddingLeft: "3rem",
      fontFamily: "Poppins",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#343467" : "white",
      color: state.isSelected ? "white" : "black",
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
    }),
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const registerUser = async (e) => {
    e.preventDefault();

    const userData = {
      userFirstName: userFirstName,
      userLastName: userLastName,
      userGovernmentID: userGovernmentID,
      office: selectedOffice,
      division: division,
      userEmail: userEmail,
      userContactNumber: userContactNumber,
      userPassword: selectedOffice + userLastName,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        userData
      );

      if (response.status === 201) {
        const registeredUser = response.data;
        console.log(registeredUser);
        setUser(registeredUser);
        setUserId(registeredUser.userID);

        const formData = new FormData();
        formData.append("governmentID", userGovernmentID);
        formData.append("signatureImage", file);

        try {
          const imageResponse = await axios.post(
            "http://127.0.0.1:8000/api/user-signature/store",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log(imageResponse.data);
          navigate("/verify-otp", {
            state: {
              user: registeredUser,
              userEmail: registeredUser.userEmail,
            },
          });
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
        }
      } else if (response.status === 422) {
        setErrorMessage("That government ID is not available");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAgree = () => {
    setTermsAgreed(true);
    handleCloseModal();
  };

  const handleDisagree = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (!showModal && !termsAgreed) {
      handleDisagree();
    }
  }, [showModal, termsAgreed]);

  const [windowWidth1366, setWindowWidth1366] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth1366(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isLargeScreen = windowWidth1366 >= 1024;

  return (
    <HelmetProvider>
      <Helmet>
        <title>Registration</title>
      </Helmet>
      <div className="bg-transparent">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
            <HashLoader color="#ffffff" size={80} />
          </div>
        )}
        <div className="flex h-auto overflow-auto">
          {/* Left Column */}
          <div className="lg:w-[40%] h-screen box-border bg-main hidden lg:flex md:w-1/6 justify-center items-start lg:pt-16 fixed">
            <div className=" w-full h-[100%] flex flex-col items-center justify-center text-center gap-3">
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

          {/* Right Column */}
          <div className="w-full lg:w-[60%] gotoLarge:h-screen h-auto   py-5 flex flex-col items-center justify-center overflow-auto ml-auto">
            <div
              className={` bg-white  w-[85%] py-5 gotoLarge:h-auto h-auto rounded-2xl lg:shadow-2xl ${
                isLargeScreen ? "text-4xl" : "text-lg"
              }`}
            >
              <div className="w-full  flex flex-col gap-4">
                <div className="lg:hidden flex my-5 gap-4 items-center justify-center">
                  <img className="w-20 h-20" src="/cityhalllogo.png" alt="" />
                  <img className="w-20 h-20" src="/citc1.png" alt="" />
                </div>
                <div className="lg:pl-5 lg:mt-5">
                  <h1
                    className={`text-4xl lg:text-5xl   font-semibold text-center`}
                  >
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
                <div className="flex items-start justify-center lg:w-[80%] w-[90%] lg:flex-row flex-col gap-5">
                  {/* First Name */}
                  <div className="flex flex-col lg:w-1/2 w-full">
                    <label
                      className="font-semibold text-lg"
                      htmlFor="firstName"
                    >
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
                      <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg font">
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

                <div className="flex items-start justify-center lg:w-[80%] w-[90%] lg:flex-row flex-col gap-5">
                  {/* Office */}
                  <div className="flex flex-col lg:w-1/2 w-full">
                    <label className="font-semibold text-lg" htmlFor="office">
                      Office
                    </label>
                    <div className="relative h-14">
                      <Select
                        name="office"
                        className="w-full"
                        value={selectedOffice?.value}
                        options={officeOptions.map((option) => ({
                          value: option.office,
                          label: option.office,
                        }))}
                        onChange={(selectedOption) =>
                          setSelectedOffice(selectedOption.value)
                        }
                        isSearchable
                        placeholder="Office"
                        styles={customStyles}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                        <svg
                          className="w-6 h-7 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <FontAwesomeIcon
                            icon={faBuildingUser}
                            style={{ color: "#ffffff" }}
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Division */}
                  <div className="flex flex-col lg:w-1/2 w-full lg:ml-4">
                    <label className="font-semibold text-lg" htmlFor="division">
                      Division
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
                        type="text"
                        name="division"
                        id="division"
                        value={division}
                        placeholder="Division"
                        required
                        onChange={(e) => setDivision(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                        <svg
                          className="w-6 h-7 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <FontAwesomeIcon
                            icon={faBuildingUser}
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
                <div className="flex items-start justify-center text-lg flex-col lg:w-[80%] w-[90%]">
                  <label
                    className="font-semibold"
                    htmlFor={"userContactNumber"}
                  >
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
                <div className="flex items-start justify-center text-lg flex-col lg:w-[80%] w-[90%]">
                  <label className="font-semibold" htmlFor="signature">
                    Signature
                  </label>
                  <div className="relative w-full">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                      className="w-full h-11 border-2 rounded-lg pl-12 pt-1 pr-4 text-lg border-slate-400 focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                      <FontAwesomeIcon
                        icon={faSignature} // Replace with the FontAwesome icon you want to use
                        className="text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-center flex-col w-3/4">
                  <button
                    className={`w-full h-14 text-lg font-medium border-2 rounded-lg pl-2 transition duration-300 ease-in-out  bg-main text-white`}
                    type="submit"
                  >
                    Next
                  </button>
                </div>
              </form>

              <TermsAndConditionsModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onAgree={handleAgree}
                onDisagree={handleDisagree}
                isLargeScreen={isLargeScreen}
              />
              <div className="flex items-center justify-center flex-col w-full mt-2">
                <p className="font-medium text-lg">
                  Already have an account?{" "}
                  <button
                    className="text-red-600 font-semibold"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};
export default Register;
