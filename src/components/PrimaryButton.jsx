function PrimaryButton({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 18px",
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: "0 6px 14px rgba(79,70,229,0.25)",
        ...style
      }}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;