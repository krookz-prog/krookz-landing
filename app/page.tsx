import PixelJailGame from "../components/PixelJailGame";

export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ opacity: 0.7, letterSpacing: 2, textTransform: "uppercase", fontSize: 12 }}>
        Narrative Mining™ from inside the jail
      </div>

      <h1 style={{ fontSize: 56, margin: "12px 0 10px" }}>KROOKZ</h1>

      <p style={{ fontSize: 18, opacity: 0.75, maxWidth: 720, lineHeight: 1.5 }}>
        Pixel inmates. Decaying stats. Contraband economy. Feed yours, bribe the guard, attempt escape.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
          <h2 style={{ margin: 0 }}>Pixel Jail Tamagotchi</h2>
          <p style={{ opacity: 0.75, margin: 0 }}>
            Your mini Krookz lives behind bars and decays in real time. Ignore it and it spirals. Love it and it plots.
          </p>
          <ul style={{ opacity: 0.75, marginTop: 0 }}>
            <li>Hunger decreases over time</li>
            <li>Rage + Shame creep upward</li>
            <li>Daily feeds build streaks</li>
          </ul>
        </div>

        <PixelJailGame />

        <div style={{ marginTop: 24, opacity: 0.7, fontSize: 12 }}>
          © {new Date().getFullYear()} KROOKZ. All inmates are fictional. Mostly.
        </div>
      </div>
    </main>
  );
}
