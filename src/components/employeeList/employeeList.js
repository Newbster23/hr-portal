import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosAPI } from '../../axios';
import ReactPaginate from 'react-paginate';
import './employeeList.css';

const EmployeeList = () => {
    const navigate = useNavigate()

  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await axiosAPI.get('api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewDetails = (employee) => {
    const {id, email, firstname, middlename, lastname } = employee;
    const folder = email + '_' + firstname + '_' + middlename + '_' + lastname;
    navigate(`/home/viewDetails?id=${id}&folder=${folder}`);
  };
  

  const offset = currentPage * itemsPerPage;
  const paginatedEmployees = (Array.isArray(employees)) ? (employees.slice(offset, offset + itemsPerPage)): [];

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className='employee-list-container'>
    <h2>Employees List</h2><br/>
    <div className='listContainer'>
      <div className="table-row header">
        <div className="table-cell">Name</div>
        <div className="table-cell">Email</div>
        <div className="table-cell">Date of Birth</div>
        <div className="table-cell">Action</div>
      </div>
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        paginatedEmployees.map((employee, index) => (
          <div className="table-row" key={index}>
            <div className="table-cell">
              {employee.firstname + ' ' + employee.middlename + ' ' + employee.lastname}
            </div>
            <div className="table-cell">{employee.email}</div>
            <div className="table-cell">{employee.date_of_birth.slice(0, 10)}</div>
            <div className="table-cell">
      <button className='btn' onClick={() => { handleViewDetails(employee) }} >View Details</button>
      </div>
          </div>
        ))
      )}
      <div className="pagination">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={Math.ceil(employees.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    </div>
    </div>
  );
};

export default EmployeeList;
