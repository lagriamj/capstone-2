import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "antd";

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
      <Modal
        title={<span className="text-2xl">Note</span>}
        open={showModal}
        onCancel={() => setShowModal(false)}
        width={"60%"}
        footer={[
          <button
            key="close"
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>,
        ]}
      >
        <ul className="list-disc pl-6 flex flex-col text-2xl gap-8 font-sans">
          {cutOffTime && <li>Cut-off Time: {cutOffTime}</li>}
          <li>
            <b>No Property Number?</b> No problem! Use the Sticker Number
            instead.
          </li>
          <li>
            <b>Warning: We can&apos;t be responsible</b> for any unlicensed
            software on your device. In case of a raid or confiscation,
            we&apos;re not liable.
          </li>
          <li>
            <b>Protect your data: We&apos;re not liable</b> for any data loss
            during the repair process.
          </li>
          <li>
            <b>Act fast: Submit your request slip</b> with the authorized
            signature by the end of the day. Otherwise, it will be canceled for
            the next day.
          </li>
        </ul>
      </Modal>
    </>
  );
}
