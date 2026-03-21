function FocusCard(props) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "18px",
        borderRadius: "14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        marginBottom: "12px"
      }}
    >
      <h4 style={{ margin: 0, color: "#111827" }}>{props.title}</h4>
      <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
        {props.desc}
      </p>
    </div>
  );
}

export default FocusCard;