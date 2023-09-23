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
import {
  LeftOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";

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
      const response = await axios.get("http://127.0.0.1:8000/api/users-list");

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
      item.office?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.division?.toString().includes(searchQuery.toLowerCase()) ||
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

  const [pageInput, setPageInput] = useState("");

  const goToPage = () => {
    const pageNumber = parseInt(pageInput);

    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= npage) {
      setCurrentPage(pageNumber);
      setPageInput(""); // Clear the input field after changing the page
    } else {
      // Handle invalid page number input, e.g., show an error message to the user
      message.error("Invalid page number. Please enter a valid page number.");
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputBlur = () => {
    goToPage(); // Trigger page change when the input field loses focus
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === "Enter") {
      goToPage(); // Trigger page change when the Enter key is pressed
    }
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
        />
        {isUpdateUserModalVisible && selectedUserForUpdate && (
          <UpdateUserModal
            visible={isUpdateUserModalVisible}
            onCancel={() => setUpdateUserModalVisible(false)}
            onOk={() => setUpdateUserModalVisible(false)}
            userData={selectedUserForUpdate}
            isLargeScreen={isLargeScreen}
          />
        )}
        <div className="flex flex-col lg:flex-grow items-center justify-center lg:items-stretch lg:justify-start lg:pb-10 bg-white gap-2 w-full">
          <div
            className={`overflow-x-auto w-[90%] lg:w-[80%] large:w-[85%] large:h-[90vh] h-auto lg:ml-auto lg:mx-4 mt-20 lg:mt-0  justify-center lg:items-stretch lg:justify-start  border-0 border-gray-400 rounded-lg flex flex-col items-center font-sans`}
          >
            <div className="flex lg:flex-row text-center flex-col w-full lg:pl-4 items-center justify-center shadow-xl bg-white  text-white rounded-t-lg lg:gap-4 gap-2">
              <h1 className="flex text-black items-center lg:text-2xl font-semibold ">
                Users List
              </h1>
              <div className="relative flex items-center lg:mr-auto lg:ml-4 ">
                <FontAwesomeIcon
                  icon={faSearch}
                  className={`w-4 h-4 absolute ml-3 text-main`}
                />
                <input
                  type="text"
                  placeholder="Search"
                  className={`border rounded-3xl bg-gray-100 text-black my-5 pl-12 pr-5 w-full focus:outline-none text-base h-10`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center gap-4 mr-4 mb-4 lg:mb-0">
                <div className="flex lg:flex-row flex-col items-center text-black gap-2">
                  <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
                    <span className="font-semibold">From:</span>
                    <input
                      type="date"
                      className="p-2 w-36 outline-none border-none bg-transparent"
                    />
                  </div>
                  <div className="flex items-center px-2 justify-center rounded-md border-2 border-gray-400">
                    <span className="font-semibold">To:</span>
                    <input
                      type="date"
                      className="p-2 w-36 outline-none border-none bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`overflow-auto h-auto shadow-xl  pb-5  rounded-lg w-full`}
            >
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="bg-secondary text-white ">
                    <th className="w-10 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      #
                    </th>
                    <th className="py-5 large:py-6 text-sm large:text-base text-left whitespace-nowrap tracking-wider">
                      Government ID
                    </th>
                    <th className="w-48 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Name
                    </th>
                    <th className=" px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Office
                    </th>
                    <th className=" px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Division
                    </th>
                    <th className="w-52 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap">
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
                      className={`px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap`}
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
                    <th className="w-56 px-3 py-5 large:py-6 text-sm large:text-base font-semibold tracking-wider text-left whitespace-nowrap">
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
                      <tr
                        key={record.userID}
                        className={`lg:text-sm text-base`}
                      >
                        <td className="border-b-2 px-3 py-2 large:py-3 border-gray-200 text-left">
                          {record.userID}
                        </td>
                        <td className="border-b-2 px-3 py-2 large:py-3 border-gray-200 text-left">
                          {record.userGovernmentID}
                        </td>
                        <td className=" border-b-2 py-2 large:py-3 whitespace-nowrap border-gray-200 text-left">
                          {`${record.userFirstName} ${record.userLastName}`}
                        </td>
                        <td className="border-b-2 px-3 py-2 large:py-3 whitespace-nowrap border-gray-200 text-left">
                          {!record.office ? "Null" : record.office}
                        </td>
                        <td className="border-b-2 px-3 py-2 large:py-3 whitespace-nowrap border-gray-200 text-left">
                          {!record.division ? "Null" : record.division}
                        </td>
                        <td className="border-b-2 py-2 large:py-3 whitespace-nowrap border-gray-200 text-left">
                          {record.userEmail}
                        </td>
                        <td className="border-b-2 py-2 large:py-3 border-gray-200 text-left">
                          {record.userContactNumber}
                        </td>
                        <td className="border-b-2 py-2 large:py-3 border-gray-200 text-left">
                          {record.userStatus}
                        </td>
                        <td className="border-b-2 py-2 large:py-3 border-gray-200 text-left">
                          {record.role}
                        </td>
                        <td className="border-b-2 py-2 large:py-3 border-gray-200 text-left">
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
            <nav className="my-4 py-4 mr-auto">
              <ul className="flex gap-2 items-center">
                <li className="flex-auto ml-10 lg:ml-20 mr-2">
                  Page {currentPage} of {npage}
                </li>
                <li>
                  <a
                    href="#"
                    onClick={prePage}
                    className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                  >
                    <LeftOutlined />
                  </a>
                </li>
                <li className="flex items-center">
                  <input
                    type="number"
                    placeholder="Page"
                    className="border rounded-lg bg-gray-100 py-2 px-4 text-black w-24  text-center outline-none"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onBlur={handlePageInputBlur} // Trigger page change when the input field loses focus
                    onKeyPress={handlePageInputKeyPress} // Trigger page change when Enter key is pressed
                  />
                </li>
                <li>
                  <a
                    href="#"
                    onClick={nextPage}
                    className="pagination-link bg-main hover:bg-opacity-95 text-white font-bold py-2 px-4 rounded"
                  >
                    <RightOutlined />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
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
