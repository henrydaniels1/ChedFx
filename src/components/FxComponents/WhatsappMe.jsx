import  { useEffect, useState } from "react";
import phoneConfig from "../JSON/PhoneNum.json"; // Adjust the path based on your project structure



const WhatsAppButton = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const defaultMessage = "Hello! I would like to learn more about your services."; // Set your default message here

  useEffect(() => {
    // Load the phone number from config.json
    setPhoneNumber(phoneConfig.phoneNumber);
  }, []);

  // const phoneNumber = import.meta.env.VITE_PHONE_NUMBER;

  const handleWhatsAppClick = () => {
    if (phoneNumber) {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div>
      <button
        className="btn-6 z-2 px-4 mx-auto md:mx-0 py-2 rounded-2xl text-xl"
        onClick={handleWhatsAppClick}
      >
        Get Started
      </button>
    </div>
  );
};

export default WhatsAppButton;
