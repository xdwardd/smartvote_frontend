import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

const OCRScanner = () => {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    licenseNumber: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setOcrText("");
      setDetails({ firstName: "", lastName: "", licenseNumber: "" });
    }
  };

  const handleScan = () => {
    if (!image) return;
    setLoading(true);
    setErrorMessage(""); // Reset error before starting new scan

    Tesseract.recognize(image, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setOcrText(text);
        const extracted = extractDetails(text);
        setDetails(extracted);

        // Check for extraction failure
        if (
          extracted.firstName === "" ||
          extracted.lastName === "" ||
          extracted.licenseNumber === ""
        ) {
          setErrorMessage(
            "Unable to extract details. Make sure the uploaded photo is clear."
          );
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };


  
  function extractDetails(text) {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    let lastName = "";
    let firstName = "";
    let licenseNumber = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      // Handle name with comma format
      if (line.includes("last name") && lines[i + 1]) {
        const nameLine = lines[i + 1].replace(/[^A-Z,\s]/gi, "").trim();
        const commaParts = nameLine.split(",");
        if (commaParts.length >= 2) {
          lastName = commaParts[0].trim();
          const firstNameParts = commaParts[1].trim().split(" ");
          firstName = firstNameParts[0] || "";
        }
      }

      // Extract license number (with flexible format)
      if (line.includes("license") || line.includes("license no")) {
        for (let j = i + 1; j <= i + 3 && j < lines.length; j++) {
          const match = lines[j].match(/[A-Z0-9\-]{6,}/);
          if (match) {
            licenseNumber = match[0];
            break;
          }
        }
      }
    }

    return { firstName, lastName, licenseNumber };
    }

  
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>OCR ID Scanner</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && (
        <>
          <img
            src={image}
            alt="ID Preview"
            style={{ maxWidth: "100%", marginTop: "1rem" }}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {loading ? "Scanning..." : "Extract Text"}
          </button>
        </>
      )}

      {ocrText && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Extracted Text:</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f0f0f0",
              padding: "1rem",
            }}
          >
            {ocrText}
          </pre>
        </div>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {(details.firstName || details.lastName || details.licenseNumber) && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Parsed Info:</h3>
          <p>
            <strong>First Name:</strong> {details.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {details.lastName}
          </p>
          <p>
            <strong>License Number:</strong> {details.licenseNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default OCRScanner;
