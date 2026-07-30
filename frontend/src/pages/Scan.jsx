import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Scan() {
  const navigate = useNavigate();

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleScan = async () => {
    if (!websiteUrl.trim()) {
      alert("Please enter a website URL.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/scan",
        { websiteUrl: websiteUrl.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReport(res.data.report);
    } catch (error) {
      alert(error.response?.data?.message || "Scan Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1>Website Security Scanner</h1>

        <br />

        <input
          type="text"
          placeholder="https://example.com"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          style={{
            width: "400px",
            padding: "10px",
            borderRadius: "5px",
          }}
        />

        <br />
        <br />

        <button
          onClick={handleScan}
          disabled={loading}
          style={{
            padding: "10px 25px",
            cursor: "pointer",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {loading ? "Scanning..." : "Scan Website"}
        </button>

        {report && (
          <div
            style={{
              marginTop: "30px",
              textAlign: "left",
              display: "inline-block",
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "8px",
              width: "600px",
              backgroundColor: "#f8fafc",
            }}
          >
            <h2>Scan Report</h2>

            <p>
              <strong>Website:</strong> {report.websiteUrl}
            </p>

            <p>
              <strong>Risk Score:</strong> {report.riskScore}
            </p>

            <p>
              <strong>Risk Level:</strong> {report.riskLevel}
            </p>

            <h3>Vulnerabilities</h3>

            <ul>
              {report.vulnerabilities?.length > 0 ? (
                report.vulnerabilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No vulnerabilities found.</li>
              )}
            </ul>

            <h3>Recommendations</h3>

            <p>
              {report.recommendations || "No recommendations available."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Scan;