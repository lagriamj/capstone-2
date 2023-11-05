import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Helmet, HelmetProvider } from "react-helmet-async";

const UpdateEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState("");
  const userId = location.state?.userID;
  const [loading, setLoading] = useState(false);
  const { userRole, isAuthenticated } = useAuth();

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

    if (!location.state || (!location.state.user && !location.state.userID)) {
      navigate("/login"); // Redirect to login if not coming from login, register, or update-phone page
    }
  }, [isAuthenticated, userRole, navigate]);

  if (isAuthenticated) {
    return null; // or return a loading message, or redirect immediately
  }

  if (!location.state || (!location.state.user && !location.state.userID)) {
    return null; // Return null if not coming from login, register, or update-phone page
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault();

    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/update-email`,
      {
        userID: !userId ? location.state.userID : userId,
        newUserEmail: newEmail,
      }
    );
    setLoading(true);
    if (response.status === 200) {
      navigate("/verify-otp", {
        state: {
          userID: !userId ? location.state.userID : userId,
          userEmail: newEmail,
          successMessage: "Updated Successfully!",
        },
      });
    } else if (response.status === 404) {
      console.log(response.status);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Update Email</title>
      </Helmet>
      <div className="bg-transparent">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
            <HashLoader color="#ffffff" size={80} />
          </div>
        )}
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
          {/* right side */}
          <div className="w-full lg:w-[60%] h-screen relative lg:absolute lg:right-0 z-10 overflow-auto  flex flex-col items-center justify-center">
            <a
              onClick={() =>
                navigate("/verify-otp", {
                  state: {
                    userID: userId,
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
              <h1 className="font-semibold text-center">Update Email</h1>
              <p className="text-lg font-semibold text-center">
                Enter your correct Email Address
              </p>
              <img src="/confrm1.svg" alt="" className="h-64" />

              <form action="" onSubmit={handleUpdateEmail} className="w-3/4">
                <div className="flex items-start justify-center text-lg flex-col w-full">
                  <label className="font-semibold" htmlFor="newUserEmail">
                    Email
                  </label>
                  <div className="relative w-full">
                    <input
                      type="email"
                      id="newUserEmail"
                      name="newUserEmail"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full h-14 border-2 rounded-lg pl-14 pr-4 text-lg border-slate-400 focus:outline-none"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center p-3 bg-main rounded-l-lg">
                      <svg
                        className="w-6 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <FontAwesomeIcon
                          icon={faEnvelope}
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
    </HelmetProvider>
  );
};

export default UpdateEmailPage;
