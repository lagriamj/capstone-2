import { Input, Table } from "antd";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

const thresholdColumns = [
  {
    title: "Ticket No",
    dataIndex: "ticketNo",
    key: "ticketNo",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

const ThresholdLog = () => {
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
    <HelmetProvider>
      <Helmet>
        <title>Service Task</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}

        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%]  h-auto lg:ml-auto lg:mx-4   lg:mt-0 mt-20  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <div className="flex lg:flex-col flex-row lg:gap-0 gap-2">
                <h1 className="flex text-black items-center lg:text-2xl font-semibold ">
                  Threshold List
                </h1>
                <span className="text-black mr-auto">Total Threshold:</span>
              </div>

              <div className="relative flex items-center justify-center lg:mr-auto lg:ml-4 ">
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  //value={searchText}
                  //onChange={(e) => handleSearchBar(e.target.value)}
                  className="my-4 h-12"
                />
              </div>

              <div className="flex items-center justify-center gap-4 mr-4 mb-4 lg:mb-0">
                <div className="flex lg:flex-row flex-col items-center text-black gap-2">
                  <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
                    <span className="font-semibold">From:</span>
                    <input
                      type="date"
                      className="p-2 w-36 outline-none border-none bg-transparent"
                      //value={startDate}
                      //onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
                    <span className="font-semibold">To:</span>
                    <input
                      type="date"
                      className="p-2 w-36 outline-none border-none bg-transparent"
                      //value={endDate}
                      //onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`overflow-auto h-auto shadow-xl  pb-5  rounded-lg w-full`}
            >
              <Table columns={thresholdColumns} />
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ThresholdLog;
