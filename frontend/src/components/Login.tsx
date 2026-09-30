import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface LoginProps {
  onLogin: (email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("swethac164@heritage.ai");
  const [password, setPassword] = useState("password123");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(email || "swethac164@heritage.ai");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-[#160e09] text-stone-100">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/25 via-stone-900 to-amber-900/40 border border-amber-500/40 text-amber-400 shadow-xl mb-3">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 2L14 5H10L12 2Z" fill="#e5ab35" stroke="#e5ab35" />
              <path d="M8.5 5L7.5 8H16.5L15.5 5H8.5Z" fill="#8c6239" stroke="#c9a227" />
              <path d="M6.5 8L5.5 12H18.5L17.5 8H6.5Z" fill="#5c4536" stroke="#c9a227" />
              <path d="M4.5 12L3.5 17H20.5L19.5 12H4.5Z" fill="#3d2e24" stroke="#c9a227" />
              <path d="M2.5 17V22H21.5V17H2.5Z" fill="#241a15" stroke="#c9a227" />
              <path d="M10 22V17H14V22" fill="#e5ab35" stroke="#1c1410" />
            </svg>
          </div>

          <p className="font-cinzel text-lg font-bold tracking-widest text-amber-200">
            TAMIL.SCRIPTAI
          </p>
          <h1 className="mt-2 font-tamil-serif text-2xl font-bold text-stone-100">
            பண்டைய தமிழ் கல்வெட்டு பகுப்பாய்வு
          </h1>
          <p className="mt-1 text-xs text-stone-400">
            Ancient Tamil Epigraphical AI Workspace
          </p>
        </div>

        {/* Login Form Box */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gold-500/30 bg-[#1e1511]/95 p-8 backdrop-blur-md shadow-2xl"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h2 className="font-playfair text-lg font-bold text-stone-100">
                Researcher Sign In
              </h2>
              <p className="text-xs text-amber-400/80">
                Epigraphist credentials verified
              </p>
            </div>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-300 font-mono"
              >
                Researcher ID / Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-950/80 px-3.5 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-300 font-mono"
              >
                Security Key / Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-950/80 px-3.5 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-950/40 transition hover:from-amber-400 hover:to-amber-500"
          >
            <span>Enter Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="mt-4 text-center text-xs text-stone-400">
            Connected to 93 TBSI Archaeological Stone Inscriptions
          </p>
        </form>
      </div>
    </div>
  );
}
