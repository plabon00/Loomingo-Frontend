"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

const FEATURES = [
  {
    num: "01",
    tag: "DM Automation",
    title: ["Maximise", "Link Clicks"],
    desc: "The moment a follower comments, Loomingo fires a personalised DM with the exact link — turning passive viewers into active buyers with zero manual effort.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1400&auto=format&fit=crop",
    chips: ["Instant DM", "Smart Links", "Auto-Target"],
    dark: "#be123c", mid: "#e11d48", light: "#fda4af", bg: "#fff1f2",
    grad: "radial-gradient(ellipse 70% 60% at 75% 30%, #fecdd3 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 20% 80%, #fff1f2 0%, transparent 60%)",
  },
  {
    num: "02",
    tag: "Comment Reply",
    title: ["Maximise", "Engagement"],
    desc: "Reply to every comment with a personalised message the second it lands. Keep conversations alive, funnel followers into DMs, and build real relationships — 24/7.",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1400&auto=format&fit=crop",
    chips: ["Auto Reply", "24/7 Active", "Scale Fast"],
    dark: "#6d28d9", mid: "#7c3aed", light: "#c4b5fd", bg: "#f5f3ff",
    grad: "radial-gradient(ellipse 70% 60% at 75% 30%, #ddd6fe 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 20% 80%, #f5f3ff 0%, transparent 60%)",
  },
  {
    num: "03",
    tag: "Sales Funnel",
    title: ["Maximise", "Revenue"],
    desc: "Deliver targeted offers exactly when purchase intent peaks. Convert warm followers into paying customers with intelligent, perfectly-timed automated flows.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1400&auto=format&fit=crop",
    chips: ["Auto-Sell", "High Conversion", "Revenue Growth"],
    dark: "#0e7490", mid: "#0891b2", light: "#67e8f9", bg: "#ecfeff",
    grad: "radial-gradient(ellipse 70% 60% at 75% 30%, #a5f3fc 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 20% 80%, #ecfeff 0%, transparent 60%)",
  },
] as const;

type FeatIdx = 0 | 1 | 2;

export default function SuperchargeSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const tiltRaf       = useRef<number>(0);
  const targetTilt    = useRef({ x: 0, y: 0 });

  const [active,     setActive]     = useState<FeatIdx>(0);
  const [slotProg,   setSlotProg]   = useState(0);
  const [cardKey,    setCardKey]    = useState(0);
  const [mouseTilt,  setMouseTilt]  = useState({ x: 0, y: 0 });

  const feat = FEATURES[active];

  useEffect(() => {
    const fn = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect     = el.getBoundingClientRect();
      const vh       = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const total    = Math.max(1, el.offsetHeight - vh);
      const g        = Math.min(1, scrolled / total);

      const slot = g * FEATURES.length;
      const next = Math.min(FEATURES.length - 1, Math.floor(slot)) as FeatIdx;
      setSlotProg(slot - Math.floor(slot));
      setActive((prev) => {
        if (prev !== next) setCardKey((k) => k + 1);
        return next;
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = rightPanelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    targetTilt.current = {
      x: ((e.clientY - cy) / (rect.height / 2)) * -8,
      y: ((e.clientX - cx) / (rect.width  / 2)) *  8,
    };
    cancelAnimationFrame(tiltRaf.current);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      setMouseTilt((prev) => {
        const nx = lerp(prev.x, targetTilt.current.x, 0.12);
        const ny = lerp(prev.y, targetTilt.current.y, 0.12);
        if (Math.abs(nx - targetTilt.current.x) > 0.01 || Math.abs(ny - targetTilt.current.y) > 0.01) {
          tiltRaf.current = requestAnimationFrame(animate);
        }
        return { x: nx, y: ny };
      });
    };
    tiltRaf.current = requestAnimationFrame(animate);
  }, []);

  const onMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0 };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      setMouseTilt((prev) => {
        const nx = lerp(prev.x, 0, 0.1);
        const ny = lerp(prev.y, 0, 0.1);
        if (Math.abs(nx) > 0.02 || Math.abs(ny) > 0.02) {
          tiltRaf.current = requestAnimationFrame(animate);
          return { x: nx, y: ny };
        }
        return { x: 0, y: 0 };
      });
    };
    tiltRaf.current = requestAnimationFrame(animate);
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: `${FEATURES.length * 100}vh` }}>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Core transitions ──────────────────────────────────────────────── */
        .ss-cx { transition: background .8s ease, border-color .5s ease, color .4s ease, box-shadow .7s ease }

        /* ── Base keyframes ────────────────────────────────────────────────── */
        @keyframes ss-fade-up    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ss-fade-dn    { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ss-scale-in   { from{opacity:0;transform:scale(.94) translateY(40px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes ss-number     { from{opacity:0;transform:scale(1.2);filter:blur(12px)} to{opacity:.08;transform:scale(1);filter:blur(0px)} }
        @keyframes ss-line-draw  { from{width:0;opacity:0} to{width:100%;opacity:1} }
        @keyframes ss-orbit-1    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ss-orbit-2    { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
        @keyframes ss-shimmer    { 0%{transform:translateX(-100%) skewX(-20deg)} 100%{transform:translateX(250%) skewX(-20deg)} }
        @keyframes ss-blink      { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes ss-ring       { 0%{transform:scale(.85);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
        @keyframes ss-scan       { 0%{transform:translateY(-100%);opacity:0} 5%{opacity:.45} 95%{opacity:.45} 100%{transform:translateY(800%);opacity:0} }
        @keyframes ss-droplet-float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.04)} }
        @keyframes ss-droplet-sway  { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(12px) translateX(-8px)} }


        /* ── Droplets ──────────────────────────────────────────────────────── */
        .ss-droplet {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle at 35% 25%, rgba(255,255,255,.96) 0%, rgba(255,255,255,.45) 45%, rgba(255,255,255,.15) 75%, rgba(255,255,255,.7) 100%);
          backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(255,255,255,.82);
          pointer-events: none;
        }
        .ss-droplet::before { content:''; position:absolute; top:14%; left:18%; width:38%; height:26%; border-radius:50%; background:linear-gradient(180deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.08) 100%); transform:rotate(-35deg); }
        .ss-droplet::after  { content:''; position:absolute; bottom:12%; right:18%; width:25%; height:18%; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,.82) 0%,transparent 80%); }
        .ss-droplet-float  { animation: ss-droplet-float 6s ease-in-out infinite }
        .ss-droplet-sway   { animation: ss-droplet-sway  8s ease-in-out infinite }

        /* ── Card scan ─────────────────────────────────────────────────────── */
        .ss-card-scan::after { content:''; position:absolute; inset:0; pointer-events:none; background:linear-gradient(to bottom,transparent 40%,rgba(255,255,255,.06) 50%,transparent 60%); height:60px; animation:ss-scan 6s ease-in-out infinite; }

        /* ── Orbit rings ───────────────────────────────────────────────────── */
        .ss-orbit-1 { animation: ss-orbit-1 35s linear infinite }
        .ss-orbit-2 { animation: ss-orbit-2 25s linear infinite }
        .ss-blink   { animation: ss-blink  2s ease-in-out infinite }
        .ss-scan    { animation: ss-scan   6s ease-in-out infinite }

        /* ══════════════════════════════════════════════════════════════════════
           WATER PILL  —  badge + left-panel chips
        ══════════════════════════════════════════════════════════════════════ */
        .ss-water-pill {
          background: linear-gradient(135deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.48) 100%);
          backdrop-filter: blur(24px) saturate(190%);
          border: 1px solid rgba(255,255,255,.85);
          box-shadow: 0 12px 28px -6px rgba(0,0,0,.08), 0 2px 8px -2px rgba(0,0,0,.04), inset 0 2px 2px rgba(255,255,255,.95), inset 0 -1.5px 2px rgba(0,0,0,.06);
          border-radius: 9999px;
        }
        .ss-water-pill:hover {
          transform: scale(1.04) translateY(-2px);
          box-shadow: 0 16px 36px -8px rgba(0,0,0,.12), inset 0 2px 3px rgba(255,255,255,1), inset 0 -1.5px 2px rgba(0,0,0,.08);
        }

        /* ══════════════════════════════════════════════════════════════════════
           NOVA CHIP  —  premium floating capsules for the left panel
        ══════════════════════════════════════════════════════════════════════ */

        /* individual staggered float paths */
        @keyframes nc-float-a { 0%,100%{transform:translateY(0px)    rotate(-1deg)  scale(1)}    33%{transform:translateY(-9px)  rotate(0.5deg) scale(1.02)} 66%{transform:translateY(-4px) rotate(-0.5deg) scale(1.01)} }
        @keyframes nc-float-b { 0%,100%{transform:translateY(0px)    rotate(1.2deg) scale(1)}    40%{transform:translateY(-12px) rotate(-1deg)  scale(1.03)} 70%{transform:translateY(-6px) rotate(0.8deg) scale(1.01)} }
        @keyframes nc-float-c { 0%,100%{transform:translateY(-3px)   rotate(-0.5deg) scale(1.01)} 50%{transform:translateY(-14px) rotate(1.2deg) scale(1.04)} }

        /* glow ring that expands behind the chip */
        @keyframes nc-glow-pulse {
          0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb,var(--nc-tint) 40%,transparent), 0 8px 20px -4px color-mix(in srgb,var(--nc-tint-dark) 30%,transparent), inset 0 1.5px 1px rgba(255,255,255,.9); }
          50%     { box-shadow: 0 0 0 6px color-mix(in srgb,var(--nc-tint) 0%,transparent),  0 14px 30px -6px color-mix(in srgb,var(--nc-tint-dark) 55%,transparent), inset 0 1.5px 1px rgba(255,255,255,.9); }
        }
        /* border shimmer sweep */
        @keyframes nc-border-spin {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        /* inner sheen sweep */
        @keyframes nc-sheen {
          0%,60%,100% { transform: translateX(-180%) skewX(-25deg); }
          30%          { transform: translateX(260%)  skewX(-25deg); }
        }
        /* entrance */
        @keyframes nc-chip-in { from{opacity:0;transform:scale(.75) translateY(16px) rotate(-4deg)} to{opacity:1;transform:scale(1) translateY(0) rotate(0deg)} }

        .nc-chip-wrap {
          display: inline-flex;
          position: relative;
          border-radius: 9999px;
          /* animated conic-gradient border */
          padding: 1.5px;
          background: conic-gradient(
            from var(--nc-angle, 0deg),
            color-mix(in srgb,var(--nc-tint) 80%,transparent) 0deg,
            rgba(255,255,255,.35) 90deg,
            color-mix(in srgb,var(--nc-tint) 40%,transparent) 180deg,
            rgba(255,255,255,.35) 270deg,
            color-mix(in srgb,var(--nc-tint) 80%,transparent) 360deg
          );
          animation:
            nc-chip-in .55s cubic-bezier(.34,1.56,.64,1) var(--nc-delay,0s) both,
            nc-glow-pulse var(--nc-pulse-dur, 3s) ease-in-out var(--nc-pulse-delay,0s) infinite;
          transition: transform .35s cubic-bezier(.34,1.56,.64,1), filter .35s ease;
          cursor: default;
          will-change: transform;
        }
        .nc-chip-wrap:hover {
          transform: translateY(-5px) scale(1.1) rotate(0deg) !important;
          filter: brightness(1.04);
          z-index: 10;
        }
        .nc-chip-wrap:hover .nc-chip-inner {
          box-shadow:
            0 18px 38px -8px color-mix(in srgb,var(--nc-tint-dark) 60%,transparent),
            inset 0 2px 2px rgba(255,255,255,1);
        }

        .nc-chip-inner {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          background:
            linear-gradient(140deg,
              color-mix(in srgb,var(--nc-tint) 10%,rgba(255,255,255,.97)) 0%,
              rgba(255,255,255,.55) 45%,
              color-mix(in srgb,var(--nc-tint) 20%,rgba(255,255,255,.75)) 100%);
          backdrop-filter: blur(22px) saturate(210%);
          -webkit-backdrop-filter: blur(22px) saturate(210%);
          box-shadow:
            0 6px 18px -4px color-mix(in srgb,var(--nc-tint-dark) 25%,transparent),
            inset 0 1.5px 1.5px rgba(255,255,255,.95),
            inset 0 -1.5px 2px color-mix(in srgb,var(--nc-tint-dark) 12%,transparent);
          transition: box-shadow .35s ease;
          color: var(--nc-color);
          white-space: nowrap;
        }
        /* top highlight bead */
        .nc-chip-inner::before {
          content: '';
          position: absolute;
          top: 2px; left: 12%; right: 12%; height: 40%;
          border-radius: 9999px;
          background: linear-gradient(180deg,rgba(255,255,255,.88),rgba(255,255,255,0));
          pointer-events: none;
        }
        /* sheen sweep */
        .nc-chip-inner::after {
          content: '';
          position: absolute;
          inset-y: 0; left: 0; width: 40%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);
          filter: blur(3px);
          animation: nc-sheen var(--nc-sheen-dur, 5s) ease-in-out var(--nc-sheen-delay, 0s) infinite;
          pointer-events: none;
        }

        /* status dot */
        .nc-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--nc-tint);
          box-shadow: 0 0 0 0 var(--nc-tint);
          animation: nc-dot-pulse var(--nc-dot-dur, 2.2s) ease-in-out var(--nc-dot-delay, 0s) infinite;
          flex-shrink: 0;
        }
        @keyframes nc-dot-pulse {
          0%,100% { transform:scale(1);   box-shadow: 0 0 0 0   color-mix(in srgb,var(--nc-tint) 55%,transparent); }
          50%     { transform:scale(1.35); box-shadow: 0 0 0 5px color-mix(in srgb,var(--nc-tint) 0%,transparent); }
        }

        /* float wrapper — each chip gets its own orbit */
        .nc-float-a { animation: nc-float-a var(--nc-float-dur,7s) ease-in-out var(--nc-float-delay,0s) infinite; }
        .nc-float-b { animation: nc-float-b var(--nc-float-dur,8s) ease-in-out var(--nc-float-delay,0s) infinite; }
        .nc-float-c { animation: nc-float-c var(--nc-float-dur,6s) ease-in-out var(--nc-float-delay,0s) infinite; }

      `}} />

      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "#faf7f2" }}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                background:  f.grad,
                opacity:     i === active ? 1 : 0,
                transition:  "opacity 0.9s ease",
              }}
            />
          ))}
          <div
            className="absolute rounded-full blur-[110px] pointer-events-none ss-cx"
            style={{
              width: "480px",
              height: "480px",
              top: "10%",
              left: "55%",
              background: `${feat.light}40`,
              transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <div
            className="absolute rounded-full blur-[130px] pointer-events-none ss-cx"
            style={{
              width: "420px",
              height: "420px",
              bottom: "15%",
              left: "15%",
              background: `${feat.mid}25`,
              transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(153,27,27,.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(153,27,27,.07) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center py-5 sm:py-8 lg:py-10 overflow-hidden">
          <div className="flex flex-col justify-center relative">
            <div
              key={`num-${cardKey}`}
              className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 select-none pointer-events-none font-black leading-none"
              style={{
                fontSize: "clamp(80px, 20vw, 290px)",
                background: `linear-gradient(135deg, ${feat.dark}90, ${feat.mid}30)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "ss-number .9s cubic-bezier(.16,1,.3,1) both",
              }}
            >
              {feat.num}
            </div>



            <div className="relative z-10">
              {/* ── Mobile image card (hidden on lg+) ── */}
              <div key={`mob-card-${cardKey}`} className="block lg:hidden mb-4 sm:mb-5 rounded-2xl overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
                {FEATURES.map((f, i) => (
                  <img
                    key={f.tag}
                    src={f.image}
                    alt={f.title.join(" ")}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity:    i === active ? 1 : 0,
                      transform:  i === active ? "scale(1)" : "scale(1.06)",
                      transition: "opacity .75s ease, transform .85s cubic-bezier(.16,1,.3,1)",
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(130deg, ${feat.dark}28 0%, transparent 55%)`, transition: "background 0.8s ease" }} />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                  <div className="text-[9px] font-bold tracking-widest uppercase mb-0.5 ss-cx" style={{ color: feat.light }}>{feat.tag}</div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">{feat.title.join(" ")}</h3>
                </div>
              </div>

              <div
                key={`badge-${cardKey}`}
                className="ss-water-pill inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 sm:mb-7 transition-all duration-300 cursor-default"
                style={{
                  color: feat.dark,
                  animation: "ss-fade-dn .5s cubic-bezier(.16,1,.3,1) both",
                }}
              >
                <span className="relative flex w-2 h-2">
                  <span className="ss-ring absolute inset-0 rounded-full ss-cx" style={{ background: feat.mid, animation: "ss-ring 2s ease-out infinite" }} />
                  <span className="relative rounded-full w-2 h-2 ss-cx" style={{ background: feat.dark }} />
                </span>
                {feat.tag}
                <span className="ss-blink ml-1">·</span>
                <span>{FEATURES.indexOf(feat) + 1} of {FEATURES.length}</span>
              </div>

              <div key={`title-${cardKey}`} className="mb-4 sm:mb-6">
                <h2 className="font-semibold text-zinc-900 tracking-tight leading-[1.07]"
                  style={{ fontSize: "clamp(1.9rem, 6.5vw, 4.5rem)" }}>
                  <span style={{ animation: "ss-fade-up .55s cubic-bezier(.16,1,.3,1) .04s both", display: "block" }}>
                    {feat.title[0]}
                  </span>
                  <span style={{ animation: "ss-fade-up .55s cubic-bezier(.16,1,.3,1) .1s both", display: "block", position: "relative" }}>
                    <span className="font-editorial italic ss-cx" style={{ color: feat.dark }}>
                      {feat.title[1]}
                    </span>
                  </span>
                </h2>
                <div
                  key={`line-${cardKey}`}
                  className="h-[3px] rounded-full mt-3 ss-cx"
                  style={{
                    background: `linear-gradient(90deg, ${feat.dark}, ${feat.light})`,
                    animation:  "ss-line-draw .9s cubic-bezier(.16,1,.3,1) .25s both",
                    boxShadow:  `0 0 12px ${feat.mid}66`,
                  }}
                />
              </div>

              <p
                key={`desc-${cardKey}`}
                className="text-zinc-500 leading-relaxed max-w-[420px] mb-5 sm:mb-8 text-sm sm:text-base"
                style={{ fontSize: "clamp(.82rem, 1.5vw, 1.0625rem)", animation: "ss-fade-up .6s cubic-bezier(.16,1,.3,1) .16s both" }}
              >
                {feat.desc}
              </p>

              <div key={`chips-${cardKey}`} className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-10">
                {feat.chips.map((chip, i) => {
                  const floatClass = ["nc-float-a","nc-float-b","nc-float-c"][i % 3];
                  const icons = ["✦","◈","⬡"];
                  return (
                    <div
                      key={chip}
                      className={`nc-chip-wrap ${floatClass}`}
                      style={{
                        "--nc-tint":         feat.light,
                        "--nc-tint-dark":    feat.dark,
                        "--nc-color":        feat.dark,
                        "--nc-delay":        `${.22 + i * .1}s`,
                        "--nc-float-dur":    `${6.5 + i * 1.3}s`,
                        "--nc-float-delay":  `${i * -1.8}s`,
                        "--nc-pulse-dur":    `${2.8 + i * .5}s`,
                        "--nc-pulse-delay":  `${i * .6}s`,
                        "--nc-sheen-dur":    `${5 + i * 1.1}s`,
                        "--nc-sheen-delay":  `${i * .9}s`,
                        "--nc-dot-dur":      `${2.0 + i * .4}s`,
                        "--nc-dot-delay":    `${i * .5}s`,
                      } as React.CSSProperties}
                    >
                      <div className="nc-chip-inner">
                        <span
                          className="nc-dot"
                          style={{ "--nc-tint": feat.mid, "--nc-tint-dark": feat.dark } as React.CSSProperties}
                        />
                        <span style={{ fontFamily: "monospace", opacity: .55, fontSize: ".65rem" }}>{icons[i % 3]}</span>
                        {chip}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2.5 items-center">
                {FEATURES.map((_, i) => (
                  <div key={i} className="rounded-full ss-cx transition-all duration-500"
                    style={{
                      width:      i === active ? "28px" : "8px",
                      height:     "8px",
                      background: i === active ? feat.dark : "#d4d4d8",
                      boxShadow:  i === active ? `0 0 12px ${feat.mid}99` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            ref={rightPanelRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="hidden lg:flex items-center justify-center relative"
            style={{ minHeight: "540px", perspective: "1400px" }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 70% at 55% 50%, ${feat.light}55 0%, transparent 65%)`,
                transition: "background .8s ease",
              }}
            />

            <div
              className="absolute pointer-events-none rounded-full border ss-orbit-1 ss-cx"
              style={{
                width: "530px",
                height: "530px",
                borderColor: `${feat.light}66`,
                borderStyle: "dashed",
                borderWidth: "1px",
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ss-cx shadow-lg"
                style={{ background: feat.dark, boxShadow: `0 0 12px ${feat.dark}` }} />
            </div>

            <div
              className="absolute pointer-events-none rounded-full border ss-orbit-2 ss-cx"
              style={{
                width: "420px",
                height: "420px",
                borderColor: `${feat.mid}44`,
                borderStyle: "dotted",
                borderWidth: "2px",
              }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 rounded-full ss-cx"
                style={{ background: feat.mid, boxShadow: `0 0 10px ${feat.mid}` }} />
            </div>



            <div
              key={cardKey}
              className="ss-water-pill relative p-2.5 group"
              style={{
                width: "100%",
                maxWidth: "460px",
                aspectRatio: "3/4",
                transform: `rotateX(${4 - slotProg * 5 + mouseTilt.x}deg) rotateY(${-16 + slotProg * 14 + mouseTilt.y}deg) rotateZ(${2 - slotProg * 2}deg)`,
                borderRadius: "2.3rem",
                animation: "ss-scale-in .75s cubic-bezier(.16,1,.3,1) both",
                transition: "transform 0.08s linear, box-shadow .8s ease",
              }}
            >
              <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden">
                {FEATURES.map((f, i) => (
                  <img
                    key={f.tag}
                    src={f.image}
                    alt={f.title.join(" ")}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      opacity:    i === active ? 1 : 0,
                      transform:  i === active ? "scale(1)" : "scale(1.07)",
                      transition: "opacity .75s ease, transform .85s cubic-bezier(.16,1,.3,1)",
                    }}
                  />
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
                <div
                  className="absolute inset-0 pointer-events-none ss-cx"
                  style={{ background: `linear-gradient(130deg, ${feat.dark}28 0%, transparent 55%)` }}
                />



                <div className="absolute bottom-0 left-0 right-0 px-7 py-7 z-10">
                  <div className="text-[10px] font-bold tracking-widest uppercase mb-1.5 ss-cx" style={{ color: feat.light }}>
                    {feat.tag}
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{feat.title.join(" ")}</h3>
                </div>

                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,.14) 0%, transparent 40%, transparent 60%, rgba(255,255,255,.05) 100%)" }}
                />
              </div>
            </div>

            <div
              className="absolute pointer-events-none ss-cx"
              style={{
                bottom: "15px",
                left: "12%", right: "12%",
                height: "36px",
                background: `linear-gradient(90deg, ${feat.dark}75, ${feat.mid}60)`,
                filter: "blur(26px)",
                borderRadius: "50%",
                transition: "background .8s ease",
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}