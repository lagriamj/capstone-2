import React from "react";

export default function CurrentRequestModal({ display, itemData, onClose }) {
  const renderDataRow = (label, value) => (
    <div className="mb-3">
      {" "}
      {/* Reduced margin-bottom */}
      <div className="text-lg font-semibold">{label}:</div>
      <div className="mt-1">{value}</div>
    </div>
  );

  const data = [
    { label: "Requesting Office", value: itemData.reqOffice },
    { label: "Division", value: itemData.division },
    { label: "Nature of Request", value: itemData.natureOfRequest },
    { label: "Date Requested", value: itemData.dateRequested },
    { label: "Mode of Request", value: itemData.modeOfRequest },
    { label: "Unit", value: itemData.unit },
    { label: "Property No", value: itemData.propertyNo },
    { label: "Serial No", value: itemData.serialNo },
    { label: "Authorized By", value: itemData.authorizedBy },
    { label: "Date Procured", value: itemData.dateProcured },
    { label: "Special Instruction", value: itemData.specialIns },
  ];

  const numRows = 3;
  const numCols = 4;

  return (
    <>
      {display && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none landscape-modal">
          <div className="relative lg:w-[70%] w-[90%]  max-w-screen-lg mx-auto my-6">
            <div className="border-0 rounded-2xl shadow-lg relative flex flex-col w-full h-[65vh] bg-white outline-none focus:outline-none">
              <div className="bg-main p-3 flex items-center justify-center py-7 rounded-t-2xl">
                {" "}
                {/* Reduced padding */}
                <h3 className="text-2xl font-semibold ml-4  text-white">
                  Request Details
                </h3>
                <button
                  className="p-2 ml-auto bg-transparent border-0 text-gray-700 opacity-5 float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  {/* Button content */}
                </button>
              </div>
              <div className="p-3 flex-auto landscape-content lg:pl-20 place-content-center grid grid-cols-3 gap-3">
                {" "}
                {/* Reduced padding */}
                {data
                  .slice(0, numRows * numCols)
                  .map(({ label, value }, index) => (
                    <div key={index}>{renderDataRow(label, value)}</div>
                  ))}
              </div>
              <div className="flex items-center justify-end p-3 border-t border-solid border-gray-300 rounded-b">
                {" "}
                {/* Reduced padding */}
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-3 py-2 text-sm outline-none focus:outline-none mr-2 mb-2 ease-linear transition-all duration-150"
                  type="button"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`fixed inset-0 z-40 ${display ? "block" : "hidden"}`}
        onClick={onClose}
      ></div>
    </>
  );
}
