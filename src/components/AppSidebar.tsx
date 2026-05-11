import { useState } from "react";
import { useApp, Subject } from "@/contexts/AppContext";
import {
  Lock, Moon, Sun, Calculator, Atom, FlaskConical, TrendingUp,
  Bug, Wrench, Apple, DollarSign, Languages, User, BookOpen,
  ChevronDown, ChevronRight, Palette
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Language } from "@/i18n/translations";
import CourseCatalogPanel from "@/components/CourseCatalogPanel";
import { getSubjectColor } from "@/lib/subjectColors";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarFooter, SidebarHeader,
  SidebarSeparator, useSidebar,
} from "@/components/ui/sidebar";

const SUBJECTS: { key: string; active: boolean; icon: React.ElementType }[] = [
  { key: "mathematics", active: true,  icon: Calculator },
  { key: "physics",     active: true,  icon: Atom },
  { key: "chemistry",   active: true,  icon: FlaskConical },
  { key: "calculus",    active: true,  icon: TrendingUp },
  { key: "economics",   active: true,  icon: DollarSign },
  { key: "biology",     active: false, icon: Bug },
  { key: "engineering", active: false, icon: Wrench },
  { key: "nutrition",   active: false, icon: Apple },
  { key: "accounting",  active: false, icon: BookOpen },
];

const ALL_LANGUAGES: { code: Language | string; name: string; active: boolean }[] = [
  { code: "en", name: "English",    active: true  },
  { code: "es", name: "Español",    active: true  },
  { code: "fr", name: "Français",   active: false },
  { code: "de", name: "Deutsch",    active: false },
  { code: "pt", name: "Português",  active: false },
  { code: "it", name: "Italiano",   active: false },
  { code: "zh", name: "中文",        active: false },
  { code: "ja", name: "日本語",      active: false },
  { code: "ko", name: "한국어",      active: false },
  { code: "ar", name: "العربية",    active: false },
  { code: "hi", name: "हिन्दी",     active: false },
  { code: "ru", name: "Русский",    active: false },
];

type PrefSection = "language" | "appearance" | "account" | null;

const AppSidebar = () => {
  const { t, subject, setSubject, language, setLanguage, darkMode, toggleDarkMode } = useApp();
  const { state, setOpen } = useSidebar();
  const collapsed = state === "collapsed";
  const [openPref, setOpenPref] = useState<PrefSection>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  const togglePref = (sec: PrefSection) =>
    setOpenPref((prev) => (prev === sec ? null : sec));

  const filteredLangs = ALL_LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  // Close sidebar on mobile after selecting a subject
  const handleSubjectSelect = (key: Subject) => {
    setSubject(key);
    // Close on mobile (sidebar becomes a sheet on mobile)
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas">
      {/* ── Header / Logo ── */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img
            src={darkMode ? "/logo_white.png" : "/logo_black.png"}
            alt="Matharay"
            className="h-10 w-10 object-contain shrink-0"
          />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground truncate">
              {t.appName}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* ── Subjects ── */}
        <SidebarGroup>
          <SidebarGroupLabel>{collapsed ? "" : t.subjectsLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SUBJECTS.map((s) => {
                const label = t.subjects[s.key as keyof typeof t.subjects];
                const Icon = s.icon;
                const isSelected = subject === s.key;
                const colors = getSubjectColor(s.key);

                if (!s.active) {
                  return (
                    <SidebarMenuItem key={s.key}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            className="opacity-40 cursor-not-allowed min-h-[44px]"
                          >
                            <Lock className="h-4 w-4 shrink-0" />
                            {!collapsed && <span>{label}</span>}
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">{t.comingSoon}</TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={s.key}>
                    <SidebarMenuButton
                      onClick={() => handleSubjectSelect(s.key as Subject)}
                      isActive={isSelected}
                      tooltip={label}
                      className={`min-h-[44px] ${isSelected ? `${colors.bgClass} ${colors.textClass} font-semibold` : ""}`}
                      style={isSelected ? { borderLeft: `3px solid ${colors.accent}` } : {}}
                    >
                      <Icon
                        className="h-4 w-4 shrink-0"
                        style={{ color: isSelected ? colors.accent : undefined }}
                      />
                      {!collapsed && <span>{label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Course Catalog (collapsible) ── */}
        {!collapsed && (
          <>
            <SidebarSeparator />
            <div>
              <button
                onClick={() => setCatalogOpen((o) => !o)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-md"
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 text-left uppercase tracking-wide">
                  {language === "es" ? "Catálogo de cursos" : "Course Catalog"}
                </span>
                {catalogOpen
                  ? <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              </button>
              {catalogOpen && (
                <div className="overflow-y-auto max-h-52 overscroll-contain mt-1">
                  <CourseCatalogPanel />
                </div>
              )}
            </div>
          </>
        )}

        <SidebarSeparator />

        {/* ── Preferences ── */}
        <SidebarGroup>
          <SidebarGroupLabel>{collapsed ? "" : t.preferencesLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

              {/* Language */}
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => !collapsed && togglePref("language")}
                      tooltip={t.languageLabel}
                      className="w-full min-h-[44px]"
                    >
                      <Languages className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{t.languageLabel}</span>
                          <span className="text-xs text-muted-foreground uppercase">{language}</span>
                          {openPref === "language"
                            ? <ChevronDown className="h-3 w-3" />
                            : <ChevronRight className="h-3 w-3" />}
                        </>
                      )}
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{t.languageLabel}</TooltipContent>}
                </Tooltip>
                {!collapsed && openPref === "language" && (
                  <div className="mt-1 mx-2 rounded-md border border-border bg-card p-2">
                    <input
                      type="text"
                      placeholder={t.searchLanguage}
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-1"
                    />
                    <div className="max-h-44 overflow-y-auto space-y-0.5">
                      {filteredLangs.map((l) => (
                        <Tooltip key={l.code}>
                          <TooltipTrigger asChild>
                            <button
                              disabled={!l.active}
                              onClick={() => {
                                if (l.active) {
                                  setLanguage(l.code as Language);
                                  setLangSearch("");
                                  setOpenPref(null);
                                }
                              }}
                              className={`w-full text-left px-2 py-2 rounded text-xs font-medium transition-colors min-h-[36px] ${
                                language === l.code
                                  ? "bg-primary text-primary-foreground"
                                  : l.active
                                  ? "text-foreground hover:bg-muted"
                                  : "text-muted-foreground opacity-40 cursor-not-allowed"
                              }`}
                            >
                              <span className="flex items-center justify-between gap-2">
                                {l.name}
                                {!l.active && <Lock className="h-2.5 w-2.5 shrink-0" />}
                              </span>
                            </button>
                          </TooltipTrigger>
                          {!l.active && <TooltipContent side="right">{t.comingSoon}</TooltipContent>}
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                )}
              </SidebarMenuItem>

              {/* Appearance */}
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => !collapsed ? togglePref("appearance") : toggleDarkMode()}
                      tooltip={t.appearanceLabel}
                      className="w-full min-h-[44px]"
                    >
                      <Palette className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{t.appearanceLabel}</span>
                          {openPref === "appearance"
                            ? <ChevronDown className="h-3 w-3" />
                            : <ChevronRight className="h-3 w-3" />}
                        </>
                      )}
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right">{t.appearanceLabel}</TooltipContent>}
                </Tooltip>
                {!collapsed && openPref === "appearance" && (
                  <div className="mt-1 mx-2 rounded-md border border-border bg-card p-2 space-y-1">
                    <button
                      onClick={() => { if (!darkMode) toggleDarkMode(); }}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded text-xs font-medium transition-colors min-h-[36px] ${
                        darkMode ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <Moon className="h-3.5 w-3.5" /> {t.darkMode}
                    </button>
                    <button
                      onClick={() => { if (darkMode) toggleDarkMode(); }}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded text-xs font-medium transition-colors min-h-[36px] ${
                        !darkMode ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <Sun className="h-3.5 w-3.5" /> {t.lightMode}
                    </button>
                  </div>
                )}
              </SidebarMenuItem>

              {/* Account (locked) */}
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      className="opacity-50 cursor-not-allowed w-full min-h-[44px]"
                      tooltip={t.accountLabel}
                    >
                      <User className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{t.accountLabel}</span>
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">{t.comingSoon}</TooltipContent>
                </Tooltip>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="p-2">
        <div className="text-center">
          {!collapsed && (
            <p className="text-[10px] text-muted-foreground/50">Matharay v0.8</p>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
