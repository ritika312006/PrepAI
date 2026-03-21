function Loader() {
  return (
    <div
      style={{
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          border: "4px solid #ddd",
          borderTop: "4px solid #4f46e5",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}
      ></div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Loader;