function ActivityItem(props) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        marginBottom: "12px"
      }}
    >
      <h4 style={{ margin: 0, color: "#111827" }}>{props.title}</h4>
      <p style={{ margin: "6px 0 0 0", color: "#6b7280", fontSize: "14px" }}>
        {props.time}
      </p>
    </div>
  );
}

export default ActivityItem;