"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Stats = {
  hunger: number;
  rage: number;
  shame: number;
  lastTick: number;
  dayStreak: number;
  lastFedDay: string;
};

const STORAGE_KEY = "krookz_pixel_jail_v1";

function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function loadStats(): Stats {
  const now = Date.now();
  const fallback: Stats = {
    hunger: 70,
    rage: 20,
    shame: 50,
    lastTick: now,
    dayStreak: 0,
    lastFedDay: "",
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return {
      ...fallback,
      ...parsed,
      hunger: clamp(Number(parsed.hunger ?? fallback.hunger)),
      rage: clamp(Number(parsed.rage ?? fallback.rage)),
      shame: clamp(Number(parsed.shame ?? fallback.shame)),
      lastTick: Number(parsed.lastTick ?? fallback.lastTick),
      dayStreak: Number(parsed.dayStreak ?? fallback.dayStreak),
      lastFedDay: String(parsed.lastFedDay ?? fallback.lastFedDay),
    };
  } catch {
    return fallback;
  }
}

function saveStats(s: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

const DECAY = {
  hungerDown: 0.25,
  rageUp: 0.15,
  shameUp: 0.1,
};

export default function PixelJailGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [message, setMessage] = useState<string>("");

  const mood = useMemo(() => {
    if (!stats) return "booting";
    const { hunger, rage, shame } = stats;
    if (hunger < 20) return "starving";
    if (rage > 75) return "rioting";
    if (shame > 75) return "spiraling";
    if (hunger > 70 && rage < 30 && shame < 60) return "chillin";
    return "plotting";
  }, [stats]);

  useEffect(() => {
    const s = loadStats();
    const now = Date.now();
    const elapsedMin = Math.max(0, (now - s.lastTick) / 60000);

    const decayed: Stats = {
      ...s,
      hunger: clamp(s.hunger - elapsedMin * DECAY.hungerDown),
      rage: clamp(s.rage + elapsedMin * DECAY.rageUp),
      shame: clamp(s.shame + elapsedMin * DECAY.shameUp),
      lastTick: now,
    };

    saveStats(decayed);
    setStats(decayed);
  }, []);

  useEffect(() => {
    if (!stats) return;
    const id = window.setInterval(() => {
      setStats((prev) => {
        if (!prev) return prev;
        const now = Date.now();
        const elapsedMin = (now - prev.lastTick) / 60000;
        if (elapsedMin <= 0) return prev;

        const next: Stats = {
          ...prev,
          hunger: clamp(prev.hunger - elapsedMin * DECAY.hungerDown),
          rage: clamp(prev.rage + elapsedMin * DECAY.rageUp),
          shame: clamp(prev.shame + elapsedMin * DECAY.shameUp),
          lastTick: now,
        };

        saveStats(next);
        return next;
      });
    }, 10000);

    return () => window.clearInterval(id);
  }, [stats]);

  useEffect(() => {
    if (!stats) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const W = c.width;
    const H = c.height;
    const unit = 4;
    const px = (n: number) => Math.round(n / unit) * unit;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0b0f14";
      ctx.fillRect(0, 0, W, H);

      for (let y = 0; y < H; y += unit * 6) {
        ctx.fillStyle = y % (unit * 12) === 0 ? "#101826" : "#0e1622";
        ctx.fillRect(0, y, W, unit * 6);
      }

      ctx.fillStyle = "#1f2a3a";
      for (let x = unit * 10; x < W - unit * 10; x += unit * 10) {
        ctx.fillRect(x, unit * 16, unit * 2, H - unit * 40);
        ctx.fillStyle = "#243247";
        ctx.fillRect(x + unit * 2, unit * 16, unit, H - unit * 40);
        ctx.fillStyle = "#1f2a3a";
      }

      ctx.fillStyle = "#0a111b";
      ctx.fillRect(0, H - unit * 18, W, unit * 18);

      const centerX = W / 2;
      const baseY = H - unit * 22;
      const wobble = Math.sin(Date.now() / 400) * unit * 1.5;

      const bodyW = unit * 14;
      const bodyH = unit * 12;

      const bodyColor =
        mood === "rioting"
          ? "#ff3b3b"

cat > src/app/page.tsx << 'EOF'
import PixelJailGame from "@/components/PixelJailGame";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070a10] text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="text-xs uppercase tracking-widest text-white/60">
              Narrative Mining™ from inside the jail
            </div>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
              KROOKZ
            </h1>
            <p className="mt-4 max-w-2xl text-white/70">
              A post-memecoin science psyop where tiny inmates run a contraband economy.
              Feed yours. Bribe the guard. Attempt the breakout.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#jail"
                className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:opacity-90"
              >
                Enter the Jail
              </a>
              <a
                href="#manifesto"
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10"
              >
                Read the Manifesto
              </a>
            </div>
          </div>

          <div id="jail" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold">Pixel Jail Tamagotchi</h2>
              <p className="mt-3 text-white/70">
                Your mini Krookz lives behind bars and decays in real time. Ignore it and it
                spirals. Love it and it plots. This is not financial advice. This is jail.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                <li>• Hunger goes down over time</li>
                <li>• Rage and Shame creep up</li>
                <li>• Feed once per day to build streaks</li>
              </ul>
            </div>

            <PixelJailGame />
          </div>

          <div id="manifesto" className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Manifesto (stub)</h2>
            <p className="mt-3 text-white/70">
              Dr. Slick McScam says: “If you can’t mine blocks, mine narratives.”
              We’ll drop the full manifesto here next.
            </p>
          </div>

          <footer className="pt-8 text-xs text-white/50">
            © {new Date().getFullYear()} KROOKZ. All inmates are fictional. Mostly.
          </footer>
        </div>
      </div>
    </main>
  );
}
