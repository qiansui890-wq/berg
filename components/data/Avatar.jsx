import React from "react";

/** Berg PC — Avatar. Initials or photo; circle with subtle ring. */
export function Avatar({ name = "", src, size = 40, tone = "navy", style }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const tones = {
    navy:  ["var(--navy-800)", "var(--cream)"],
    stone: ["var(--stone-500)", "var(--cream)"],
    ink:   ["var(--ink-800)", "var(--cream)"],
  };
  const [bg, fg] = tones[tone] || tones.navy;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "var(--radius-pill)",
        background: src ? "transparent" : bg,
        color: fg,
        fontFamily: "var(--font-ui)",
        fontWeight: "var(--weight-semibold)",
        fontSize: size * 0.38,
        letterSpacing: "0.02em",
        overflow: "hidden",
        boxShadow: "0 0 0 1px var(--border-subtle)",
        flex: "none",
        ...style,
      }}
    >
      {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
    </span>
  );
}
