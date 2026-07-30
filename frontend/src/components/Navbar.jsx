import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#020617",
        color: "#fff",
      }}
    >
      <h2 style={{ margin: 0 }}>🛡 Cyber Security Scanner</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={buttonStyle}
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/scan")}
          style={buttonStyle}
        >
          Scan Website
        </button>

        <button
          onClick={() => navigate("/reports")}
          style={buttonStyle}
        >
          My Reports
        </button>

        <button
          onClick={handleLogout}
          style={{
            ...buttonStyle,
            backgroundColor: "#dc3545",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const buttonStyle = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  backgroundColor: "#2563eb",
  color: "#fff",
  fontSize: "14px",
};

export default Navbar;