import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAPI } from "../../axios";
import ReactPaginate from "react-paginate";
import "./employeeList.css";
import Loader from "../loader/Loader";

const EmployeeList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [dobFilter, setDobFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axiosAPI.get("api/employees");
      if (response.data.status === 200) {
        setEmployees(response.data.data);
        setError(null);
      } else {
        setError("Failed to get the list of employees");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to get the list of employees");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (date) => {
    const retrievedDate = new Date(date); // This date is already in UTC.
    const year = retrievedDate.getFullYear();
    const month = retrievedDate.getMonth() + 1; // Month is zero-based, so add 1.
    const day = retrievedDate.getDate();
    const formattedDate = `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
    return formattedDate;
  };

  const handleViewDetails = (employee) => {
    const { id, email, firstname, middlename, lastname } = employee;
    const folder = email + "_" + firstname + "_" + middlename + "_" + lastname;
    navigate(`/home/viewDetails?id=${id}&folder=${folder}`);
  };

  const filtersApplied = nameFilter || emailFilter || phoneFilter || dobFilter;

  const filteredEmployees = employees.filter((employee) => {
    const nameMatch = employee.firstname
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const emailMatch = employee.email
      .toLowerCase()
      .includes(emailFilter.toLowerCase());
    const phoneMatch = employee.phone_number.includes(phoneFilter);
    const dobMatch = dobFilter
      ? formatDate(employee.date_of_birth) === formatDate(dobFilter)
      : true;
    return nameMatch && emailMatch && phoneMatch && dobMatch;
  });

  const itemsPerPage = 10;
  const totalItems = filtersApplied
    ? filteredEmployees.length
    : employees.length;
  const offset = currentPage * itemsPerPage;
  const paginatedFilteredEmployees = Array.isArray(filteredEmployees)
    ? filteredEmployees.slice(offset, offset + itemsPerPage)
    : [];

  const paginatedNonFilteredEmployees = Array.isArray(employees)
    ? employees.slice(offset, offset + itemsPerPage)
    : [];

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  
  return (
    <div className="employee-list-container">
      <h2>Employees List</h2>
      <br />
      <div className="grid-container">
        <div>
          <label htmlFor="nameFilter">Name</label>
          <input
            type="text"
            id="nameFilter"
            placeholder="Enter name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="emailFilter">Email</label>
          <input
            type="text"
            id="emailFilter"
            placeholder="Enter email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="phoneFilter">Phone Number</label>
          <input
            type="text"
            id="phoneFilter"
            placeholder="Enter phone number"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="dobFilter">Date of Birth</label>
          <input
            type="date"
            id="dobFilter"
            value={dobFilter}
            onChange={(e) => setDobFilter(e.target.value)}
          />
        </div>
        <div className="resetBtn">
          <button
            id="resetButton"
            onClick={() => {
              setNameFilter("");
              setEmailFilter("");
              setPhoneFilter("");
              setDobFilter("");
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="listContainer">
        <div className="table-row header">
          <div className="table-cell">NAME</div>
          <div className="table-cell">EMAIL</div>
          <div className="table-cell">PHONE NUMBER</div>
          <div className="table-cell">DATE OF BIRTH</div>
          <div className="table-cell">ACTION</div>
        </div>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="no-results">{error}</div>
        ) : filteredEmployees.length > 0 ? (
          paginatedFilteredEmployees.map((employee, index) => (
            <div className="table-row" key={index}>
              <div className="table-cell">
                {employee.firstname +
                  " " +
                  employee.middlename +
                  " " +
                  employee.lastname}
              </div>
              <div className="table-cell">{employee.email}</div>
              <div className="table-cell">{employee.phone_number}</div>
              <div className="table-cell">
                {formatDate(employee.date_of_birth)}
              </div>
              <div className="table-cell">
                <button
                  className="btn"
                  onClick={() => {
                    handleViewDetails(employee);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : filteredEmployees.length === 0 ? (
          <div className="no-results">No results found.</div>
        ) : employees.length > 0 ? (
          // No filters applied, display original paginated data
          paginatedNonFilteredEmployees.map((employee, index) => (
            <div className="table-row" key={index}>
              <div className="table-cell">
                {employee.firstname +
                  " " +
                  employee.middlename +
                  " " +
                  employee.lastname}
              </div>
              <div className="table-cell">{employee.email}</div>
              <div className="table-cell">{employee.phone_number}</div>
              <div className="table-cell">
                {formatDate(employee.date_of_birth)}
              </div>
              <div className="table-cell">
                <button
                  className="btn"
                  onClick={() => {
                    handleViewDetails(employee);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No data available.</div>
        )}

        {totalItems > itemsPerPage && totalItems > 0 ? (
          <div className="pagination">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(totalItems / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EmployeeList;
