import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1>Cyber Security Scanner</h1>

        <h2>Dashboard</h2>

        <p>Welcome! Choose an option below.</p>

        <br />

        <button
          onClick={() => navigate("/scan")}
          style={{
            padding: "12px 25px",
            margin: "10px",
            cursor: "pointer",
            width: "200px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#2563eb",
            color: "#fff",
            fontSize: "16px",
          }}
        >
          Scan Website
        </button>

        <br />

        <button
          onClick={() => navigate("/reports")}
          style={{
            padding: "12px 25px",
            margin: "10px",
            cursor: "pointer",
            width: "200px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#16a34a",
            color: "#fff",
            fontSize: "16px",
          }}
        >
          My Reports
        </button>
      </div>
    </>
  );
}

export default Dashboard;