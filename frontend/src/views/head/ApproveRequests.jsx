import { Helmet, HelmetProvider } from "react-helmet-async";
import HeadSidebar from "../../components/HeadSidebar";
import { useEffect, useState } from "react";
import { Input, Table, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import HeadDrawer from "../../components/HeadDrawer";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import ViewToApproveModal from "../../components/ViewToApproveModal";
import { message } from "antd";

const ApproveRequests = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { fullName } = useAuth();

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [processingRequests, setProcessingRequests] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const handleViewClick = (record) => {
    setSelectedRowData(record);
    setIsModalVisible(true);
  };

  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    showQuickJumper: true,
    current: 1,
    pageSize: 10,
    showLessItems: true,
  });

  const handleSearchBar = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const [data, setData] = useState([]);

  const handleApprove = async (requestId) => {
    setIsLoading(true);
    try {
      setProcessingRequests([...processingRequests, requestId]);
      await axios.put(`http://127.0.0.1:8000/api/approve-request/${requestId}`);
      const updatedResponse = await axios.get(
        `http://127.0.0.1:8000/api/pending-signature/${fullName}`
      );
      setData(updatedResponse.data);
      setIsLoading(false);
      message.success("Request successfully approved");
    } catch (error) {
      console.error("Error approving request:", error);
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const updatedResponse = await axios.get(
        `http://127.0.0.1:8000/api/pending-signature/${fullName}`
      );
      setData(updatedResponse.data);
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  const filteredRequests = data.filter((request) => {
    const searchTextLower = searchText.toLowerCase();

    const shouldIncludeRow = Object.values(request).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTextLower);
      } else if (typeof value === "number") {
        return value.toString().toLowerCase().includes(searchTextLower);
      } else if (value instanceof Date) {
        // Handle Date objects
        const formattedDate = value.toLocaleString();
        return formattedDate.toLowerCase().includes(searchTextLower);
      }
      return false;
    });

    return shouldIncludeRow;
  });

  const requestColumns = [
    {
      title: "#",
      dataIndex: "#",
      key: "id",
      render: (text, record, index) => {
        const currentPage = pagination.current || 1;
        const calculatedIndex =
          (currentPage - 1) * pagination.pageSize + index + 1;
        return <span>{calculatedIndex}</span>;
      },
    },

    {
      title: "Request ID",
      dataIndex: "request_code",
      key: "id",
    },
    {
      title: "Requested By",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Date Requested",
      dataIndex: "dateRequested",
      key: "dateRequested",
      sorter: (a, b) => {
        const dateA = new Date(a.dateRequested);
        const dateB = new Date(b.dateRequested);
        return dateA - dateB;
      },
    },
    {
      title: "Nature of Request",
      dataIndex: "natureOfRequest",
      key: "natureOfRequest",
    },
    {
      title: "Mode",
      dataIndex: "modeOfRequest",
      key: "modeOfRequest",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (record) => (
        <>
          <Button
            onClick={() => handleViewClick(record)}
            type="primary"
            style={{
              backgroundColor: "blue",
              borderColor: "blue",
              color: "white",
            }}
          >
            View
          </Button>
          <Button
            type="primary"
            loading={processingRequests.includes(record.id)}
            style={{
              backgroundColor: "red",
              borderColor: "red",
              color: "white",
            }}
            onClick={() => handleApprove(record.id)}
          >
            {processingRequests.includes(record.id) ? "Approving" : "Approve"}
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/pending-signature/${fullName}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log(selectedRowData);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Approve Requests</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <HeadSidebar /> : <HeadDrawer />}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto lg:ml-auto lg:mx-4   lg:mt-0   mt-20  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <div className="flex lg:flex-col flex-row lg:gap-0 gap-2">
                <h1 className="flex text-black items-center lg:text-3xl font-semibold ">
                  Reqeuests List
                </h1>
                <span className="text-black mr-auto">Total Requests:</span>
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
              className={`overflow-auto h-auto shadow-xl  pb-5 rounded-lg w-full`}
            >
              <Table
                columns={requestColumns}
                dataSource={filteredRequests}
                pagination={pagination}
                scroll={{ x: 1300 }}
                onChange={(newPagination) => setPagination(newPagination)}
                rowKey={(record) => record.id}
              />
              <ViewToApproveModal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                data={selectedRowData}
                refreshData={refreshData}
              />
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ApproveRequests;
