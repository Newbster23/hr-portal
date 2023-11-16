import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAPI } from "../../axios";
import "./viewDetails.css";
import DocList from "../docList/docList";
import back from "../../images/back.png";
import Loader from "../loader/Loader";

const ViewDetails = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const folder = queryParams.get("folder");

  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const response = await axiosAPI.get(`api/employeeDetails/${id}`);
      if (response.data.status === 200) {
        setDetails(response.data.data);
        setError(null);
      } else {
        setError("Failed to get the details");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to get the details");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  const goBack = () => {
    // Go back to the previous page when the "Back" link is clicked
    navigate(-1);
  };

  const personalDetails = details.personalDetails
    ? details.personalDetails[0]
    : "";
  const qualificationDetails = details.qualificationDetails
    ? details.qualificationDetails
    : [];
  const professionalDetails = details.professionalDetails
    ? details.professionalDetails
    : [];

  const qualificationlabels = [
    "Degree",
    "University",
    "Year of Passing",
    "Percentage",
  ];

  const experiencelabels = [
    "Organisation Name",
    "Position Held",
    "Start date",
    "End Date",
    "Last Drawn salary",
  ];

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

  return (
    <div style={{ backgroundColor: "whitesmoke" }}>
      <div className="back-link" onClick={goBack}>
        <img className="back-icon" src={back} alt="Back" />
        Back
      </div>

      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <div className="error-message">
          <div className="no-results">{error}</div>
        </div>
      ) : (
        <div className="detailsContainer">
          <div className="name-row">
            <u className="underline">
              <h2>
                {personalDetails.firstname?.toUpperCase() +
                  " " +
                  personalDetails.middlename?.toUpperCase() +
                  " " +
                  personalDetails.lastname?.toUpperCase()}
              </h2>
            </u>
          </div>
          <div className="section">
            <h4 className="sectionHeading">PERSONAL DETAILS</h4>
            {[
              {
                items: [
                  { label: "Gender", value: personalDetails.gender },
                  {
                    label: "Date of Birth",
                    value: formatDate(personalDetails.date_of_birth),
                  },
                  { label: "Blood Group", value: personalDetails.blood_group },
                  {
                    label: "Marital status",
                    value: personalDetails.marital_status,
                  },
                ],
              },
              {
                items: [
                  {
                    label: "Phone number",
                    value: personalDetails.phone_number,
                  },
                  { label: "Email", value: personalDetails.email },
                  {
                    label: "Aadhaar number",
                    value: personalDetails.aadhaar_number,
                  },
                  { label: "Pan Number", value: personalDetails.pan_number },
                ],
              },
              {
                items: [
                  { label: "Address", value: personalDetails.address },
                  { label: "City", value: personalDetails.city },
                  {
                    label: "State",
                    value: `${personalDetails.state}`,
                  },
                  {
                    label: "Pincode",
                    value: `${personalDetails.pincode}`,
                  },
                ],
              },
              {
                items: [
                  {
                    label: "Emergency Contact Name",
                    value: personalDetails.emergency_contact_name,
                  },
                  {
                    label: "Emergency Contact Number",
                    value: personalDetails.emergency_contact_number,
                  },
                  {
                    label: "Relation with Employee",
                    value: personalDetails.relation_with_employee,
                  },
                ],
              },
            ].map((section, sectionIndex) => (
              <div className="row" key={sectionIndex}>
                {section.items.map((item, itemIndex) => (
                  <div className="column" key={itemIndex}>
                    <div className="label">{item.label}</div>
                    <div className="value">{item.value}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="section">
            <h4 className="sectionHeading">EDUCATION QUALIFICATION</h4>
            {qualificationDetails.map((qualification, sectionIndex) => (
              <div className="row" key={sectionIndex}>
                {Object.entries(qualification).map(
                  ([label, value], itemIndex) => (
                    <div className="column" key={itemIndex}>
                      <div className="label">
                        {qualificationlabels[itemIndex]}
                      </div>
                      <div className="value">{value}</div>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>

          <div className="section">
            <h4 className="sectionHeading">PROFESSIONAL EXPERIENCE</h4>
            {professionalDetails.map((experience, sectionIndex) => (
              <div className="professional-row" key={sectionIndex}>
                {Object.entries(experience).map(([label, value], itemIndex) => (
                  <div className="column" key={itemIndex}>
                    <div className="label">{experiencelabels[itemIndex]}</div>
                    <div className="value">
                      {experiencelabels[itemIndex] === "Start date" ||
                      experiencelabels[itemIndex] === "End Date"
                        ? formatDate(value)
                        : value}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="section">
            <h4 className="sectionHeading">DOCUMENTS</h4>
            <DocList className="row" folder={folder}></DocList>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;
