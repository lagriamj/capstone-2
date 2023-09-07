import { List, Modal } from "antd";
import PropTypes from "prop-types";

const TermsAndConditionsModal = ({ isOpen, onClose }) => {
  const termsAndConditionsList = [
    {
      header: "1. Acceptance of Terms",
      content:
        "By using Request Tracker and its services, you agree to comply with and be bound by these Terms and Conditions.",
    },
    {
      header: "2. User Registration and OTP Verification",
      content:
        "You agree to provide accurate and complete information during the registration process. We may use OTP (One-Time Password) verification to secure your account and ensure your identity.",
    },
    {
      header: "3. User Conduct",
      content:
        "We collect and use your personal information as outlined in our Privacy Policy.",
    },
    {
      header: "4. Privacy and Data Collection",
      content:
        "You agree not to engage in any unlawful, harmful, or disruptive behavior while using our services.",
    },
    {
      header: "5. Intellectual Property",
      content:
        "All content and materials on Request Tracker are protected by intellectual property laws.",
    },
    {
      header: "6. Termination of Account",
      content:
        "We reserve the right to terminate or suspend your account if you violate these Terms and Conditions.",
    },
    {
      header: "7. Disclaimers",
      content:
        'Request Tracker is provided "as is" without any warranties. We are not responsible for any errors, interruptions, or security breaches.',
    },
    {
      header: "8. Limitation of Liability",
      content:
        "We are not liable for any direct or indirect damages arising from your use of Request Tracker.",
    },
    {
      header: "9. Governing Law",
      content:
        "These Terms and Conditions are governed by and construed in accordance with the laws of our Jurisdiction.",
    },
    {
      header: "10. Changes to Terms",
      content:
        "We reserve the right to modify these Terms and Conditions at any time. It is your responsibility to review them periodically.",
    },
    {
      header: "11. Contact Information",
      content:
        "If you have any questions or concerns regarding these Terms and Conditions, please contact us at citc@gmail.com.",
    },
  ];

  return (
    <Modal
      title="Terms & Conditions"
      open={isOpen}
      onCancel={() => onClose()}
      width="50%"
      footer={null}
    >
      <List
        bordered
        dataSource={termsAndConditionsList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<strong>{item.header}</strong>}
              description={item.content}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

TermsAndConditionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TermsAndConditionsModal;
