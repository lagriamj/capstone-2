import { Button, Modal } from "antd";
import PropTypes from "prop-types";

const TermsAndConditionsModal = ({
  isOpen,
  onClose,
  onAgree,
  onDisagree,
  isLargeScreen,
}) => {
  return (
    <Modal
      title={
        <span className="flex w-full py-2 text-lg">Confidential Agreement</span>
      }
      open={isOpen}
      onCancel={() => onClose()}
      width={`${isLargeScreen ? "60%" : "90%"}`}
      footer={[
        <Button
          key="disagree"
          onClick={onDisagree}
          style={{ height: "2.5rem", width: "5.5rem" }}
          className="bg-white text-black border-2 border-main hover:bg-main hover:text-white ease-in-out transition duration-500 font-sans inline-flex items-center justify-center"
        >
          Disagree
        </Button>,
        <Button
          key="agree"
          onClick={onAgree}
          style={{ height: "2.5rem", width: "5.5rem" }}
          className="bg-main text-white font-sans hover:bg-white hover:text-black hover:border-2 hover:border-main ase-in-out transition duration-500"
        >
          Agree
        </Button>,
      ]}
    >
      <div className="flex flex-col font-sans gap-5 gotoLarge:gap-y-12 pb-4 large:pb-10 px-8">
        <h1 className="text-center text-2xl gotoLarge:text-3xl font-semibold py-4">
          Confidential Pact and Non-Disclosure Agreement
        </h1>
        <p className=" text-lg gotoLarge:text-xl text-justify">
          1. Access and use of the Student Advising Program (SAP) is a sacred
          duty of Designated Student Advisers (DSAs) in the service of student
          development in the University of Mindanao
        </p>
        <p className=" text-lg gotoLarge:text-xl text-justify">
          2. All information, data and materials from the personal records of
          the students are absolutely confidential in nature and need to be
          preserved and protected. Violation of this confidentiality through any
          form of disclosure and illegal use can result in legal liability.
        </p>
        <p className=" text-lg gotoLarge:text-xl text-justify">
          3. Only official DSAs are authorized to access the SAP. You may
          proceed to log-in if you have the proper authority.
        </p>
      </div>
    </Modal>
  );
};

TermsAndConditionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAgree: PropTypes.func.isRequired,
  onDisagree: PropTypes.func.isRequired,
  isLargeScreen: PropTypes.func.isRequired,
};

export default TermsAndConditionsModal;
