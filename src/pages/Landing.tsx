import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet, Play, Database, Trophy, Flame, Brain, ArrowRight, ArrowDown,
  AlertTriangle, ImageOff, FileX, EyeOff, Sparkles, ChevronRight, Zap,
  BarChart3, CreditCard, Building2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/CountUp";
import { NFTBadge } from "@/components/NFTBadge";
import { RoleSelectModal } from "@/components/RoleSelectModal";
import { useLang } from "@/context/LanguageContext";

const Landing = () => {
  const [roleOpen, setRoleOpen] = useState(false);
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(150 100% 50% / 0.18), transparent 70%)" }}
        />
        {/* floating orbs */}
        <div className="absolute top-32 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse-glow opacity-40" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />

        <div className="container relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7 animate-fade-in">
            <div className="chip-primary inline-flex">
              <Sparkles className="h-3 w-3" />
              {t("landing.hero.badge")}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              {t("landing.hero.titleTop")}
              <br />
              <span className="text-foreground">{t("landing.hero.titleMid")} </span>
              <span className="text-gradient-primary">{t("landing.hero.titleAccent")}</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-primary">
              {t("landing.hero.subtitle")}
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              {t("landing.hero.desc")}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="hero" size="xl" onClick={() => setRoleOpen(true)}>
                {t("cta.start")}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl">
                <Play className="h-5 w-5" />
                {t("cta.demo")}
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-4 text-xs font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                {t("landing.hero.live")}
              </span>
              <span>•</span>
              <span>{t("landing.hero.noSignup")}</span>
            </div>
          </div>

          {/* Floating mockup */}
          <div className="lg:col-span-5 relative animate-scale-in">
            <div className="relative animate-float">
              {/* Streak Card */}
              <div className="glass-card rounded-2xl p-6 shadow-card relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="chip-primary">
                    <Zap className="h-3 w-3" />
                    Active Streak
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">7xKm...9pQr</span>
                </div>
                <div className="flex items-end gap-3 mb-4">
                  <Flame className="h-14 w-14 text-primary drop-shadow-[0_0_12px_hsl(150_100%_50%/0.6)]" />
                  <div>
                    <div className="font-mono text-6xl font-extrabold text-foreground leading-none">47</div>
                    <div className="text-sm text-muted-foreground mt-1">Day Streak</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">PROGRESS TO SILVER</span>
                    <span className="text-primary">52%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-primary shadow-glow-soft" style={{ width: "52%" }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-border">
                  <div>
                    <div className="font-mono text-xl font-bold">134</div>
                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Workouts</div>
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold">48k</div>
                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider">kg Total</div>
                  </div>
                  <div>
                    <div className="font-mono text-xl font-bold text-accent">2</div>
                    <div className="text-[10px] uppercase text-muted-foreground tracking-wider">Badges</div>
                  </div>
                </div>
              </div>

              {/* Floating Gold Badge */}
              <div className="absolute -top-8 -right-6 animate-float" style={{ animationDelay: "1s" }}>
                <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2">
                  <NFTBadge tier="gold" size="sm" />
                  <span className="font-mono text-[10px] text-accent font-bold tracking-widest">{lang === "id" ? "GOLD CHAMPION" : "GOLD CHAMPION"}</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-4 animate-float" style={{ animationDelay: "2s" }}>
                <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs text-foreground">Verified on Solana</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 10000, suffix: "+", label: t("landing.stats.workouts") },
            { value: 5234, label: t("landing.stats.athletes") },
            { value: 1847, label: t("landing.stats.badges") },
          ].map((s, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:border-primary/40 transition-colors"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "radial-gradient(circle at 50% 100%, hsl(150 100% 50% / 0.12), transparent 70%)" }} />
              <div className="relative">
                <div className="text-4xl md:text-5xl font-extrabold text-gradient-primary">
                  <CountUp end={s.value} suffix={s.suffix ?? ""} />
                </div>
                <div className="mt-2 text-sm font-mono uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOR GYM OWNERS */}
      <section id="gym-owners" className="container py-24 md:py-32">
        <div className="relative rounded-3xl border border-owner/30 bg-card p-8 md:p-14 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(270 90% 65% / 0.18), transparent 70%)" }}
          />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-owner/10 blur-3xl" />

          <div className="relative">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="chip-owner mb-4 inline-flex">
                <Building2 className="h-3 w-3" />
                For Gym Owners
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {lang === "id" ? (
                  <>Buat <span className="text-gradient-owner">Pemilik Gym</span></>
                ) : (
                  <>For <span className="text-gradient-owner">Gym Owners</span></>
                )}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mt-4">
                {lang === "id" ? "Kelola gym-mu lebih cerdas dengan teknologi blockchain" : "Manage your gym smarter with blockchain technology"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: BarChart3, title: lang === "id" ? "Dashboard Member Real-Time" : "Real-Time Member Dashboard", desc: lang === "id" ? "Pantau aktivitas semua member gymmu secara real-time. Lihat siapa yang aktif dan siapa yang butuh motivasi." : "Track all member activity in real time. See who's active and who needs motivation." },
                { icon: CreditCard, title: "Smart Membership NFT", desc: lang === "id" ? "Terbitkan membership digital yang tidak bisa dipalsukan. Pembayaran otomatis via Solana blockchain." : "Issue tamper-proof digital memberships with automated payment on Solana blockchain." },
                { icon: Trophy, title: "Gym Challenges & Leaderboard", desc: lang === "id" ? "Buat kompetisi antar member untuk ningkatin retensi dan semangat latihan di gymmu." : "Create member competitions to improve retention and training motivation in your gym." },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-border bg-background/60 backdrop-blur-sm p-7 hover:border-owner/50 hover:-translate-y-1 transition-all group"
                >
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 border"
                    style={{
                      background: "hsl(270 90% 65% / 0.12)",
                      borderColor: "hsl(270 90% 65% / 0.35)",
                      boxShadow: "0 0 16px hsl(270 90% 65% / 0.2)",
                    }}
                  >
                    <c.icon className="h-6 w-6" style={{ color: "hsl(270 90% 75%)" }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-3 mt-12">
              <Button asChild variant="owner" size="xl">
                <Link to="/owner">
                  <Building2 className="h-5 w-5" />
                  {lang === "id" ? "Daftarkan Gym Lo" : "Register Your Gym"}
                </Link>
              </Button>
              <p className="font-mono text-[11px] text-muted-foreground tracking-wider">
                POWERED BY SOLANA • SMART CONTRACTS READY
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="container py-24 md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="chip mb-4 inline-flex border-danger/30 text-danger" style={{ background: "hsl(0 100% 64% / 0.08)" }}>
            <AlertTriangle className="h-3 w-3" />
            {t("landing.problem.badge")}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("landing.problem.title")}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: ImageOff, title: lang === "id" ? "Foto Progress Bisa Diedit" : "Progress Photos Can Be Edited", desc: lang === "id" ? "Siapa pun bisa memanipulasi bukti latihan dengan editor sederhana." : "Anyone can manipulate workout proof with simple editing tools." },
            { icon: FileX, title: lang === "id" ? "Catatan Bisa Dihapus" : "Logs Can Be Deleted", desc: lang === "id" ? "Tidak ada akuntabilitas nyata. Hari buruk tinggal hapus, beres." : "There is no real accountability. Bad days can just be deleted." },
            { icon: EyeOff, title: lang === "id" ? "Klaim Tanpa Bukti" : "Claims Without Proof", desc: lang === "id" ? "Orang ngaku gym rutin tapi siapa yang tahu?" : "People claim consistency, but who can verify it?" },
          ].map((p, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-7 hover:border-danger/40 transition-colors group">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 border border-danger/30"
                style={{ background: "hsl(0 100% 64% / 0.1)" }}>
                <p.icon className="h-6 w-6 text-danger" />
              </div>
              <h3 className="text-xl font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mt-14 gap-6">
          <div className="h-12 w-12 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 animate-bounce">
            <ArrowDown className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold text-center">
            <span className="text-gradient-primary">GainChain</span> {t("landing.problem.solution")}
          </h3>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="chip-primary mb-4 inline-flex">
            <Sparkles className="h-3 w-3" />
            {t("landing.features.badge")}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("landing.features.title")}</h2>
          <p className="text-muted-foreground mt-4">{t("landing.features.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <FeatureCard
            icon={Database}
            title="Workout Logger On-Chain"
            tag="POWERED BY SOLANA"
            description={lang === "id" ? "Catat setiap sesi latihan secara permanen di Solana. Data tidak bisa diedit, dihapus, atau dimanipulasi." : "Record every training session permanently on Solana. Data cannot be edited, deleted, or manipulated."}
          >
            <div className="font-mono text-xs space-y-1.5 mt-2">
              <div className="flex justify-between"><span className="text-muted-foreground">TX HASH</span><span className="text-primary">7xKm...9pQr</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">BLOCK</span><span>248,392,471</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">STATUS</span><span className="text-primary">CONFIRMED ✓</span></div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Trophy}
            title="NFT Achievement Badge"
            tag="ERC-721 EQUIVALENT"
            description={lang === "id" ? "Dapatkan NFT Badge eksklusif untuk setiap milestone. Bukti nyata yang tersimpan di wallet-mu." : "Earn exclusive NFT badges for every milestone. Immutable proof stored in your wallet."}
          >
            <div className="flex items-center justify-around gap-2 mt-2">
              <NFTBadge tier="bronze" size="sm" />
              <NFTBadge tier="silver" size="sm" />
              <NFTBadge tier="gold" size="sm" />
              <NFTBadge tier="diamond" size="sm" />
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Flame}
            title="Streak & Consistency Tracker"
            tag="IMMUTABLE COUNTER"
            description={lang === "id" ? "Pantau konsistensi latihan harianmu. Streak yang tidak bisa dimanipulasi karena tercatat di blockchain." : "Track your daily training consistency with streaks that cannot be manipulated on-chain."}
          >
            <div className="flex items-center justify-center gap-3 mt-2 p-4 rounded-lg bg-background/50 border border-border">
              <Flame className="h-10 w-10 text-primary drop-shadow-[0_0_8px_hsl(150_100%_50%/0.6)]" />
              <div>
                <div className="font-mono text-3xl font-extrabold">30</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Brain}
            title="AI Program Recommender"
            tag="AI POWERED"
            description={lang === "id" ? "Dapatkan rekomendasi program Push Pull Leg yang dipersonalisasi berdasarkan goal-mu menggunakan teknologi AI." : "Get personalized Push Pull Leg recommendations based on your goals using AI."}
          >
            <div className="space-y-2 mt-2 font-mono text-xs">
              {["💪 Push Day — Chest, Shoulders, Triceps", "🦾 Pull Day — Back, Biceps", "🦵 Leg Day — Quads, Hams, Calves"].map((t) => (
                <div key={t} className="flex items-center gap-2 px-3 py-2 rounded-md bg-background/50 border border-border">
                  <ChevronRight className="h-3 w-3 text-primary" />
                  <span className="text-foreground">{t}</span>
                </div>
              ))}
            </div>
          </FeatureCard>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="chip-primary mb-4 inline-flex"><Zap className="h-3 w-3" />{t("landing.how.badge")}</div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("landing.how.title")}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {[
            { num: "01", icon: Wallet, title: "Connect Wallet", desc: lang === "id" ? "Hubungkan Phantom Wallet Solana-mu. Tidak perlu daftar atau buat akun baru." : "Connect your Solana Phantom Wallet. No sign-up or new account needed." },
            { num: "02", icon: Database, title: "Log Workout", desc: lang === "id" ? "Catat sesi latihanmu setiap hari. Data langsung tersimpan di Solana blockchain." : "Log your workout daily. Data is stored directly on Solana blockchain." },
            { num: "03", icon: Trophy, title: "Earn NFT Badge", desc: lang === "id" ? "Capai milestone dan dapatkan NFT Achievement Badge yang permanen di wallet-mu." : "Hit milestones and earn permanent NFT Achievement Badges in your wallet." },
          ].map((s, i, arr) => (
            <div key={s.num} className="relative">
              <div className="rounded-2xl border border-border bg-card p-7 h-full hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div className="font-mono text-5xl font-extrabold text-primary/20">{s.num}</div>
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/30 shadow-glow-soft">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 h-7 w-7 text-primary/40 z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* NFT SHOWCASE */}
      <section className="container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="chip-primary mb-4 inline-flex"><Trophy className="h-3 w-3" />Achievement Badges</div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{lang === "id" ? "NFT Achievement Badges" : "NFT Achievement Badges"}</h2>
          <p className="text-muted-foreground mt-4">{lang === "id" ? "Empat tier prestasi. Permanen di wallet-mu, selamanya." : "Four achievement tiers. Permanent in your wallet, forever."}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { tier: "bronze" as const, name: "BRONZE ATHLETE", req: lang === "id" ? "30 Hari Streak" : "30 Day Streak", rarity: "COMMON", color: "text-[hsl(28_70%_60%)]" },
            { tier: "silver" as const, name: "SILVER WARRIOR", req: lang === "id" ? "90 Hari Streak" : "90 Day Streak", rarity: "UNCOMMON", color: "text-[hsl(0_0%_80%)]" },
            { tier: "gold" as const, name: "GOLD CHAMPION", req: lang === "id" ? "180 Hari Streak" : "180 Day Streak", rarity: "RARE", color: "text-accent" },
            { tier: "diamond" as const, name: "DIAMOND LEGEND", req: lang === "id" ? "365 Hari Streak" : "365 Day Streak", rarity: "LEGENDARY", color: "text-[hsl(190_100%_70%)]" },
          ].map((b) => (
            <div key={b.tier} className="rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/40 transition-all hover:-translate-y-1">
              <div className="flex justify-center py-6">
                <NFTBadge tier={b.tier} size="lg" />
              </div>
              <h3 className={`font-extrabold tracking-wider ${b.color}`}>{b.name}</h3>
              <p className="font-mono text-xs text-muted-foreground mt-1">{b.req}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <span className={`font-mono text-[10px] tracking-widest font-bold ${b.color}`}>● {b.rarity}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="chip-primary mb-4 inline-flex">{t("landing.testimonials.badge")}</div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("landing.testimonials.title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { addr: "0x1A2b...9F4c", tier: "gold" as const, quote: lang === "id" ? "Akhirnya ada platform yang bikin rutinitas gym gue benar-benar terukur. Streak 187 hari dan tidak bisa hilang." : "Finally a platform that truly tracks my gym consistency. 187-day streak and it can never disappear." },
            { addr: "0x8E5d...2A1b", tier: "silver" as const, quote: lang === "id" ? "Konsep on-chain proof ini game changer. NFT Silver gue jadi pencapaian paling worth it tahun ini." : "This on-chain proof concept is a game changer. My Silver NFT is my most meaningful flex this year." },
            { addr: "0x3F9c...7E2a", tier: "bronze" as const, quote: lang === "id" ? "Simple, tidak ribet, tinggal connect Phantom lalu log. Plus bisa pamer badge ke teman-teman." : "Simple and smooth, just connect Phantom and log. Plus I can show my badges to friends." },
          ].map((t, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center font-mono font-bold text-primary-foreground">
                  {t.addr.slice(2, 4).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-sm text-foreground">{t.addr}</div>
                  <div className="text-xs text-muted-foreground">Verified Athlete</div>
                </div>
                <NFTBadge tier={t.tier} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="relative rounded-3xl border border-primary/40 bg-card p-10 md:p-16 text-center overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, hsl(150 100% 50% / 0.15), transparent 70%)" }} />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto">
              {t("landing.cta.title")}
            </h2>
            <p className="text-muted-foreground mt-5 max-w-xl mx-auto">
              {t("landing.cta.desc")}
            </p>
            <div className="mt-8">
              <Button asChild variant="hero" size="xl">
                <Link to="/dashboard">
                  <Wallet className="h-5 w-5" />
                  {t("landing.cta.button")}
                </Link>
              </Button>
            </div>
            <p className="mt-5 text-xs font-mono text-muted-foreground tracking-wider">
              {t("landing.cta.powered")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <RoleSelectModal open={roleOpen} onOpenChange={setRoleOpen} />
    </div>
  );
};

const FeatureCard = ({
  icon: Icon, title, description, tag, children,
}: {
  icon: typeof Database;
  title: string;
  description: string;
  tag?: string;
  children?: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border bg-card p-7 hover:border-primary/40 transition-all hover:-translate-y-1 group">
    <div className="flex items-start justify-between mb-5">
      <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/30 shadow-glow-soft">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      {tag && <span className="chip-primary text-[10px]">{tag}</span>}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
    {children}
  </div>
);

export default Landing;
