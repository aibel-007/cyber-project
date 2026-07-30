import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Reports() {
  const [reports, setReports] = useState([]);

  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    try {
      const res = await API.get("/scan/my-reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(res.data.reports);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const deleteReport = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/scan/report/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Report Deleted");

      fetchReports();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const downloadPDF = async (id) => {
    try {
      const response = await API.get(`/scan/report/${id}/pdf`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${id}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to download PDF");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "40px",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          My Scan Reports
        </h1>

        {reports.length === 0 ? (
          <p style={{ textAlign: "center" }}>No reports found.</p>
        ) : (
          reports.map((report) => (
            <div
              key={report._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "20px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3>{report.websiteUrl}</h3>

              <p>
                <strong>Risk Score:</strong> {report.riskScore}
              </p>

              <p>
                <strong>Risk Level:</strong> {report.riskLevel}
              </p>

              <p>
                <strong>Recommendations:</strong>{" "}
                {report.recommendations || "No recommendations available."}
              </p>

              <div style={{ marginTop: "15px" }}>
                <button
                  onClick={() => downloadPDF(report._id)}
                  style={{
                    marginRight: "10px",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Download PDF
                </button>

                <button
                  onClick={() => deleteReport(report._id)}
                  style={{
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Reports;