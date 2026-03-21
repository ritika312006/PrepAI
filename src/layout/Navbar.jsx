function Navbar(props) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px 24px",
        borderRadius: "18px",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "28px",
        border: "1px solid #eef2ff",
        gap: "20px"
      }}
    >
      <div>
        <h2 style={{ margin: 0, color: "#111827" }}>{props.title}</h2>
        <p style={{ margin: "6px 0 0 0", color: "#6b7280" }}>
          {props.subtitle}
        </p>
      </div>

      <input
        type="text"
        placeholder="Search..."
        style={{
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          outline: "none",
          width: "220px"
        }}
      />

      <div
        style={{
          background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
          color: "#5b21b6",
          padding: "12px 18px",
          borderRadius: "12px",
          fontWeight: "700"
        }}
      >
        Ritika
      </div>
    </div>
  );
}

export default Navbar;