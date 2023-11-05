import { Helmet, HelmetProvider } from "react-helmet-async";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Table } from "antd";

const AuditLog = () => {
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

  const [searchText, setSearchText] = useState("");
  const [auditLogs, setAuditLogs] = useState([]);
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

  const auditColumns = [
    {
      title: "#",
      dataIndex: "rowNumber",
      key: "rowNumber",
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Updated By",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action Taken",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      defaultSortOrder: "desc",
      sorter: (a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      },
    },
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/audit-logs`)
      .then((response) => response.json())
      .then((data) => {
        setAuditLogs(data.auditLogs);
      })
      .catch((error) => {
        console.error("Error fetching audit logs: ", error);
      });
  }, []);

  const filterAuditLogs = () => {
    return auditLogs.filter((log) => {
      const search = searchText.toLowerCase();
      return (
        log.reference.toLowerCase().includes(search) ||
        log.name.toLowerCase().includes(search) ||
        log.action.toLowerCase().includes(search)
      );
    });
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Audit Log</title>
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
                <h1 className="flex text-black items-center lg:text-3xl font-semibold ">
                  Audit Log
                </h1>
                <span className="text-black mr-auto">Logs:</span>
              </div>

              <div className="relative flex items-center justify-center lg:mr-auto lg:ml-4 ">
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  className="my-4 h-12"
                  value={searchText}
                  onChange={(e) => handleSearchBar(e.target.value)}
                />
              </div>
            </div>
            <div
              className={`overflow-auto h-auto shadow-xl  pb-5  rounded-lg w-full`}
            >
              <Table
                columns={auditColumns}
                dataSource={filterAuditLogs()}
                pagination={pagination}
                onChange={(newPagination) => setPagination(newPagination)}
                rowKey={(record) => record.id}
              />
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default AuditLog;
