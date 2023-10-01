import { Helmet, HelmetProvider } from "react-helmet-async";
import HeadSidebar from "../../components/HeadSidebar";
import { useEffect, useState } from "react";
import { Input, Table, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import HeadDrawer from "../../components/HeadDrawer";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import ViewToApproveModal from "../../components/ViewToApproveModal";

const ApprovedList = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { fullName } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const handleViewClick = (record) => {
    setSelectedRowData(record);
    setIsModalVisible(true);
  };

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
    setPagination({ ...pagination, current: 1 }); // Reset to the first page when searching
  };

  const [data, setData] = useState([]); // State to hold the fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch data from the API
        const response = await axios.get(
          `http://127.0.0.1:8000/api/pending-approved-signature/${fullName}`
        );

        // Set the fetched data to the 'data' state
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      key: "#",
      render: (text, record, index) => {
        const currentPage = pagination.current || 1;
        const calculatedIndex =
          (currentPage - 1) * pagination.pageSize + index + 1;
        return <span key={index}>{calculatedIndex}</span>;
      },
    },
    {
      title: "Request ID",
      dataIndex: "id",
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
      key: "action",
      render: (record) => (
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
      ),
    },
  ];

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
                  Approved List
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
              />
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ApprovedList;
