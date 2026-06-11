import { Search } from "lucide-react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HeatmapView } from "./components/HeatmapView";
import { RoastDisplay } from "./components/RoastDisplay";
import { ShareCard } from "./components/ShareCard";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { useRoastStore } from "./store/useRoastStore";
// Suppress missing type declarations for the side-effect CSS import
// @ts-ignore
import "./styles.css";

function App() {
  const { error, result, setUsername, status, submit, username } = useRoastStore();

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("u");
    if (preset) {
      setUsername(preset);
    }
  }, [setUsername]);

  return (
    <main className="min-h-screen bg-[#070a0f] text-[#e6edf3]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-8 md:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
           <div className="grid h-11 w-11 place-items-center rounded-md bg-emerald-400 text-[#07130b]">
            <svg
             width="24"
             height="24"
             viewBox="0 0 24 24"
             fill="currentColor"
             aria-hidden="true"
              >
             <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
           </div>
            <div>
            <div>
              <h1 className="text-2xl font-black tracking-normal text-white md:text-3xl">GitBlamed</h1>
              <p className="text-sm text-[#8b949e]">Annual GitHub activity, judged with affection.</p>
            </div>
          </div>
          </div>
          <div className="rounded-md border border-white/10 px-3 py-2 text-sm text-[#8b949e]">
            React 19 · Hono · Cloudflare Workers
          </div>
        </header>

        <form
          className="grid gap-3 rounded-md border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <label className="sr-only" htmlFor="username">
            GitHub username
          </label>
          <input
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="h-12 min-w-0 rounded-md border border-white/10 bg-[#0d1117] px-4 text-lg font-semibold text-white outline-none transition placeholder:text-[#6e7681] focus:border-emerald-400"
            id="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="torvalds or github.com/torvalds"
            spellCheck={false}
            value={username}
          />
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 font-black text-[#07130b] transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-70"
            disabled={status === "loading"}
            type="submit"
          >
            <Search size={19} />
            {status === "loading" ? "Blaming..." : "Roast"}
          </button>
        </form>

        {error ? (
          <div className="rounded-md border border-red-400/25 bg-red-400/10 p-4 text-red-100">{error}</div>
        ) : null}

        <section className="grid gap-6">
          {status === "loading" ? <SkeletonLoader /> : null}

          {result ? (
            <>
              <HeatmapView days={result.heatmapData} />
              <RoastDisplay roastText={result.roastText} stats={result.stats} />
              <ShareCard username={result.username} roastText={result.roastText} />
            </>
          ) : status !== "loading" ? (
            <div className="grid min-h-[360px] place-items-center rounded-md border border-dashed border-white/12 bg-white/[0.02] p-8 text-center">
              <div className="max-w-lg">
                <p className="text-3xl font-black text-white md:text-5xl">One handle. One heatmap. Three sentences of judgment.</p>
                <p className="mt-4 text-[#8b949e]">
                  No signup, no ceremony, just a contribution calendar and a suspiciously specific roast.
                </p>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
