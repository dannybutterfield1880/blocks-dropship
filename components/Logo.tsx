const LIGHT = [
  ["#176F6A", "#FFFFFF"],
  ["#F2B544", "#1B1D2B"],
  ["#E8674A", "#1B1D2B"],
  ["#1E3A5C", "#FFFFFF"],
  ["#176F6A", "#FFFFFF"],
  ["#F2B544", "#1B1D2B"],
];
const DARK = [
  ["#2FA39C", "#1B1D2B"],
  ["#F2B544", "#1B1D2B"],
  ["#E8674A", "#1B1D2B"],
  ["#F5F2EB", "#1B1D2B"],
  ["#2FA39C", "#1B1D2B"],
  ["#F2B544", "#1B1D2B"],
];
const TILT = [
  "rotate(-7deg) translateY(2px)",
  "rotate(5deg) translateY(-3px)",
  "rotate(-3deg) translateY(3px)",
  "rotate(6deg) translateY(-2px)",
  "rotate(-5deg) translateY(3px)",
  "rotate(4deg) translateY(-3px)",
];

export default function Logo({ dark = false, size = 34 }: { dark?: boolean; size?: number }) {
  const colours = dark ? DARK : LIGHT;
  return (
    <span className="logo" aria-label="blocks" role="img">
      {"blocks".split("").map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="logo-tile"
          style={{
            width: size,
            height: size,
            fontSize: size * 0.7,
            borderRadius: size * 0.26,
            background: colours[i][0],
            color: colours[i][1],
            transform: TILT[i],
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
