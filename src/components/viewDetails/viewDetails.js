import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAPI } from "../../axios";
import "./viewDetails.css";
import DocList from "../docList/docList";
import back from "../../images/back.png";

const ViewDetails = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const folder = queryParams.get("folder");

  const [details, setDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAPI.get(`api/employeeDetails/${id}`);
        setDetails(response.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
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

  function extractFullDate(dateString) {
    const date = new Date(dateString);
    const formattedDateIST = date.toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });
    return formattedDateIST;
  }

  return (
    <div style={{ backgroundColor: "whitesmoke" }}>
      <div className="back-link" onClick={goBack}>
        <img className="back-icon" src={back} alt="Back" />
        Back
      </div>
      <div className="detailsContainer">
        <div className="row">
          <h3>
            {personalDetails.firstname?.toUpperCase() +
              " " +
              personalDetails.middlename?.toUpperCase() +
              " " +
              personalDetails.lastname?.toUpperCase()}
          </h3>
        </div>
        <div className="section">
          <h4 className="sectionHeading">Personal Details</h4>
          {[
            {
              items: [
                { label: "Gender", value: "Female" },
                {
                  label: "Date of Birth",
                  value: extractFullDate(personalDetails.date_of_birth),
                },
                { label: "Phone number", value: personalDetails.phone_number },
                { label: "Email", value: personalDetails.email },
              ],
            },
            {
              items: [
                { label: "Blood Group", value: personalDetails.blood_group },
                {
                  label: "Marital status",
                  value: personalDetails.marital_status,
                },
                {
                  label: "Emergency Contact Name",
                  value: personalDetails.emergency_contact_name,
                },
                {
                  label: "Emergency Contact Number",
                  value: personalDetails.emergency_contact_number,
                },
              ],
            },
            {
              items: [
                {
                  label: "Relation with Employee",
                  value: personalDetails.relation_with_employee,
                },
                { label: "Address", value: personalDetails.address },
                { label: "City", value: personalDetails.city },
                {
                  label: "State and Pincode",
                  value: `${personalDetails.state} - ${personalDetails.pincode}`,
                },
              ],
            },
          ].map((section, sectionIndex) => (
            <div className="row" key={sectionIndex}>
              <div className="row-label">
                {section.items.map((item, itemIndex) => (
                  <div className="row-data" key={itemIndex}>
                    <div className="data-label">{item.label}</div>
                    <div className="data-value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="section">
          <h4 className="sectionHeading">Education Qualification</h4>
          {qualificationDetails.map((qualification, sectionIndex) => (
            <div className="row" key={sectionIndex}>
              <div className="row-label">
                {Object.entries(qualification).map(
                  ([label, value], itemIndex) => (
                    <div className="row-data" key={itemIndex}>
                      <div className="data-label">
                        {qualificationlabels[itemIndex]}
                      </div>
                      <div className="data-value">{value}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="section">
          <h4 className="sectionHeading">Professional Experience</h4>
          {professionalDetails.map((experience, sectionIndex) => (
            <div className="row" key={sectionIndex}>
              <div className="row-label">
                {Object.entries(experience).map(([label, value], itemIndex) => (
                  <div className="row-data" key={itemIndex}>
                    <div className="data-label">
                      {experiencelabels[itemIndex]}
                    </div>
                    <div className="data-value">
                      {experiencelabels[itemIndex] === "Start date" ||
                      experiencelabels[itemIndex] === "End Date"
                        ? extractFullDate(value)
                        : value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="section">
          <h4 className="sectionHeading">Documents</h4>
          <DocList className="row" folder={folder}></DocList>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
