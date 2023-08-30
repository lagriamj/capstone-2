import React from "react";
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet } from "react-helmet";

const ServiceTransaction = () => {
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
    <div className='className="flex flex-col lg:flex-row bg-gray-200 lg:pl-24 lg:py-10 h-screen"'>
      <Helmet>
        <title>Service Transaction</title>
      </Helmet>
      {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
      <div className="overflow-x-auto lg:w-[80%] w-[90%] lg:min-h-[90vh] mt-28 lg:mt-10 h-4/5 pb-10 bg-white shadow-xl  lg:ml-80  border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans">
        <h1 className="text-3xl">Service Transaction</h1>
      </div>
    </div>
  );
};

export default ServiceTransaction;
