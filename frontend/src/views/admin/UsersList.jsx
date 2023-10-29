import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Button, Input, Modal, Popconfirm, Table, message } from "antd";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import AddUserModal from "../../components/AddUserModal";
import UpdateUserModal from "../../components/UpdateUserModal";
import {
  LoadingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  WarningFilled,
} from "@ant-design/icons";
import "./../../assets/antDesignTable.css";

const UsersList = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const isWidth1980 = window.innerWidth === 1980;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users-list`
      );

      if (response.status === 200) {
        console.log(response.data.result);
        setUsers(response.data.result);
        setLoading(false);
      } else {
        setLoading(false);
        message.error("Errro Fetching Users");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [isUpdateUserModalVisible, setUpdateUserModalVisible] = useState(false);
  const [selectedUserForUpdate, setSelectedUserForUpdate] = useState(null);

  const openUpdateUserModal = (user) => {
    setSelectedUserForUpdate(user);
    setUpdateUserModalVisible(true);
  };

  const deleteUser = async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/delete-user/${id}`
      );

      console.log(id);

      if (response.status === 200) {
        // User deleted successfully, update the user list
        fetchUsers();
        message.success("User deleted successfully");
      } else {
        message.error(response);
      }
    } catch (error) {
      console.error(error);
      message.error("Error deleting user");
    }
  };

  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onDeleteSelectedUsers = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select users to delete.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/delete-selected-users`,
        {
          selectedUserIDs: selectedRowKeys,
        }
      );

      if (response.status === 200) {
        // Users deleted successfully, update the user list
        fetchUsers();
        message.success("Selected users deleted successfully");
        setSelectedRowKeys([]); // Clear selected rows
      } else {
        message.error("Error deleting selected users");
      }
    } catch (error) {
      console.error(error);
      message.error("Error deleting selected users");
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

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

  const filteredUsers = users.filter((user) => {
    const searchTextLower = searchText.toLowerCase();

    // Check if the userGovernmentID or other columns contain the search text
    return (
      user.userGovernmentID.toLowerCase().includes(searchTextLower) ||
      `${user.userFirstName} ${user.userLastName}`
        .toLowerCase()
        .includes(searchTextLower) ||
      user.office?.toLowerCase().includes(searchTextLower) ||
      user.division?.toLowerCase().includes(searchTextLower) ||
      user.userEmail?.toLowerCase().includes(searchTextLower) ||
      user.userContactNumber?.includes(searchText) ||
      user.userStatus?.toLowerCase().includes(searchTextLower) ||
      user.role?.toLowerCase().includes(searchTextLower)
    );
  });

  const [officeOptions, setOfficeOptions] = useState("");
  const [officeFilters, setOfficeFilters] = useState([]);

  useEffect(() => {
    fetchOfficeList();
  }, []);

  const fetchOfficeList = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/office-list`
      );
      console.log(result.data.results);
      setOfficeOptions(result.data.results);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
  };

  console.log(officeOptions);

  useEffect(() => {
    if (Array.isArray(officeOptions)) {
      const dynamicFilters = officeOptions.map((office) => ({
        text: office.office,
        value: office.office,
      }));
      setOfficeFilters(dynamicFilters);
    }
  }, [officeOptions]);

  console.log(officeOptions);
  console.log(officeFilters);

  const columns = [
    {
      title: "#",
      dataIndex: "userID",
      key: "userID",

      sorter: (a, b) => a.userID - b.userID,
    },
    {
      title: "Government ID",
      dataIndex: "userGovernmentID",
      key: "userGovernmentID",
    },
    {
      title: "Name",
      dataIndex: "userFirstName",
      key: "userFirstName",
      render: (text, record) =>
        `${record.userFirstName} ${record.userLastName}`,
    },
    {
      title: "Office",
      dataIndex: "office",
      key: "office",

      filters: officeFilters,
      filterSearch: true,
      onFilter: (value, record) => record.office === value,
    },
    {
      title: "Division",
      dataIndex: "division",
      key: "division",
    },
    {
      title: "Email",
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "Contact Number",
      dataIndex: "userContactNumber",
      key: "userContactNumber",
    },
    {
      title: "Status",
      dataIndex: "userStatus",
      key: "userStatus",

      filters: [
        {
          text: "verified",
          value: "verified",
        },
        {
          text: "unverified",
          value: "unverified",
        },
      ],
      onFilter: (value, record) => record.userStatus === value,
    },
    {
      title: "isActive",
      dataIndex: "isActive",
      key: "isActive",
      render: (text) => (text === 1 ? "Active" : "Inactive"),
      filters: [
        {
          text: "Active",
          value: 1,
        },
        {
          text: "Inactive",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",

      filters: [
        {
          text: "admin",
          value: "admin",
        },
        {
          text: "user",
          value: "user",
        },
        {
          text: "head",
          value: "head",
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.role?.includes(value),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <div className="flex items-center justify-start">
          <button
            className="text-white bg-blue-500 font-medium px-3 py-2 rounded-lg"
            onClick={() => openUpdateUserModal(record)}
          >
            Update
          </button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => deleteUser(record.userID)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            okButtonProps={{
              className: "border-2 border-gray-200 text-black",
              size: "large",
            }}
            cancelButtonProps={{
              className: "border-2 border-gray-200 text-black",
              size: "large",
            }}
          >
            <button className="ml-1 text-white bg-red-700 rounded-lg px-3 py-2 text-lg font-medium">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const showDeleteConfirmationModal = () => {
    setIsDeleteModalVisible(true);
  };

  const handleOkDelete = () => {
    onDeleteSelectedUsers();
    setIsDeleteModalVisible(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Users Lists</title>
      </Helmet>
      <div
        className={`className="flex flex-grow flex-col gotoLarge:px-6 large:ml-20 lg:flex-row white pt-5 large:h-screen h-auto`}
      >
        {isLargeScreen ? <AdminSidebar /> : <AdminDrawer />}
        {isLargeScreen ? (
          <Box
            sx={{
              position: "fixed",
              right: isWidth1980 ? 40 : 20,
              bottom: isWidth1980 ? 40 : 20,
              zIndex: 100,
            }}
          >
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              sx={{
                paddingX: 3,
                paddingY: 4,
                backgroundColor: "#2d3748",
                fontSize: "large",
              }}
              onClick={showModal}
            >
              <AddIcon sx={{ mr: 1 }} /> Add New User
            </Fab>
          </Box>
        ) : (
          <Box
            sx={{
              position: "fixed",
              right: 20,
              bottom: 20,
              zIndex: 100,
            }}
          >
            <Fab
              color="primary"
              aria-label="add"
              sx={{
                backgroundColor: "#2d3748",
                fontSize: "large",
              }}
              onClick={showModal}
            >
              <AddIcon />
            </Fab>
          </Box>
        )}
        <AddUserModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onOk={handleOk}
          refreshData={fetchUsers}
          isLargeScreen={isLargeScreen}
        />
        {isUpdateUserModalVisible && selectedUserForUpdate && (
          <UpdateUserModal
            visible={isUpdateUserModalVisible}
            onCancel={() => setUpdateUserModalVisible(false)}
            onOk={() => setUpdateUserModalVisible(false)}
            userData={selectedUserForUpdate}
            isLargeScreen={isLargeScreen}
            refreshData={fetchUsers}
          />
        )}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto sm:overflow-x-visible w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto  lg:ml-auto lg:mx-4 mt-20 lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex  lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center  bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <div className="flex lg:flex-col flex-row lg:gap-0 gap-2">
                <h1 className="flex text-black items-center lg:text-3xl font-semibold ">
                  Users List
                </h1>
                <span className="text-black mr-auto">
                  Total Users: {users.length}
                </span>
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

              {selectedRowKeys.length > 0 && (
                <button
                  onClick={showDeleteConfirmationModal}
                  className="text-white bg-red-700   rounded-lg px-3 py-2 text-lg font-medium transition duration-300 ease-in-out"
                >
                  Delete Selected
                </button>
              )}
              <Modal
                title="Confirm Deletion"
                open={isDeleteModalVisible}
                onOk={handleOkDelete}
                onCancel={handleCancelDelete}
                footer={[
                  <Button key="cancel" onClick={handleCancelDelete}>
                    Cancel
                  </Button>,
                  <Button
                    key="ok"
                    className="bg-red-700 text-white"
                    onClick={handleOkDelete}
                  >
                    Confirm
                  </Button>,
                ]}
              >
                <p className="flex items-center justify-center gap-4">
                  <WarningFilled className="text-red-700 text-4xl" /> Are you
                  sure you want to delete the selected items?
                </p>
              </Modal>
            </div>
            <div className={` h-auto shadow-xl  pb-5  rounded-lg w-full`}>
              <Table
                columns={columns}
                dataSource={filteredUsers}
                loading={{
                  indicator: <LoadingOutlined style={{ fontSize: 50 }} />,
                  spinning: loading,
                }}
                pagination={pagination}
                scroll={{ x: 1300 }}
                rowSelection={rowSelection}
                rowKey="userID"
                onChange={(newPagination) => setPagination(newPagination)}
              />
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default UsersList;
