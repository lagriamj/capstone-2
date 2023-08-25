// Inside UpdatePhoneNumberPage component
import { faPhone, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";

const UpdatePhoneNumberPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const userID = location.state?.userID;
  const [loading, setLoading] = useState(false);
  console.log(userID);

  const handleUpdatePhoneNumber = async (e) => {
    e.preventDefault();

    const response = await axios.put(`http://127.0.0.1:8000/api/update-phone`, {
      userID: !userID ? location.state.userID : userID,
      newContactNumber: newPhoneNumber,
    });
    console.log(response);
    setLoading(true);
    if (response.status === 200) {
      navigate("/verify-otp", {
        state: {
          userID: !userID ? location.state.userID : userID,
          contactNumber: newPhoneNumber,
          successMessage: "Updated Successfully!",
        },
      });
    } else if (response.status === 404) {
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
            onClick={() =>
              navigate("/verify-otp", {
                state: {
                  userID: userID,
                },
              })
            }
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
            <h1 className="font-semibold text-center">Update Phone Number</h1>
            <p className="text-lg font-semibold text-center">
              Enter your correct phone number
            </p>
            <img src="/confrm1.svg" alt="" className="h-64" />

            <form
              action=""
              onSubmit={handleUpdatePhoneNumber}
              className="w-3/4"
            >
              <div className="flex items-start justify-center text-lg flex-col w-full">
                <label className="font-semibold" htmlFor="newContactNumber">
                  Contact Number
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    id="newContactNumber"
                    name="newContactNumber"
                    pattern="[0-9]{11}"
                    required
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
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
              <div className="flex flex-col gap-y-2 w-full items-center justify-center mt-3">
                <button
                  type="submit"
                  className="text-xl text-white font-semibold bg-main w-full  py-4 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePhoneNumberPage;
