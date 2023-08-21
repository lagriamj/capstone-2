import React from "react";
import DrawerComponent from "../../components/DrawerComponent";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import InputBox from "../../components/InputBox";

const Account = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isLargeScreen = windowWidth >= 1024;
  return (
    <div className="flex flex-col lg:flex-row bg-gray-200 h-screen lg:pl-16 lg:pb-10">
      {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
      <div className="lg:w-[80%] w-[90%] min-h-[90vh]  mt-10 lg:mt-10 h-4/5 pb-10 bg-white shadow-xl self-center lg:ml-80 border-0 border-gray-400   rounded-3xl flex flex-col items-center font-sans">
        <h1 className=" text-3xl text-center my-10 font-bold ">Account Details</h1>
        <form action="" className=" w-11/12 h-auto  justify-center">
          <div className="flex lg:gap-10 gap-4 items-center my-4 flex-col lg:flex-row">
            <div className="lg:w-1/4 w-[80%]">
              <InputBox type={"text"} name={"reqOffice"} id={"reqOffice"} label={"First Name:"} />
            </div>
            <div className="lg:w-1/4 w-[80%]">
              <InputBox type={"text"} name={"reqOffice"} id={"reqOffice"} label={"Last Name:"} />
            </div>
          </div>
          <div className="flex lg:gap-10 gap-4 items-center flex-col lg:flex-row ">
            <div className="lg:w-1/4 w-[80%]  ">
              <InputBox type={"text"} name={"reqOffice"} id={"reqOffice"} label={"First Name:"} />
            </div>
            <div className="lg:w-1/4 w-[80%]">
              <InputBox type={"text"} name={"reqOffice"} id={"reqOffice"} label={"Last Name:"} />
            </div>
          </div>
          <div className="flex flex-col lg:items-start items-center">
            <div className="lg:w-1/4 my-4 w-[80%]">
              <InputBox type={"text"} name={"reqOffice"} id={"reqOffice"} label={"First Name:"} />
            </div>
            <div className="lg:w-1/4 w-[80%]">
              <InputBox type={"text"} name={"reqOffice"} id={"reqOffice"} label={"Last Name:"} />
            </div>
            <a href="" className="bg-blue-600 text-white px-4 py-3 rounded-lg text-xl mt-10 lg:mr-auto ">Update</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;
