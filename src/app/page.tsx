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
              Pixel inmates. Decaying stats. Contraband economy. This is your tiny prison simulator.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#jail" className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:opacity-90">
                Enter the Jail
              </a>
              <a href="#manifesto" className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10">
                Read the Manifesto
              </a>
            </div>
          </div>

          <div id="jail" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-2xl font-semibold">Pixel Jail Tamagotchi</h2>
              <p className="mt-3 text-white/70">
                Feed it. Bribe the guard. Attempt escape. Your Krookz remembers neglect.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                <li>• Hunger decreases over time</li>
                <li>• Rage + Shame creep upward</li>
                <li>• Daily feeds build streaks</li>
              </ul>
            </div>
            <PixelJailGame />
          </div>

          <div id="manifesto" className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">Manifesto (stub)</h2>
            <p className="mt-3 text-white/70">
              Dr. Slick McScam: “If you can’t mine blocks, mine narratives.” Full manifesto soon.
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
