import React, { useEffect, useState } from "react";
import { axiosAPI } from "../../axios";
import "./docList.css";
import download from "../../images/download.png";

const DocList = (props) => {
  const { folder } = props;
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const response = await axiosAPI.get(`api/documents/${folder}`);
        setDocuments(response.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchDoc();
  }, [folder]);

  const docs = documents ? documents : [];

  return (
    <div className="docListContainer">
      {docs.map((doc, index) => (
        <div className="doc-row" key={index}>
          <div className="doc-name">{doc}</div>
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
        </div>
      ))}
    </div>
  );
};

export default DocList;
