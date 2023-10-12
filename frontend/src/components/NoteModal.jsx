import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NoteModal(display) {
  const [showModal, setShowModal] = React.useState(display);
  const [cutOffTime, setCutOffTime] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/getCutOffTime")
      .then((response) => {
        if (response.data.cutOffTime) {
          const cutOffTimeDate = new Date(response.data.cutOffTime);

          const hours = cutOffTimeDate.getHours();
          const minutes = cutOffTimeDate.getMinutes();
          const formattedHours = hours % 12 || 12;
          const amPm = hours < 12 ? "AM" : "PM";
          const formattedTime = `${formattedHours}:${minutes
            .toString()
            .padStart(2, "0")} ${amPm}`;
          setCutOffTime(formattedTime);
        } else {
          setCutOffTime("");
        }
      })
      .catch((error) => {
        console.error("Error fetching cut-off time:", error);
        setCutOffTime("Error fetching cut-off time");
      });
  }, []);

  return (
    <>
      <button
        className="text-yellow-300 underline font-bold uppercase text-sm lg:text-lg rounded outline-none focus:outline-none ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Note*
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white text-black outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Note</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <ul className="list-disc pl-6">
                    {cutOffTime && (
                      <li className="text-red-500 text-semibold">
                        Cut-off Time: {cutOffTime}
                      </li>
                    )}
                    <li>
                      No Property Number? No problem! Use the Sticker Number
                      instead.
                    </li>
                    <li>
                      Warning: We can`&apos;`t be responsible for any unlicensed
                      software on your device. In case of a raid or
                      confiscation, we`&apos;`re not liable.
                    </li>
                    <li>
                      Protect your data: We`&apos;`re not liable for any data
                      loss during the repair process.
                    </li>
                    <li>
                      Act fast: Submit your request slip with the authorized
                      signature by the end of the day. Otherwise, it will be
                      canceled for the next day.
                    </li>
                  </ul>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
