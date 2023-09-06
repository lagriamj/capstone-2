import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminDrawer from "../../components/AdminDrawer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Popconfirm, Skeleton, message } from "antd";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import AddUserModal from "../../components/AddUserModal";
import UpdateUserModal from "../../components/UpdateUserModal";
import { QuestionCircleOutlined } from "@ant-design/icons";

const UsersList = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [users, setUsers] = useState([]);
  const [isSingleRequest, setIsSingleRequest] = useState(false);
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
      const response = await axios.get("http://127.0.0.1:8000/api/users-list");

      if (response.status === 200) {
        console.log(response.data.result);
        setUsers(response.data.result);
        setIsSingleRequest(response.data.results.length === 1);
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

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [selectedRoleFilters, setSelectedRoleFilters] = useState([]);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState([]);

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleStatusCheckboxChange = (e) => {
    const selectedStatus = e.target.value;

    setSelectedStatusFilters((prevFilters) => {
      if (prevFilters.length === 1 && prevFilters[0] === selectedStatus) {
        return []; // Unselect if the same option is clicked
      } else {
        return [selectedStatus];
      }
    });
  };

  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
  };

  const handleRoleCheckboxChange = (e) => {
    const selectedRole = e.target.value;

    setSelectedRoleFilters((prevFilters) => {
      if (prevFilters.length === 1 && prevFilters[0] === selectedRole) {
        return []; // Unselect if the same option is clicked
      } else {
        return [selectedRole];
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 10;

  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = users.slice(firstIndex, lastIndex);

  const npage = Math.ceil(users.length / recordsPage);
  //const numbers = [...Array(npage + 1).keys()].slice(1);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter((item) => {
    const matchesSearchQuery =
      item.userGovernmentID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userContactNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.userStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoleFilter =
      selectedRoleFilters.length === 0 ||
      selectedRoleFilters.includes(item.role);

    const matchesStatusFilter =
      selectedStatusFilters.length === 0 ||
      selectedStatusFilters.includes(item.userStatus);

    return matchesSearchQuery && matchesRoleFilter && matchesStatusFilter;
  });

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
        `http://127.0.0.1:8000/api/delete-user/${id}`
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

  return (
    <HelmetProvider>
      <Helmet>
        <title>Users Lists</title>
      </Helmet>
      <div
        className={`className="flex flex-col lg:flex-row bg-gray-200 ${
          isWidth1980 ? "lg:pl-20" : "lg:pl-[3.0rem]"
        } lg:py-5 h-screen`}
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
        />
        {isUpdateUserModalVisible && selectedUserForUpdate && (
          <UpdateUserModal
            visible={isUpdateUserModalVisible}
            onCancel={() => setUpdateUserModalVisible(false)}
            onOk={() => setUpdateUserModalVisible(false)}
            userData={selectedUserForUpdate}
          />
        )}
        <div className="flex flex-col lg:pb-10 bg-gray-200 gap-5 lg:w-full">
          <div
            className={`overflow-x-auto ${
              isWidth1980 ? "lg:w-[83%]" : "lg:w-[82%]"
            } w-[90%] lg:h-[90vh] relative mt-20 lg:mt-0 ml-5  h-4/5 pb-10 bg-white shadow-xl  lg:ml-72  border-0 border-gray-400  rounded-3xl flex flex-col items-center font-sans`}
          >
            <div className="flex  w-full   bg-main text-white rounded-t-3xl gap-10">
              <h1 className="font-sans lg:text-3xl text-xl mt-8 ml-5 mr-auto tracking-wide">
                Users
              </h1>
              <div className="relative flex items-center lg:mr-10 ">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="h-6 w-6 absolute ml-3 text-main"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="border rounded-3xl bg-gray-100 text-black my-5 pl-12 pr-5 h-14 lg:w-full w-[90%] focus:outline-none text-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div
              className={`overflow-auto h-screen ${
                isSingleRequest ? "h-screen" : ""
              } rounded-lg w-full`}
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="bg-gray-200">
                    <th className="w-10 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      #
                    </th>
                    <th className="whitespace-nowrap tracking-wider">
                      Government ID
                    </th>
                    <th className="w-48 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Name
                    </th>
                    <th className="w-52 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Contact Number
                    </th>
                    <th
                      className={`px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap`}
                    >
                      Status{" "}
                      <div className="relative inline-block">
                        <button
                          onClick={toggleStatusDropdown}
                          className="text-main focus:outline-none ml-2"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faFilter}
                            className="h-4 w-4"
                          />
                        </button>
                        {isStatusDropdownOpen && (
                          <div className="absolute right-0 overflow-auto bg-white border text-start border-gray-200 py-2 mt-2 shadow-lg rounded-lg">
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="verified"
                                checked={selectedStatusFilters.includes(
                                  "verified"
                                )}
                                onChange={handleStatusCheckboxChange}
                                className="mr-2"
                              />
                              Verified
                            </label>
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="unverified"
                                checked={selectedStatusFilters.includes(
                                  "unverified"
                                )}
                                onChange={handleStatusCheckboxChange}
                                className="mr-2"
                              />
                              Unverified
                            </label>
                          </div>
                        )}
                      </div>
                    </th>
                    <th
                      className={`px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap`}
                    >
                      Role
                      <div className="relative inline-block">
                        <button
                          onClick={toggleRoleDropdown}
                          className="text-main focus:outline-none ml-2"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faFilter}
                            className="h-4 w-4"
                          />
                        </button>
                        {isRoleDropdownOpen && (
                          <div className="absolute right-0 bg-white border border-gray-200 py-2 mt-2 shadow-lg rounded-lg text-start">
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="user"
                                checked={selectedRoleFilters.includes("user")}
                                onChange={handleRoleCheckboxChange}
                                className="mr-2"
                              />
                              User
                            </label>
                            <label className="block px-4 py-2">
                              <input
                                type="checkbox"
                                value="admin"
                                checked={selectedRoleFilters.includes("admin")}
                                onChange={handleRoleCheckboxChange}
                                className="mr-2"
                              />
                              Admin
                            </label>
                          </div>
                        )}
                      </div>
                    </th>
                    <th className="w-56 px-3 py-5 text-base font-semibold tracking-wider text-center whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr className="">
                      <td colSpan="8">
                        <Skeleton active />
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr className="h-[50vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No Records Yet.
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr className="h-[50vh]">
                      <td
                        colSpan="8"
                        className="p-3 text-lg text-gray-700 text-center"
                      >
                        No records found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.userID}>
                        <td className="border-b-2 py-3 border-gray-200 text-center">
                          {record.userID}
                        </td>
                        <td className="border-b-2 py-3 border-gray-200 text-center">
                          {record.userGovernmentID}
                        </td>
                        <td className=" border-b-2 py-3 whitespace-nowrap border-gray-200 text-center">
                          {`${record.userFirstName} ${record.userLastName}`}
                        </td>
                        <td className="border-b-2 py-3 whitespace-nowrap border-gray-200 text-center">
                          {record.userEmail}
                        </td>
                        <td className="border-b-2 py-3 border-gray-200 text-center">
                          {record.userContactNumber}
                        </td>
                        <td className="border-b-2 py-3 border-gray-200 text-center">
                          {record.userStatus}
                        </td>
                        <td className="border-b-2 py-3 border-gray-200 text-center">
                          {record.role}
                        </td>
                        <td className="border-b-2 py-3 border-gray-200 text-center">
                          <div className="flex items-center justify-center">
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
                              icon={
                                <QuestionCircleOutlined
                                  style={{ color: "red" }}
                                />
                              }
                              okButtonProps={{
                                className:
                                  "border-2 border-gray-200 text-black",
                                size: "large",
                              }}
                              cancelButtonProps={{
                                className:
                                  "border-2 border-gray-200 text-black",
                                size: "large",
                              }}
                            >
                              <button className="ml-1 text-white bg-red-700 rounded-lg px-3 py-2 text-lg font-medium">
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </Popconfirm>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <nav className="mr-auto lg:ml-56">
            <ul className="flex gap-2">
              <li className="flex-auto ml-10 lg:ml-20 mr-5">
                Page {currentPage} of {npage}
              </li>
              <li>
                <a
                  href="#"
                  onClick={prePage}
                  className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={nextPage}
                  className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </HelmetProvider>
  );

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  //function changeCPage(id) {
  //setCurrentPage(id);
  //}
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default UsersList;
