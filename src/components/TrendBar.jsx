function TrendBar(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <div
        style={{
          height: "140px",
          width: "36px",
          backgroundColor: "#e5e7eb",
          borderRadius: "999px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: "100%",
            height: props.value,
            background: "linear-gradient(180deg, #8b5cf6, #4f46e5)",
            borderRadius: "999px"
          }}
        ></div>
      </div>

      <span style={{ fontSize: "13px", color: "#6b7280" }}>
        {props.label}
      </span>
    </div>
  );
}

export default TrendBar;