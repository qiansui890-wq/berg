import React from "react";

/**
 * Berg PC — AttorneyCard.
 * Attorney / team-member profile card: headshot (with branded initials fallback),
 * name, role, short bio, and optional credential tags. Used on the Team page,
 * in case-team rosters, and inside the portal/dashboard.
 */
export function AttorneyCard({
  name = "",
  role = "",
  bio = "",
  photo,
  credentials = [],
  href,
  orientation = "portrait", // "portrait" | "row"
  style,
}) {
  const [imgOk, setImgOk] = React.useState(Boolean(photo));
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const row = orientation === "row";

  const photoBlock = (
    <div
      style={{
        position: "relative",
        flex: "none",
        width: row ? 96 : "100%",
        height: row ? 96 : 248,
        borderRadius: row ? "var(--radius-pill)" : "var(--radius-lg)",
        overflow: "hidden",
        background:
          "linear-gradient(160deg, var(--navy-800), var(--navy-950))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: row ? 30 : 52,
          fontWeight: "var(--weight-semibold)",
          color: "var(--stone-400)",
          opacity: 0.65,
        }}
      >
        {initials}
      </span>
      {photo && imgOk ? (
        <img
          src={photo}
          alt={name}
          onError={() => setImgOk(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 22%",
          }}
        />
      ) : null}
    </div>
  );

  const body = (
    <div style={{ minWidth: 0 }}>
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: row ? 19 : 22,
          fontWeight: "var(--weight-semibold)",
          color: "var(--ink-900)",
          margin: "0 0 3px",
          letterSpacing: "-0.01em",
        }}
      >
        {name}
      </h3>
      <div
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 12,
          fontWeight: "var(--weight-semibold)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--stone-700)",
        }}
      >
        {role}
      </div>
      {!row ? (
        <div
          style={{
            width: 54,
            height: 3,
            background: "var(--stone-400)",
            margin: "12px 0 12px",
          }}
        />
      ) : null}
      {bio ? (
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--ink-600)",
            margin: row ? "8px 0 0" : "0 0 12px",
          }}
        >
          {bio}
        </p>
      ) : null}
      {credentials && credentials.length ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: bio ? 4 : 12,
          }}
        >
          {credentials.map((c) => (
            <span
              key={c}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 11,
                fontWeight: "var(--weight-medium)",
                letterSpacing: "0.02em",
                color: "var(--stone-700)",
                background: "var(--stone-100)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                padding: "3px 8px",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );

  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href}
      style={{
        display: row ? "flex" : "block",
        gap: row ? 16 : 0,
        alignItems: row ? "center" : undefined,
        textAlign: "left",
        textDecoration: "none",
        background: "#fff",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: row ? 16 : 16,
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
    >
      {photoBlock}
      {row ? body : <div style={{ marginTop: 16 }}>{body}</div>}
    </Tag>
  );
}
