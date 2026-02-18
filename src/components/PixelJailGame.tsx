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

const DECAY = { hungerDown: 0.25, rageUp: 0.15, shameUp: 0.1 };

export default function PixelJailGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [message, setMessage] = useState("");

  const mood = useMemo(() => {
    if (!stats) return "booting";
    if (stats.hunger < 20) return "starving";
    if (stats.rage > 75) return "rioting";
    if (stats.shame > 75) return "spiraling";
    if (stats.hunger > 70 && stats.rage < 30 && stats.shame < 60) return "chillin";
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
        mood === "rioting" ? "#ff3b3b" :
        mood === "starving" ? "#ffd35a" :
        mood === "spiraling" ? "#c084fc" :
        "#57d6ff";

      ctx.fillStyle = bodyColor;
      ctx.fillRect(px(centerX - bodyW / 2), px(baseY - bodyH + wobble), bodyW, bodyH);

      ctx.fillStyle = "#0b0f14";
      const eyeY = px(baseY - bodyH + wobble + unit * 4);
      ctx.fillRect(px(centerX - unit * 4), eyeY, unit * 2, unit * 2);
      ctx.fillRect(px(centerX + unit * 2), eyeY, unit * 2, unit * 2);

      ctx.fillStyle = "#0b0f14";
      const mouthY = px(baseY - bodyH + wobble + unit * 8);
      ctx.fillRect(px(centerX - unit * 3), mouthY, unit * 6, unit * 2);

      ctx.fillStyle = "#dbeafe";
      ctx.font = "16px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText("KROOKZ: Pixel Jail", 14, 24);

      const drawBar = (label: string, value: number, y: number) => {
        ctx.fillStyle = "#93c5fd";
        ctx.fillText(label, 14, y);
        const barX = 120;
        const barY = y - 12;
        const barW = 180;
        const barH = 10;

        ctx.fillStyle = "#111827";
        ctx.fillRect(barX, barY, barW, barH);

        ctx.fillStyle = "#60a5fa";
        ctx.fillRect(barX, barY, (barW * value) / 100, barH);

        ctx.strokeStyle = "#1f2937";
        ctx.strokeRect(barX, barY, barW, barH);
      };

      drawBar("Hunger", stats.hunger, 52);
      drawBar("Rage", stats.rage, 72);
      drawBar("Shame", stats.shame, 92);

      ctx.fillStyle = "#a7f3d0";
      ctx.fillText(`Mood: ${mood}`, 14, 118);

      ctx.fillStyle = "#fcd34d";
      ctx.fillText(`Streak: ${stats.dayStreak} day(s)`, 14, 138);

      if (message) {
        ctx.fillStyle = "#fca5a5";
        ctx.fillText(message, 14, H - 18);
      }

      requestAnimationFrame(draw);
    };

    const raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [stats, mood, message]);

  const act = (type: "feed" | "bribe" | "escape") => {
    if (!stats) return;

    const now = Date.now();
    const tk = todayKey();
    let next = { ...stats, lastTick: now };

    if (type === "feed") {
      next.hunger = clamp(next.hunger + 22);
      next.rage = clamp(next.rage - 10);
      next.shame = clamp(next.shame - 6);

      if (next.lastFedDay !== tk) {
        next.dayStreak = next.dayStreak + 1;
        next.lastFedDay = tk;
      }
      setMessage("Contraband snack delivered ✅");
    }

    if (type === "bribe") {
      next.rage = clamp(next.rage - 18);
      next.shame = clamp(next.shame + 6);
      setMessage("Guard bribed 🪙");
    }

    if (type === "escape") {
      const chance = Math.max(0.05, (100 - next.shame) / 200);
      if (Math.random() < chance) {
        next.rage = clamp(next.rage - 35);
        next.shame = clamp(next.shame - 30);
        setMessage("Escape: SUCCESS (briefly).");
      } else {
        next.rage = clamp(next.rage + 12);
        next.shame = clamp(next.shame + 10);
        setMessage("Escape: FAILED. Solitary.");
      }
    }

    saveStats(next);
    setStats(next);
    window.setTimeout(() => setMessage(""), 3500);
  };

  if (!stats) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
        <div className="text-sm text-white/70">Loading inmate file…</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
      <div className="flex flex-col gap-4">
        <canvas ref={canvasRef} width={420} height={260} className="w-full rounded-xl border border-white/10 bg-black" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button onClick={() => act("feed")} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10">
            FEED
          </button>
          <button onClick={() => act("bribe")} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10">
            BRIBE
          </button>
          <button onClick={() => act("escape")} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10">
            ESCAPE
          </button>
        </div>
      </div>
    </div>
  );
}
