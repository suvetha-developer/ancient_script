import { Award, Shield, BookOpen, CheckCircle } from "lucide-react";

interface ProfileViewProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export function ProfileView({ userName, userEmail, onLogout }: ProfileViewProps) {
  const userInitial = userName.charAt(0).toUpperCase() || "S";

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-up">
      {/* Profile Card */}
      <div className="rounded-2xl border border-gold-500/25 bg-[#1e1511]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500 text-3xl font-bold text-stone-950 shadow-xl border-2 border-amber-300">
            {userInitial}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-playfair text-2xl font-bold text-stone-100">
                {userName}
              </h2>
              <span className="rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold">
                Epigraphist
              </span>
            </div>

            <p className="text-xs text-amber-400 font-mono mt-1">{userEmail}</p>

            <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed">
              Lead Researcher in Tamil-Brahmi and Sangam-era epigraphical decipherment.
              Conducting AI-assisted paleographic reconstruction across South Indian cave shelters.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-lg bg-stone-900 border border-stone-800 px-2.5 py-1 text-[11px] text-stone-300">
                <Shield className="w-3 h-3 text-amber-400" /> Department of Epigraphy
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-stone-900 border border-stone-800 px-2.5 py-1 text-[11px] text-stone-300">
                <Award className="w-3 h-3 text-amber-400" /> TBSI Verified Contributor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Epigraphic Research Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-2xl border border-stone-800 bg-[#1e1511]/90 p-5 text-center shadow-lg">
          <BookOpen className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold font-mono text-stone-100">93</p>
          <p className="text-xs text-stone-400 mt-1">TBSI Records Indexed</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-[#1e1511]/90 p-5 text-center shadow-lg">
          <Award className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold font-mono text-emerald-400">94.2%</p>
          <p className="text-xs text-stone-400 mt-1">Model Precision Rate</p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-[#1e1511]/90 p-5 text-center shadow-lg">
          <CheckCircle className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold font-mono text-stone-100">28</p>
          <p className="text-xs text-stone-400 mt-1">Deciphered Character Classes</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={onLogout}
          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-6 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition"
        >
          Sign Out of TamilScriptAI
        </button>
      </div>
    </div>
  );
}
