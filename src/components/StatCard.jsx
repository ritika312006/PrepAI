function StatCard(props) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "14px",
        width: "220px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}
    >
      <h3 style={{ margin: 0, fontSize: "16px", color: "#6b7280" }}>
        {props.title}
      </h3>

      <p
        style={{
          marginTop: "12px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#111827"
        }}
      >
        {props.value}
      </p>
    </div>
  );
}

export default StatCard;