import { useRef } from "react";
import { Modal } from "antd";
import ReactToPrint from "react-to-print";
import { useAuth } from "../AuthContext";
import PropTypes from "prop-types";

const PrintPreviewModal = ({ visible, onClose, itemData }) => {
  const contentRef = useRef();

  const printRef = useRef(); // Ref for ReactToPrint component

  const { fullName } = useAuth();
  console.log(fullName);

  const handlePrint = () => {
    if (printRef.current) {
      printRef.current.handlePrint(); // Trigger the print action
    }
  };

  const natureOfRerquest = itemData.natureOfRequest;
  console.log(natureOfRerquest);

  return (
    <Modal
      title="Print Preview"
      open={visible}
      onCancel={onClose}
      onOk={handlePrint}
      width="65%" // Set a custom width
      style={{ height: "60vh" }} // Set a custom height // No footer in the print preview modal
      okButtonProps={{
        color: "red",
        className: "text-black border-1 border-gray-300",
        size: "large",
      }}
      okText="Print"
      cancelButtonProps={{
        color: "red",
        className: "text-black border-1 border-gray-300",
        size: "large",
      }}
    >
      <ReactToPrint
        ref={printRef} // Assign the ref for the ReactToPrint component
        content={() => contentRef.current} // No need for an additional trigger element
      />
      <div className="text-black w-full overflow-auto" ref={contentRef}>
        <div className="flex">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="CITC Technical Service Request Slip"
              className="outline-none placeholder-black w-56"
            />
            <input
              type="text"
              className="outline-none placeholder-black"
              placeholder="Series of 2022"
            />
          </div>
          <div className="flex  ml-auto font-bold ">
            <input
              type="text"
              placeholder="CADO.OPTN.CITC.F.001"
              className="outline-none placeholder-black  text-center"
            />
            <input
              type="text"
              placeholder="REV.00"
              className="outline-none placeholder-black  w-20 text-center"
            />
            <input
              type="text"
              placeholder="04JUN2022"
              className="outline-none placeholder-black  w-28 text-right"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col mt-auto">
            <input
              type="text"
              className="outline-none placeholder-black"
              placeholder="Form No. CITC 01-01"
            />
            <input
              type="text"
              className="outline-none placeholder-black"
              placeholder="Rev.1998,2008,2002"
            />
          </div>
          <div className="flex flex-col text-2xl font-bold justify-center items-center">
            <h1>Republic of the Philippines</h1>
            <h1>City of Davao</h1>
            <h1>CITY INFORMATION TECHNOLOGY CENTER</h1>
          </div>
          <div className="w-[12%]"></div>
        </div>
        <div className="border-2 border-black w-full">
          <div className="text-center font-bold border-2 border-black text-2xl p-1">
            <h1>CITC TECHNICAL SERVICE REQUEST SLIP</h1>
          </div>
          <div className="flex text-lg font-medium">
            <div className="flex flex-col w-1/2">
              <div className="flex">
                <div className="border-2 border-black px-3 py-1 w-[40%]">
                  <h1>REQUESTING OFFICE:</h1>
                </div>
                <div className="w-[60%] border-2 border-black text-center flex items-center justify-center">
                  <h1>{itemData.reqOffice}</h1>
                </div>
              </div>
              <div className="flex">
                <div className="border-2 border-black px-3 py-1 w-[40%]">
                  <h1>DIVISION:</h1>
                </div>
                <div className="w-[60%] border-2 border-black text-center flex items-center justify-center">
                  <h1>{itemData.division}</h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <div className="flex">
                <div className="border-2 border-black px-3 py-1 w-[40%]">
                  <h1>DATE OF REQUEST:</h1>
                </div>
                <div className="w-[60%] border-2 border-black text-center flex items-center justify-center">
                  <h1>{itemData.dateRequested}</h1>
                </div>
              </div>
              <div className="flex">
                <div className="border-2 border-black px-3 py-1 w-[40%]">
                  <h1>REQUEST MODE:</h1>
                </div>
                <div className="w-[60%] border-2 border-black text-center flex items-center justify-center">
                  <h1>{itemData.modeOfRequest}</h1>
                </div>
              </div>
            </div>
          </div>
          {/* NATURE OF REQUEST  */}
          <div className="flex border-2 border-black">
            <div className="text-lg font-medium p-2">NATURE OF REQUEST:</div>
            <div className="font-medium text-base">
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="System/Prog. Revision/update"
                  className="mr-2"
                  checked={natureOfRerquest === "System/Prog. Revision/update"}
                  onChange={() => {}}
                />
                System/Prog. Revision/update
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Recompile"
                  className="mr-2"
                  checked={natureOfRerquest === "Recompile"}
                  onChange={() => {}}
                />
                Recompile
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="New/Update System User"
                  className="mr-2"
                  checked={natureOfRerquest === "New/Update System User"}
                  onChange={() => {}}
                />
                New/Update System User
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Data/Record Update"
                  className="mr-2"
                  checked={natureOfRerquest === "Data/Record Update"}
                  onChange={() => {}}
                />
                Data/Record Update
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Data/Record Encoding"
                  className="mr-2"
                  checked={natureOfRerquest === "Data/Record Encoding"}
                  onChange={() => {}}
                />
                Data/Record Encoding
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Data/Record Printing"
                  className="mr-2"
                  checked={natureOfRerquest === "Data/Record Printing"}
                  onChange={() => {}}
                />
                Data/Record Printing
              </label>
              <div className="flex pb-1 mr-2 px-4">
                No. of Copies{"  "}
                <input
                  type="text"
                  className="border-b-2 w-20 ml-1 border-black outline-none"
                />
              </div>
            </div>
            <div className="font-medium text-base">
              <div className="flex">
                <label className="block px-4 ">
                  <input
                    type="checkbox"
                    value="Check-Up & Repair"
                    className="mr-2"
                    checked={natureOfRerquest === "Check-Up & Repair"}
                    onChange={() => {}}
                  />
                  Check-up & Repair
                </label>
                <label className="block  ">
                  <input
                    type="checkbox"
                    value="Technical Specs"
                    className="mr-2"
                    checked={natureOfRerquest === "Technical Specs"}
                    onChange={() => {}}
                  />
                  Technical Specs
                </label>
              </div>
              <div className="flex">
                <label className="block px-4 ">
                  <input
                    type="checkbox"
                    value="Preventive Maintenance"
                    className="mr-2"
                    checked={natureOfRerquest === "Preventive Maintenance"}
                    onChange={() => {}}
                  />
                  Preventive Maintenance
                </label>
                <label className="block  ">
                  <input
                    type="checkbox"
                    value="Technical Assist."
                    className="mr-2"
                    checked={natureOfRerquest === "Technical Assist."}
                    onChange={() => {}}
                  />
                  Technical Assist.
                </label>
              </div>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="HW Installation"
                  className="mr-2"
                  checked={natureOfRerquest === "HW Installation"}
                  onChange={() => {}}
                />
                HW Installation
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="HW Relocation"
                  className="mr-2"
                  checked={natureOfRerquest === "HW Relocation"}
                  onChange={() => {}}
                />
                HW Relocation
              </label>
              <label className="block px-4">
                <input
                  type="checkbox"
                  value="Cable Installation/Maint."
                  className="mr-2"
                  checked={natureOfRerquest === "Cable Installation/Maint."}
                  onChange={() => {}}
                />
                Cable Installation/Maint.
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="SW Installation/Maintenance"
                  className="mr-2"
                  checked={natureOfRerquest === "SW Installation/Maintenance"}
                  onChange={() => {}}
                />
                SW Installation/Maintenance
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Technical Evaluation"
                  className="mr-2"
                  checked={natureOfRerquest === "Technical Evaluation"}
                  onChange={() => {}}
                />
                Technical Evaluation
              </label>
            </div>
            <div className="font-medium text-base">
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Internet Connection/Config."
                  className="mr-2"
                  checked={natureOfRerquest === "Internet Connection/Config."}
                  onChange={() => {}}
                />
                Internet Connection/Config.
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="LAN Connection/Config."
                  className="mr-2"
                  checked={natureOfRerquest === "LAN Connection/Config."}
                  onChange={() => {}}
                />
                LAN Connection/Config.
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="IP PBX / Phone"
                  className="mr-2"
                  checked={natureOfRerquest === "IP PBX / Phone"}
                  onChange={() => {}}
                />
                IP PBX / Phone
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Email"
                  className="mr-2"
                  checked={natureOfRerquest === "Email"}
                  onChange={() => {}}
                />
                Email
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Back-up"
                  className="mr-2"
                  checked={natureOfRerquest === "Back-up"}
                  onChange={() => {}}
                />
                Back-up
              </label>
              <label className="block px-4 ">
                <input
                  type="checkbox"
                  value="Online"
                  className="mr-2"
                  checked={natureOfRerquest === "IP Address Request"}
                  onChange={() => {}}
                />
                IP Address Request
              </label>
              <div className="flex pb-1 mr-2 px-4">
                <input
                  type="checkbox"
                  className="border-b-2 mr-2  border-black outline-none"
                />
                <label>No. of Copies</label>
                <input
                  type="text"
                  className="border-b-2 w-20 ml-1 border-black outline-none"
                />
              </div>
            </div>
          </div>
          {/* Requested by , Authorized by, and special instructions  */}
          <div className="flex border-y-2 border-black font-medium text-base">
            <div className="flex flex-col w-1/2 ">
              <div className="flex w-full">
                <div className="border-2 w-[40%] flex items-center pl-2 justify-start border-black">
                  <label htmlFor="" className="">
                    REQUESTED BY:
                  </label>
                </div>
                <div className="w-[60%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      {fullName}
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      Office Representative
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex w-full">
                <div className="border-2 w-[40%] flex items-center pl-2 justify-start border-black">
                  <label htmlFor="" className="">
                    AUTHORIZED BY:
                  </label>
                </div>
                <div className="w-[60%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      {itemData.authorizedBy}
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      Office Head
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 border-2 border-black">
              <div className="flex flex-col">
                <div className="px-2 py-1">
                  <label htmlFor="">Special Instructions:</label>
                  <div className="flex flex-wrap text-base">
                    <p>{itemData.specialIns}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Unit, Propert No, Serial No  */}
          <div className="flex  border-black text-base font-semibold">
            <div className="flex gap-3 px-2 w-1/3 border-2 py-2 border-black">
              <label htmlFor="">Unit:</label>
              <label htmlFor="">{itemData.unit}</label>
            </div>
            <div className="flex gap-3 px-2 w-1/3 border-2 py-2 border-black">
              <label htmlFor="">Property No.:</label>
              <label htmlFor="">{itemData.propertyNo}</label>
            </div>
            <div className="flex gap-3 px-2 w-1/3 border-2 py-2 border-black">
              <label htmlFor="">Serial No.:</label>
              <label htmlFor="">{itemData.serialNo}</label>
            </div>
          </div>
          {/* Received by, assigned to, serviced by  */}
          <div className="flex border-y-2 border-black">
            <div className="w-[37%] border-2 border-black">
              <div className="flex">
                <div className="text-base w-[35%]  font-medium p-2 border-r-2 border-black flex items-center justify-center">
                  <label htmlFor="">RECEIVED BY:</label>
                </div>
                <div className="w-[37.5%] flex flex-col border-x-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      CITC Staff
                    </label>
                  </div>
                </div>
                <div className="w-[37.5%] flex flex-col border-x-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      DATE
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex border-y-2 w-[24%] border-black">
              <div className="text-center flex items-center justify-center w-1/2 border-r-2 border-black">
                <label htmlFor="" className="text-base font-medium">
                  ASSIGNED TO:
                </label>
              </div>
              <div className="w-1/2 flex flex-col border-x-2 border-black">
                <div className="text-center border-b-2  border-black text-black w-full">
                  <label htmlFor="" className=" w-full">
                    Data here
                  </label>
                </div>
                <div className="text-center ">
                  <label htmlFor="" className="text-xs  border-black">
                    CITC Staff
                  </label>
                </div>
              </div>
            </div>
            <div className="w-[39%] border-y-2 border-black">
              <div className="flex">
                <div className="text-base w-[35%]  font-medium p-2 border-x-2 border-black flex items-center justify-center">
                  <label htmlFor="">SERVICED BY:</label>
                </div>
                <div className="w-[37.5%] flex flex-col border-x-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs   border-black">
                      CITC Staff
                    </label>
                  </div>
                </div>
                <div className="w-[37.5%] flex flex-col border-x-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      DATE
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* findings/particulars, action taken  */}
          <div className="flex border-y-2 border-black h-28">
            <div className="w-1/2 border-x-2 border-black flex flex-col">
              <label htmlFor="" className="ml-2 mt-1 font-medium text-base">
                FINDINGS / PARTICULARS:
              </label>
              <p className="ml-2 font-medium text-base">
                Findings/Particulars here
              </p>
            </div>
            <div className="w-1/2 border-x-2 border-black flex flex-col">
              <label htmlFor="" className="ml-2 mt-1 font-medium text-base">
                ACTION TAKEN:
              </label>
              <p className="ml-2 font-medium text-base">Action Taken here:</p>
            </div>
          </div>
          {/* Recommendation  */}
          <div className="flex border-y-2 border-black ">
            <div className="w-[20%] font-medium text-lg py-2 border-x-2 border-black">
              <label htmlFor="" className="ml-2 ">
                Recommendation:{" "}
              </label>
            </div>
            <div className="w-[80%] font-medium text-base py-2 border-x-2 border-black">
              <label htmlFor="" className="ml-2 ">
                Recommendation here
              </label>
            </div>
          </div>
          {/* Approved by, noted by, released by, received by */}
          <div className="flex border-y-2 border-black text-base font-medium">
            <div className="flex flex-col w-1/2 ">
              <div className="flex w-full">
                <div className="border-2 w-[30%] flex items-center pl-2 justify-start border-black">
                  <label htmlFor="" className="">
                    REQUESTED BY:
                  </label>
                </div>
                <div className="w-[45%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      Office Representative
                    </label>
                  </div>
                </div>
                <div className="w-[25%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-sm  border-black">
                      Date
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex w-full">
                <div className="border-2 w-[30%] flex items-center pl-2 justify-start border-black">
                  <label htmlFor="" className="">
                    AUTHORIZED BY:
                  </label>
                </div>
                <div className="w-[45%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      Office Head
                    </label>
                  </div>
                </div>
                <div className="w-[25%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      Date
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2 ">
              <div className="flex w-full">
                <div className="border-2 w-[30%] flex items-center pl-2 justify-start border-black">
                  <label htmlFor="" className="">
                    RELEASED BY:
                  </label>
                </div>
                <div className="w-[45%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      CITC Staff
                    </label>
                  </div>
                </div>
                <div className="w-[25%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      Date
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex w-full">
                <div className="border-2 w-[30%]  flex items-center pl-2 justify-start border-black">
                  <label htmlFor="" className="">
                    RECEIVED BY:
                  </label>
                </div>
                <div className="w-[45%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      Office Reperesentative
                    </label>
                  </div>
                </div>
                <div className="w-[25%] flex flex-col border-2 border-black">
                  <div className="text-center border-b-2  border-black text-black w-full">
                    <label htmlFor="" className=" w-full">
                      Data here
                    </label>
                  </div>
                  <div className="text-center ">
                    <label htmlFor="" className="text-xs  border-black">
                      Date
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Notes */}
          <div className="flex flex-col border-2 border-black">
            <div className="px-2 pt-3 text-sm">
              <label htmlFor="">Note:</label>
            </div>
            <div className="flex flex-col text-sm mt-1 pb-2 pl-5">
              <p>
                {" "}
                *We are not responsible for any UNLICENSED SOFTWARE that are
                installed in your unit and if in case with any raid or
                confiscation of your unit.{" "}
              </p>
              <p>
                *We are also not liable for any loss of data during the course
                of repairing the unit.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

PrintPreviewModal.propTypes = {
  visible: PropTypes.bool.isRequired, // Ensure that 'visible' is a required boolean prop
  onClose: PropTypes.func.isRequired, // Ensure that 'onClose' is a required function prop
  itemData: PropTypes.object.isRequired, // Ensure that 'itemData' is a required object prop
};

export default PrintPreviewModal;
