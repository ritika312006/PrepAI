function PageLayout({ title, subtitle, children }) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        padding: "32px",
        boxSizing: "border-box",
        overflowX: "hidden"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            marginBottom: "28px",
            padding: "24px",
            borderRadius: "22px",
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            backdropFilter: "blur(6px)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap"
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#4f46e5",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase"
                }}
              >
                PrepAI Workspace
              </p>

              <h1
                style={{
                  margin: 0,
                  fontSize: "32px",
                  fontWeight: "800",
                  color: "#0f172a",
                  lineHeight: "1.2"
                }}
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  style={{
                    margin: "10px 0 0 0",
                    color: "#64748b",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    maxWidth: "720px"
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  backgroundColor: "#eef2ff",
                  color: "#4338ca",
                  fontWeight: "700",
                  fontSize: "13px"
                }}
              >
                Smart Practice
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "12px",
                  backgroundColor: "#ecfeff",
                  color: "#0f766e",
                  fontWeight: "700",
                  fontSize: "13px"
                }}
              >
                Track Progress
              </div>
            </div>
          </div>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}

export default PageLayout;