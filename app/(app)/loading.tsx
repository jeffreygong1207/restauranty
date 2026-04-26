export default function Loading() {
  return (
    <div className="page">
      <div
        style={{
          height: 36,
          width: 220,
          background: "var(--bg-sunken)",
          borderRadius: 8,
          marginBottom: 18,
          opacity: 0.7,
        }}
      />
      <div
        className="grid-3"
        style={{ gap: 14, marginBottom: 18 }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="card"
            style={{ height: 96, background: "var(--bg-sunken)", opacity: 0.6 }}
          />
        ))}
      </div>
      <div
        className="card"
        style={{ height: 320, background: "var(--bg-sunken)", opacity: 0.5 }}
      />
    </div>
  );
}
