import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
} from "mdb-react-ui-kit";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(4);

  const sortOptions = ["name", "surname", "mail", "phone", "adress", "status"];

  useEffect(() => {
    loadUserData(0, 4, 0);
  }, []);

  const loadUserData = async (start, end, increase) => {
    await axios
      .get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
      .then((response) => {
        setData(response.data);
        setCurrentPage(currentPage + increase);
      })
      .catch((err) => console.log(err));
  };
  console.log("data", data);
  //////////////////////Functions////////////////////////////////////////////
  const handleReset = () => {
    loadUserData(0,4,0);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    return await axios
      .get(`http://localhost:5000/users?q=${value}`)
      .then((res) => {
        setData(res.data);
        setValue("");
      })
      .catch((err) => console.log(err));
  };

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    return await axios
      .get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleFilter = async (value) => {
    return await axios
      .get(`http://localhost:5000/users?status=${value}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const renderPagination = () => {
    if (currentPage === 0) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUserData(4, 8, 1)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else if (currentPage < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData((currentPage - 1) * 4, currentPage * 4, -1)
              }
            >
              Previous
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>

          <MDBPaginationItem>
            <MDBBtn
              onClick={() =>
                loadUserData((currentPage + 1) * 4, (currentPage + 2) * 4, 1)
              }
            >
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      );
    } else {
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUserData(4, 8, -1)}>Previous</MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      );
    }
  };

  //////////////////////////////////////////////////////
  return (
    <MDBContainer>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search Name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></input>
        <MDBBtn type="submit" color="dark" onClick={(e) => handleSearch(e)}>
          Search
        </MDBBtn>
        <MDBBtn className="mx-2" color="info" onClick={() => handleReset()}>
          Reset
        </MDBBtn>
      </form>
      <div style={{ marginTop: "100px", color: "grey" }}>
        <h2 className="text-center">
          Search, Filter, Sort and Pagination with Json{" "}
        </h2>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Name</th>
                  <th scope="col">Surname</th>
                  <th scope="col">Mail</th>
                  <th scope="col">Phone</th>
                  <th scope="col">adress</th>
                  <th scope="col">Status</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className="align-center mb-0">
                  <tr>
                    <td colSpan={8} className="text-center mb-0">
                      No Data Found
                    </td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.surname}</td>
                      <td>{item.mail}</td>
                      <td>{item.phone}</td>
                      <td>{item.adress}</td>
                      <td>{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "250px",
            alignContent: "center",
          }}
        >
          {renderPagination()}
        </div>
      </div>
      <MDBRow>
        <MDBCol size="8">
          <h5>Sort By :</h5>
          <select
            style={{ width: "50%", borderRadius: "2px", height: "35px" }}
            onChange={(e) => handleSort(e)}
            value={sortValue}
          >
            <option>Please select value</option>\
            {sortOptions.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </select>
        </MDBCol>
        <MDBCol size="4">
          <h5>Filter By Status</h5>
          <MDBBtnGroup>
            <MDBBtn color="success" onClick={() => handleFilter("Active")}>
              Active
            </MDBBtn>
            <MDBBtn
              color="danger"
              style={{ marginLeft: "2px" }}
              onClick={() => handleFilter("Inactive")}
            >
              Inactive
            </MDBBtn>
          </MDBBtnGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
