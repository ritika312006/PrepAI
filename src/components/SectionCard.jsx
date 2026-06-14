function SectionCard(props) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        border: "1px solid #eef2ff",
        transition: "0.3s ease",
        cursor: "pointer",
        ...props.style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {props.children}
    </div>
  );
}

export default SectionCard;