import { useState } from "react";
import {
  LayoutDashboard,
  Scan,
  History,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ScrollText,
  Columns3,
} from "lucide-react";

export type NavTab = "dashboard" | "analyze" | "history" | "settings" | "profile";
export type ThemeMode = "parchment" | "temple" | "dark";

interface HeaderProps {
  userName: string;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onLogout: () => void;
  themeMode?: ThemeMode;
  onThemeToggle?: () => void;
  showPillars?: boolean;
  onTogglePillars?: () => void;
}

export function Header({
  userName,
  activeTab,
  onTabChange,
  onLogout,
  themeMode = "parchment",
  onThemeToggle,
  showPillars,
  onTogglePillars,
}: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userInitial = userName.charAt(0).toUpperCase() || "S";

  return (
    <header className="sticky top-0 z-50 border-b border-gold-500/25 bg-[#17100b]/92 backdrop-blur-md shadow-lg">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Brand / Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => onTabChange("dashboard")}
          >
            {/* Ancient South Indian Temple Vimana / Pagoda Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-stone-900 to-amber-900/40 border border-amber-500/40 text-amber-400 shadow-md">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
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

            <div className="flex flex-col">
              <span className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-amber-200">
                TAMIL.SCRIPTAI
              </span>
            </div>
          </div>

          {/* Centered Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1">
            <button
              onClick={() => onTabChange("dashboard")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-stone-900 text-amber-300 border border-amber-500/50 shadow-inner"
                  : "text-stone-300 hover:text-amber-300 hover:bg-stone-900/60"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange("analyze")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "analyze"
                  ? "bg-stone-900 text-amber-300 border border-amber-500/50 shadow-inner"
                  : "text-stone-300 hover:text-amber-300 hover:bg-stone-900/60"
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Analyze Inscription</span>
            </button>

            <button
              onClick={() => onTabChange("history")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-stone-900 text-amber-300 border border-amber-500/50 shadow-inner"
                  : "text-stone-300 hover:text-amber-300 hover:bg-stone-900/60"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>

            <button
              onClick={() => onTabChange("settings")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-stone-900 text-amber-300 border border-amber-500/50 shadow-inner"
                  : "text-stone-300 hover:text-amber-300 hover:bg-stone-900/60"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => onTabChange("profile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-stone-900 text-amber-300 border border-amber-500/50 shadow-inner"
                  : "text-stone-300 hover:text-amber-300 hover:bg-stone-900/60"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Right Section: Theme Toggle, User Avatar, Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Temple Pillars Framing Toggle */}
            {onTogglePillars && (
              <button
                onClick={onTogglePillars}
                title="Toggle Temple Stone Pillars border"
                className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border transition ${
                  showPillars
                    ? "bg-amber-500/20 border-amber-400 text-amber-300"
                    : "border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Pillars</span>
              </button>
            )}

            {/* Background Theme Switcher */}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                title={`Current Theme: ${themeMode}. Click to switch theme`}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs border border-stone-800 text-amber-400 hover:bg-stone-900 transition"
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span className="capitalize hidden lg:inline">{themeMode}</span>
              </button>
            )}

            {/* User Avatar Badge (Yellow 'S' + swethac164) */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg bg-stone-900/90 border border-stone-800 px-2 py-1 hover:border-amber-500/40 transition"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500 text-[11px] font-bold text-stone-950">
                  {userInitial}
                </div>
                <span className="text-xs font-medium text-stone-200 hidden sm:inline">
                  {userName}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-stone-800 bg-[#1c1410] p-1.5 shadow-2xl z-50">
                  <div className="px-3 py-2 border-b border-stone-800 text-xs">
                    <p className="font-semibold text-stone-200">{userName}</p>
                    <p className="text-[11px] text-amber-400/80">Epigraphist Researcher</p>
                  </div>
                  <button
                    onClick={() => {
                      onTabChange("profile");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-300 hover:bg-stone-900 rounded-lg flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" /> View Profile
                  </button>
                  <button
                    onClick={() => {
                      onTabChange("settings");
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-300 hover:bg-stone-900 rounded-lg flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" /> Preferences
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 mt-1 border-t border-stone-800/80"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-rose-400 border border-stone-800 hover:border-rose-500/40 px-2.5 py-1.5 rounded-lg bg-stone-950/60 transition"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
