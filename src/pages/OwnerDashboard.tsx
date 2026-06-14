import { useState } from "react";
import {
  Users, Activity, Coins, Swords, QrCode, Award, Plus, Download,
  Building2, Flame, Trophy, MessageSquare, RefreshCw, Trash2, Search,
  CheckCircle2, XCircle, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLang } from "@/context/LanguageContext";
import { toast } from "sonner";

const shortAddr = (a: string) => `${a.slice(0, 4)}...${a.slice(-4)}`;

type MemberStatus = "ACTIVE" | "INACTIVE" | "EXPIRING SOON";

type PendingClaim = {
  id: string;
  wallet: string;
  event: string;
  claim: string;
  submittedAt: string;
};

const defaultPendingClaims: PendingClaim[] = [
  { id: "c1", wallet: "7xKm9pQrAv3Z2BcF", event: "17 Aug Deadlift Face-off", claim: "220kg × 3 Deadlift", submittedAt: "2h ago" },
  { id: "c2", wallet: "8E5d2A1bXyZ7HjKp", event: "17 Aug Deadlift Face-off", claim: "195kg × 5 Deadlift", submittedAt: "5h ago" },
  { id: "c3", wallet: "3F9c7E2aQwR1MnLo", event: "24 Aug Bench Press Showdown", claim: "140kg × 2 Bench Press", submittedAt: "1d ago" },
  { id: "c4", wallet: "1A2b9F4cDeGhJkLm", event: "17 Aug Deadlift Face-off", claim: "250kg × 1 Deadlift", submittedAt: "3h ago" },
];

// TWEAK 1: Nambahin properti "workouts" biar Leaderboard bawah nggak error undefined
const defaultMembers = [
  { wallet: "7xKm9pQrAv3Z2BcF", joinDate: "2025-11-14", streak: 187, workouts: 210, lastActive: "2h ago", status: "ACTIVE" as MemberStatus },
  { wallet: "8E5d2A1bXyZ7HjKp", joinDate: "2025-09-02", streak: 142, workouts: 156, lastActive: "5h ago", status: "ACTIVE" as MemberStatus },
  { wallet: "3F9c7E2aQwR1MnLo", joinDate: "2026-01-18", streak: 47, workouts: 52, lastActive: "1d ago", status: "EXPIRING SOON" as MemberStatus },
  { wallet: "1A2b9F4cDeGhJkLm", joinDate: "2025-08-22", streak: 91, workouts: 104, lastActive: "3h ago", status: "ACTIVE" as MemberStatus },
  { wallet: "5T7yU8iO9pAsDfGh", joinDate: "2025-12-05", streak: 0, workouts: 12, lastActive: "21d ago", status: "INACTIVE" as MemberStatus },
  { wallet: "9Zx2C4vB6nM8aSdF", joinDate: "2026-02-11", streak: 28, workouts: 30, lastActive: "6h ago", status: "ACTIVE" as MemberStatus },
  { wallet: "4Q1wE3rT5yU7iO9p", joinDate: "2025-10-30", streak: 64, workouts: 70, lastActive: "1d ago", status: "EXPIRING SOON" as MemberStatus },
  { wallet: "6H8jK0lP2oI4uY6t", joinDate: "2025-07-19", streak: 0, workouts: 5, lastActive: "45d ago", status: "INACTIVE" as MemberStatus },
];

const statusStyles: Record<MemberStatus, string> = {
  ACTIVE: "border-primary/40 bg-primary/10 text-primary",
  INACTIVE: "border-danger/40 text-danger",
  "EXPIRING SOON": "border-warning/40 text-warning",
};

const OwnerDashboard = () => {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('gainchain_owner_members');
    return saved ? JSON.parse(saved) : defaultMembers;
  });

  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>(() => {
    const saved = localStorage.getItem('gainchain_owner_claims');
    return saved ? JSON.parse(saved) : defaultPendingClaims;
  });

  const handleApproveClaim = (id: string) => {
    const claim = pendingClaims.find((c) => c.id === id);
    const updated = pendingClaims.filter((c) => c.id !== id);
    setPendingClaims(updated);
    localStorage.setItem('gainchain_owner_claims', JSON.stringify(updated));
    toast.success(t("owner.approveSuccess"), {
      description: claim ? `${shortAddr(claim.wallet)} — ${claim.claim}` : undefined,
    });
  };

  const handleRejectClaim = (id: string) => {
    const updated = pendingClaims.filter((c) => c.id !== id);
    setPendingClaims(updated);
    localStorage.setItem('gainchain_owner_claims', JSON.stringify(updated));
    toast.error(t("owner.rejectSuccess"));
  };

  const handleRemove = (wallet: string) => {
    const updated = members.filter((m: any) => m.wallet !== wallet);
    setMembers(updated);
    localStorage.setItem('gainchain_owner_members', JSON.stringify(updated));
  };

  const handleExport = () => {
    const headers = "Wallet,Join Date,Streak,Workouts,Last Active,Status";
    const rows = members.map((m: any) => 
      `${m.wallet},${m.joinDate},${m.streak}d,${m.workouts},${m.lastActive},${m.status}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gainchain-members.csv';
    a.click();
  };

  // TWEAK 2: Bikin array config Quick Actions yang bersih, setiap tombol punya Action (onClick)
  const quickActions = [
    { 
      icon: QrCode, 
      title: lang === "id" ? "Undang Member Baru" : "Invite New Member", 
      desc: lang === "id" ? "Buat QR code & link undangan" : "Generate QR code & invite link",
      action: () => alert(lang === "id" ? "Fitur Undang Member segera hadir!" : "Invite Member coming soon!")
    },
    { 
      icon: Award, 
      title: lang === "id" ? "Terbitkan Membership NFT" : "Issue Membership NFT", 
      desc: lang === "id" ? "Mint smart membership on-chain" : "Mint smart membership on-chain",
      action: () => alert(lang === "id" ? "Fitur Minting NFT segera hadir!" : "NFT Minting coming soon!")
    },
    { 
      icon: Swords, 
      title: lang === "id" ? "Buat Challenge" : "Create Challenge", 
      desc: lang === "id" ? "Buat kompetisi antar member" : "Create competition between members",
      action: () => alert(lang === "id" ? "Fitur Challenge segera hadir!" : "Challenges coming soon!")
    },
    { 
      icon: Download, 
      title: lang === "id" ? "Ekspor Data Member" : "Export Member Data", 
      desc: lang === "id" ? "Unduh CSV semua aktivitas" : "Download CSV of all activity",
      action: handleExport // <--- Langsung eksekusi download CSV beneran
    },
  ];

  const topMembers = [...members]
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  const totalMembers = members.length;
  const activeToday = members.filter(m => m.status === "ACTIVE").length;

  const filtered = members.filter((m) =>
    m.wallet.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t("owner.title") || "Owner Dashboard"}</h1>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono font-bold tracking-widest border"
              style={{
                background: "hsl(270 90% 65% / 0.15)",
                borderColor: "hsl(270 90% 65% / 0.4)",
                color: "hsl(270 90% 80%)",
                boxShadow: "0 0 16px hsl(270 90% 65% / 0.25)",
              }}
            >
              <Building2 className="h-3 w-3" />
              OWNER
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            IRON FORGE GYM • <span style={{ color: "hsl(270 90% 75%)" }}>0xGym...4f2A</span>
          </p>
        </div>
        <Button variant="owner" onClick={() => alert(lang === "id" ? "Quick Action Owner ditekan!" : "Owner Quick Action clicked!")}>
          <Plus className="h-4 w-4" />
          {t("owner.quickAction") || "Quick Action"}
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Members", value: totalMembers.toString(), unit: lang === "id" ? "Member" : "Members", sub: lang === "id" ? "+3 minggu ini" : "+3 this week", subColor: "text-primary" },
          { icon: Activity, label: "Active Today", value: activeToday.toString(), unit: "Athletes", sub: lang === "id" ? `${Math.round((activeToday / (totalMembers || 1)) * 100)}% dari member` : `${Math.round((activeToday / (totalMembers || 1)) * 100)}% of members`, subColor: "text-muted-foreground" },
          { icon: Coins, label: "Revenue", value: "2.4", unit: "SOL", sub: "This month", subColor: "text-muted-foreground" },
          { icon: Swords, label: "Challenges Active", value: "2", unit: lang === "id" ? "Berjalan" : "Running", sub: lang === "id" ? "1 segera berakhir" : "1 ending soon", subColor: "text-warning" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border bg-card p-5 relative overflow-hidden hover:-translate-y-0.5 transition-transform"
            style={{ borderColor: "hsl(270 90% 65% / 0.25)" }}
          >
            <div
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{ background: "radial-gradient(circle at 100% 0%, hsl(270 90% 65% / 0.1), transparent 60%)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{s.label}</span>
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center border"
                  style={{ background: "hsl(270 90% 65% / 0.12)", borderColor: "hsl(270 90% 65% / 0.35)" }}
                >
                  <s.icon className="h-4 w-4" style={{ color: "hsl(270 90% 75%)" }} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-extrabold text-foreground">{s.value}</span>
                <span className="text-xs font-mono text-muted-foreground">{s.unit}</span>
              </div>
              <p className={cn("text-xs font-mono mt-2", s.subColor)}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Challenge Claims */}
      <div className="rounded-2xl border bg-card overflow-hidden" style={{ borderColor: "hsl(270 90% 65% / 0.25)" }}>
        <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: "hsl(270 90% 75%)" }} />
              {t("owner.pendingClaims")}
            </h2>
            <p className="text-xs text-muted-foreground">{t("owner.pendingClaimsSub")}</p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono font-bold border"
            style={{
              background: "hsl(270 90% 65% / 0.12)",
              borderColor: "hsl(270 90% 65% / 0.35)",
              color: "hsl(270 90% 80%)",
            }}
          >
            {pendingClaims.length} pending
          </span>
        </div>
        <div className="divide-y divide-border">
          {pendingClaims.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground font-mono">
              No pending claims — all validated!
            </div>
          ) : (
            pendingClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white"
                    style={{ background: "var(--gradient-owner)" }}
                  >
                    {claim.wallet.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs">{shortAddr(claim.wallet)}</span>
                      <span className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-full bg-secondary border border-border">
                        {claim.submittedAt}
                      </span>
                    </div>
                    <p className="text-sm font-bold">{claim.event}</p>
                    <p className="text-xs text-primary font-mono mt-0.5">{claim.claim}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-primary/40 text-primary hover:bg-primary/10"
                    onClick={() => handleApproveClaim(claim.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {t("owner.approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-danger hover:text-danger hover:bg-danger/10"
                    onClick={() => handleRejectClaim(claim.id)}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    {t("owner.reject")}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Member Management */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-border">
          <div>
            <h2 className="text-lg font-bold">{t("owner.memberManagement") || "Member Management"}</h2>
            <p className="text-xs text-muted-foreground">{t("owner.memberManagementSub") || "Manage and monitor your gym members"}</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("owner.searchWallet") || "Search wallet address..."}
              className="pl-9 h-9 text-sm font-mono"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-background/40">
                <th className="text-left px-5 py-3">Member</th>
                <th className="text-left px-5 py-3">Join Date</th>
                <th className="text-left px-5 py-3">Streak</th>
                <th className="text-left px-5 py-3">Last Active</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.wallet} className="border-t border-border hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white"
                        style={{ background: "var(--gradient-owner)" }}
                      >
                        {m.wallet.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-mono text-xs">{shortAddr(m.wallet)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{m.joinDate}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 font-mono">
                      <Flame className="h-3.5 w-3.5 text-primary" />
                      {m.streak}d
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{m.lastActive}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider border",
                        statusStyles[m.status],
                      )}
                    >
                      ● {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => alert(lang === "id" ? "Fitur perpanjang segera hadir" : "Renew coming soon")}>
                        <RefreshCw className="h-3 w-3" /> {lang === "id" ? "Perpanjang" : "Renew"}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={() => alert(lang === "id" ? "Fitur pesan segera hadir" : "Message coming soon")}>
                        <MessageSquare className="h-3 w-3" /> {lang === "id" ? "Pesan" : "Message"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-7 text-[11px] text-danger hover:text-danger hover:bg-danger/10"
                        onClick={() => handleRemove(m.wallet)}
                      >
                        <Trash2 className="h-3 w-3" />
                        {lang === "id" ? "Hapus" : "Remove"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                    {t("owner.noMember") || "No members found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions + Mini Leaderboard */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold">{t("owner.quickActions") || "Quick Actions"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((a) => (
              <button
                key={a.title}
                onClick={a.action} // TWEAK 4: Manggil eksekusi aksi dari config
                className="text-left rounded-2xl border border-border bg-card p-5 hover:-translate-y-1 transition-all group"
                style={{ transitionProperty: "transform, border-color, box-shadow" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "hsl(270 90% 65% / 0.5)";
                  e.currentTarget.style.boxShadow = "0 0 24px hsl(270 90% 65% / 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center mb-4 border transition-colors group-hover:bg-primary/10"
                  style={{ background: "hsl(270 90% 65% / 0.12)", borderColor: "hsl(270 90% 65% / 0.35)" }}
                >
                  <a.icon className="h-5 w-5" style={{ color: "hsl(270 90% 75%)" }} />
                </div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{a.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Gym Leaderboard */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" />
                {t("owner.gymLeaderboard") || "Gym Leaderboard"}
              </h2>
              <p className="text-xs text-muted-foreground">{t("owner.top5Month") || "Top 5 Members"}</p>
            </div>
          </div>
          <ol className="space-y-2">
            {topMembers.map((m, i) => (
              <li
                key={m.wallet}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 hover:bg-secondary/40 transition-colors"
              >
                <span
                  className={cn(
                    "h-7 w-7 shrink-0 rounded-full flex items-center justify-center font-mono text-xs font-extrabold shadow-glow-soft",
                    i === 0 ? "bg-gradient-gold text-accent-foreground" :
                      i === 1 ? "bg-gradient-silver text-background" :
                        i === 2 ? "bg-gradient-bronze text-white" :
                          "bg-secondary text-muted-foreground border border-border",
                  )}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs text-foreground truncate">{shortAddr(m.wallet)}</div>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground mt-0.5">
                    <span className="inline-flex items-center gap-1 font-bold">
                      <Flame className="h-3 w-3 text-primary" />
                      {m.streak}d
                    </span>
                    <span>{m.workouts} {lang === "id" ? "workout" : "workouts"}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="text-center text-[11px] font-mono text-muted-foreground tracking-wider pt-4">
        POWERED BY SOLANA • SMART CONTRACT v1.2.0
      </p>
    </div>
  );
};

export default OwnerDashboard;