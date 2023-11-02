/* eslint-disable react-hooks/rules-of-hooks */
import { Input, Table } from "antd";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { useEffect, useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const thresholdColumns = [
  {
    title: "Property No",
    dataIndex: "propertyNo",
    key: "propertyNo",
  },
  {
    title: "Serial No",
    dataIndex: "serialNo",
    key: "serialNo",
  },
  {
    title: "Unit",
    dataIndex: "unit",
    key: "unit",
  },
  {
    title: "Recommendation",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Total Count",
    dataIndex: "total_count",
    key: "total_count",
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

  const [loading, setLoading] = useState(false);
  const [thresholdData, setThresholdData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  const filteredRequests = thresholdData?.filter((request) => {
    const searchTextLower = searchText.toLowerCase();

    const shouldIncludeRow = Object.values(request).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTextLower);
      } else if (typeof value === "number") {
        return value.toString().toLowerCase().includes(searchTextLower);
      }
      return false;
    });

    return shouldIncludeRow;
  });

  const handleSearchBar = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  useEffect(() => {
    fetchThresholdLog();
  }, []);

  const fetchThresholdLog = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/request-threshold`)
      .then((response) => {
        console.log(response);
        setThresholdData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    setLoading(false);
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [repairRequests, setRepairRequests] = useState({});

  useEffect(() => {
    const fetchRepairRequests = async (record) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/threshold-history`
        );
        if (response.status === 200) {
          const requests = response.data[0];
          console.log(requests);
          setRepairRequests({ ...repairRequests, [record.key]: requests });
        }
      } catch (error) {
        console.error("Error fetching repair requests:", error);
      }
    };

    expandedRowKeys.forEach((key) => {
      const record = thresholdData.find((item) => item.key === key);
      if (record && !repairRequests[key]) {
        fetchRepairRequests(record);
      }
    });
  }, [expandedRowKeys, thresholdData, repairRequests]);

  const handleRowClick = (record) => {
    const expandedRows = [...expandedRowKeys];
    const index = expandedRows.indexOf(record.key);

    if (index > -1) {
      expandedRows.splice(index, 1);
    } else {
      expandedRows.push(record.key);
    }

    setExpandedRowKeys(expandedRows);
  };

  const expandedRowRender = (record) => {
    const requests = repairRequests[record.key];
    if (requests) {
      return (
        <div className="ml-9 flex flex-col w-full">
          <span className="text-lg  w-full font-semibold font-sans ">
            Service History Log
          </span>
          <Table
            columns={historyColumn}
            dataSource={requests.allThresholdRequest}
            rowKey={(record) => record.request_id}
            pagination={false}
            className="mt-2"
          />
        </div>
      );
    } else {
      return <div>Loading repair requests...</div>;
    }
  };

  const historyColumn = [
    {
      title: "Date Requested",
      dataIndex: "dateRequested",
      key: "dateRequested",
    },
    {
      title: "Serviced By",
      dataIndex: "serviceBy",
      key: "serviceBy",
    },

    {
      /*{
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (index, record) => (
        <button className="py-2 px-4 bg-blue-600 rounded-lg text-white">
          View
        </button>
      ),
    },
*/
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Threshold Log</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}

        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[81%] large:w-[85%]  h-auto lg:ml-auto lg:mr-4   lg:mt-0 mt-20  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
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
                  value={searchText}
                  onChange={(e) => handleSearchBar(e.target.value)}
                  className="my-4 h-12"
                />
              </div>
            </div>
            <div
              className={`overflow-auto h-auto shadow-xl  pb-5  rounded-lg w-full`}
            >
              <Table
                columns={thresholdColumns}
                dataSource={filteredRequests}
                rowKey={(record) => record.request_id}
                loading={{
                  indicator: <LoadingOutlined style={{ fontSize: 50 }} />,
                  spinning: loading,
                }}
                pagination={pagination}
                onChange={(newPagination) => setPagination(newPagination)}
                rowClassName={"p-0"}
                expandable={{
                  onExpand: handleRowClick,
                  expandedRowRender,
                  expandedRowKeys,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ThresholdLog;
