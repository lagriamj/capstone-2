import React from "react";
import Sidebar from "../../components/Sidebar";
import DrawerComponent from "../../components/DrawerComponent";
import { useState, useEffect } from "react";
import { faCheck, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoteModal from "../../components/NoteModal";
import InputBox from "../../components/InputBox";
const Requests = () => {
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
    <div className="flex flex-col lg:flex-row bg-gray-200 lg:pl-24 lg:py-10 h-screen">
      {isLargeScreen ? <Sidebar /> : <DrawerComponent />}
      <div className="w-[80%] pb-10 mt-28 lg:mt-0 bg-white shadow-xl h-auto lg:ml-72 border-0 border-gray-400  self-center rounded-lg flex flex-col items-center font-sans">
        <h1 className=" text-3xl text-center my-10 font-bold ">CITC TECHNICAL SERVICE REQUEST SLIP</h1>
        <form action="" className="w-11/12 h-auto flex lg:flex-wrap  text-xl gap-10 mt-10 flex-col lg:flex-row  ">
          <div className="lg:w-1/4">
            <InputBox type={"text"} name={"reqOffice"} id={"reqOffice"} label={"Requesting Office:"} />
          </div>
          <div className="lg:w-1/4 ">
            <InputBox type={"text"} name={"division"} id={"division"} label={"Division:"} />
          </div>
          <div className="flex flex-col w-full lg:w-1/4">
            <label  className="font-semibold text-lg">Nature of Request:</label>
            <select name="natureOfRequest" className="w-full h-3/4  border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
          <div className="">
            <InputBox type={"date"} name={"dateRequested"} id={"dateRequested"} label={"Date:"} />
          </div>
          <div className="lg:w-1/4">
            <InputBox type={"text"} name={"modeOfRequest"} id={"modeOfRequest"} label={"Mode of Request:"} />
          </div>
          <div className="lg:w-1/4">
            <InputBox type={"text"} name={"unit"} id={"unit"} label={"Unit:"} />
          </div>
          <div className="flex flex-col w-full lg:w-1/4 ">
            <div className="flex items-center gap-2">
              <label  className="font-semibold text-lg ">Property No:</label>
              <NoteModal display={true} />
            </div>
            <input type="text" name="propertyNo." className="w-full border-2 border-gray-400 bg-gray-50 rounded-md py-2 px-4 focus:outline-none" />
          </div>
          <div className="lg:w-1/4">
          <InputBox type={"text"} name={"serialNo"} id={"serialNo"} label={"Serial No:"}/>
          </div>
          <div className="lg:w-1/4">
          <InputBox type={"text"} name={"authorizedBy"} id={"authorizedBy"} label={"Authorized By:"}/>
          </div>
          <div className="lg:w-1/4">
          <InputBox type={"text"} name={"dateProcured"} id={"dateProcured"} label={"Date Procured:"}/>
          </div>
          <div className="flex flex-col w-full ">
            <label htmlFor="message" className="font-semibold text-lg">Special Instruction</label>
            <textarea id="message" rows="4" className="block p-2.5 w-full text-lg  bg-gray-50 rounded-lg border border-gray-400  dark:placeholder-gray-400 dark:text-white focus:outline-none" placeholder="Write the special instructions here..."></textarea>
          </div>
          <button type="submit" className="bg-main text-white py-4 px-5 flex gap-3 items-center rounded-lg ml-auto"><FontAwesomeIcon icon={faCheck} style={{ color: "#ffffff", }} />Request Service</button>
          <p></p>
        </form>
      </div>
    </div>
  );
};

export default Requests;
