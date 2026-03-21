function InsightCard(props) {
  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: "14px",
        padding: "18px"
      }}
    >
      <h4 style={{ margin: 0, color: "#111827" }}>{props.title}</h4>
      <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
        {props.text}
      </p>
    </div>
  );
}

export default InsightCard;