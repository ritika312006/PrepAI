function SectionCard(props) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        ...props.style
      }}
    >
      {props.children}
    </div>
  );
}

export default SectionCard;