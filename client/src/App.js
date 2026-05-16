import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import "./App.css";

function App() {
  // ================= STATES =================
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");

  // ================= CSV FILE HANDLER =================
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    Papa.parse(file, {
      skipEmptyLines: true,

      complete: function (results) {
        const extractedEmails = results.data
          .flat()
          .filter((email) => email.includes("@"));

        setEmails(extractedEmails);
      },
    });
  };

  // ================= DROPZONE =================
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,

    accept: {
      "text/csv": [".csv"],
    },
  });

  // ================= SEND EMAIL FUNCTION =================
  const sendEmails = async () => {
    try {
      const res = await axios.post("http://localhost:5000/send", {
        subject,
        text,
        emails,
      });

      setMessage(res.data.message);
    } catch (error) {
      setMessage("Failed to send emails");
    }
  };

  // ================= UI =================
  return (
    <div className="container">

      {/* ===== NAVBAR ===== */}
      <div className="navbar">
        <h1>BulkMail</h1>
      </div>

      {/* ===== HEADER ===== */}
      <div className="header">
        <h3>
          We can help your business with sending multiple emails at once
        </h3>
      </div>

      {/* ===== TITLE ===== */}
      <div className="upload-title">
        <h2>Drag and Drop your CSV file</h2>
      </div>

      {/* ===== FORM SECTION ===== */}
      <div className="form-container">

        {/* SUBJECT INPUT */}
        <input
          type="text"
          placeholder="Enter Email Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="subject-input"
        />

        {/* EMAIL BODY */}
        <textarea
          placeholder="Enter the Email text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* FILE DROPZONE */}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag and Drop your file here</p>
        </div>

        {/* EMAIL COUNT */}
        <h3>Total Emails in the file: {emails.length}</h3>

        {/* SEND BUTTON */}
        <button onClick={sendEmails}>
          Send
        </button>

        {/* STATUS MESSAGE */}
        {message && (
          <p className="message">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default App;