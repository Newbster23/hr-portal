import React, { useEffect, useState } from "react";
import { axiosAPI } from "../../axios";
import "./docList.css";
import download from "../../images/download.png";

const DocList = (props) => {
  const { folder } = props;
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const fetchDoc = async (folder) => {
    try {
      const response = await axiosAPI.get(`api/documents/${folder}`);
      if (response.data.status === 500) {
        setError("Failed to get the documents");
      } else {
        setDocuments(response.data);
        setError(null);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to get the documents");
    }
  };

  useEffect(() => {
    fetchDoc(folder);
  }, [folder]);

  const docs = documents ? documents : [];

  const getFileName = (filename) => {
    // Split the filename by "." to remove the extension
    const nameWithoutExtension = filename.split(".").slice(0, -1).join(".");

    // Capitalize the first letter
    const capitalizedName =
      nameWithoutExtension.charAt(0).toUpperCase() +
      nameWithoutExtension.slice(1);

    // Replace underscores with spaces
    const formattedName = capitalizedName.replace(/_/g, " ");

    return formattedName;
  };

  return (
    <div className="docListContainer">
      {error ? (
        <div className="no-results">{error}</div>
      ) : (
        docs.map((doc, index) => (
          <div className="doc-column" key={index}>
            <div className="doc-download">
              <a
                href={`${process.env.REACT_APP_API_HOST}/api/download/${folder}/${doc}`}
                download
              >
                <img
                  src={download}
                  height="20px"
                  width="20px"
                  alt="download"
                ></img>
              </a>
            </div>
            <div className="doc-name">{doc}</div>
            <label>{getFileName(doc)}</label>
          </div>
        ))
      )}
    </div>
  );
};

export default DocList;
