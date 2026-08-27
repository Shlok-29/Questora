import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, MapPin, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { HERO_SLIDES } from "../data/heroSlides";

export default function CarouselHero({ onExplore }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide]       = useState(null);
  const [direction, setDirection]       = useState("right");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos]         = useState({ x: 0, y: 0 });
  const [hoverZone, setHoverZone]       = useState(null);
  const [hoverProgress, setHoverProgress] = useState(0);
  const [cursorPos, setCursorPos]       = useState({ x: -200, y: -200 });

  const autoPlayRef   = useRef(null);
  const hoverTimerRef = useRef(null);
  const hoverStartRef = useRef(null);
  const HOVER_MS      = 700;
  const INTERVAL_MS   = 5000;

  /* ── navigation ── */
  const goTo = useCallback((nextIndex, dir = "right") => {
    if (isTransitioning || nextIndex === currentSlide) return;
    setDirection(dir);
    setPrevSlide(currentSlide);
    setIsTransitioning(true);
    setCurrentSlide(nextIndex);
    setTimeout(() => { setPrevSlide(null); setIsTransitioning(false); }, 700);
  }, [isTransitioning, currentSlide]);

  const goNext = useCallback(() =>
    goTo(currentSlide === HERO_SLIDES.length - 1 ? 0 : currentSlide + 1, "right"),
    [goTo, currentSlide]);

  const goPrev = useCallback(() =>
    goTo(currentSlide === 0 ? HERO_SLIDES.length - 1 : currentSlide - 1, "left"),
    [goTo, currentSlide]);

  const resetAutoPlay = useCallback(() => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(goNext, INTERVAL_MS);
  }, [goNext]);

  useEffect(() => {
    autoPlayRef.current = setInterval(goNext, INTERVAL_MS);
    return () => clearInterval(autoPlayRef.current);
  }, [goNext]);

  /* ── mouse handling ── */
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const w = window.innerWidth, h = window.innerHeight;
    setCursorPos({ x: clientX, y: clientY });
    setMousePos({
      x: (0.5 - clientX / w) * 24,
      y: (0.5 - clientY / h) * 14,
    });

    const edgeFrac = 0.13;
    const rEdge = w * (1 - edgeFrac), lEdge = w * edgeFrac;

    if (clientX >= rEdge) {
      const p = (clientX - rEdge) / (w * edgeFrac);
      setHoverZone("right"); setHoverProgress(Math.min(p, 1));
      if (!hoverStartRef.current) {
        hoverStartRef.current = Date.now();
        hoverTimerRef.current = setTimeout(() => {
          goNext(); resetAutoPlay(); hoverStartRef.current = null;
        }, HOVER_MS);
      }
    } else if (clientX <= lEdge) {
      const p = (lEdge - clientX) / (w * edgeFrac);
      setHoverZone("left"); setHoverProgress(Math.min(p, 1));
      if (!hoverStartRef.current) {
        hoverStartRef.current = Date.now();
        hoverTimerRef.current = setTimeout(() => {
          goPrev(); resetAutoPlay(); hoverStartRef.current = null;
        }, HOVER_MS);
      }
    } else {
      setHoverZone(null); setHoverProgress(0);
      clearTimeout(hoverTimerRef.current); hoverStartRef.current = null;
    }
  }, [goNext, goPrev, resetAutoPlay]);

  const handleMouseLeave = () => {
    setHoverZone(null); setHoverProgress(0);
    clearTimeout(hoverTimerRef.current); hoverStartRef.current = null;
    setCursorPos({ x: -200, y: -200 });
  };

  const slide = HERO_SLIDES[currentSlide];
  const totalStr   = String(HERO_SLIDES.length).padStart(2, "0");
  const currentStr = String(currentSlide + 1).padStart(2, "0");

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position:"relative", height:"100vh", overflow:"hidden", background:"#000", fontFamily:"'DM Sans', sans-serif" }}
    >
      {/* ── FONTS + KEYFRAMES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes slideInR  { from{transform:translateX(5%) scale(1.02);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
        @keyframes slideInL  { from{transform:translateX(-5%) scale(1.02);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
        @keyframes slideOutL { from{transform:translateX(0);opacity:1} to{transform:translateX(-3%);opacity:0} }
        @keyframes slideOutR { from{transform:translateX(0);opacity:1} to{transform:translateX(3%);opacity:0} }
        @keyframes kenBurns  { from{transform:scale(1.14)} to{transform:scale(1.04)} }
        @keyframes riseUp    { from{opacity:0;transform:translateY(38px)} to{opacity:1;transform:translateY(0)} }
        @keyframes riseUp2   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes progressFill { from{width:0%} to{width:100%} }
        @keyframes tickerIn  { from{opacity:0;transform:translateY(120%)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes dotPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }

        .ch-rise1 { animation: riseUp  0.72s cubic-bezier(0.22,1,0.36,1) both; }
        .ch-rise2 { animation: riseUp2 0.65s 0.16s cubic-bezier(0.22,1,0.36,1) both; }
        .ch-rise3 { animation: fadeUp  0.60s 0.30s cubic-bezier(0.22,1,0.36,1) both; }
        .ch-prog  { animation: progressFill ${INTERVAL_MS}ms linear forwards; }
        .ch-tick  { animation: tickerIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }

        .ch-cta-btn:hover { transform:translateY(-2px) scale(1.02) !important; box-shadow:0 16px 44px rgba(251,146,60,0.45),0 4px 12px rgba(0,0,0,0.3) !important; }
        .ch-cta-btn:active { transform:scale(0.98) !important; }

        .ch-nav-btn:hover { background:rgba(251,146,60,0.18) !important; border-color:rgba(251,146,60,0.35) !important; }

        .ch-badge-shine {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%);
          background-size:200% auto;
          animation: shimmer 3.5s linear infinite;
        }
      `}</style>

      {/* ── CUSTOM CURSOR ── */}
      <div style={{
        position:"fixed",
        left: cursorPos.x, top: cursorPos.y,
        width: hoverZone ? 60 : 10,
        height: hoverZone ? 60 : 10,
        borderRadius:"50%",
        background: hoverZone ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.75)",
        border: hoverZone ? "1.5px solid rgba(251,146,60,0.55)" : "none",
        transform:"translate(-50%,-50%)",
        transition:"width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.25s",
        pointerEvents:"none", zIndex:9999,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        {hoverZone && (
          <span style={{ color:"rgba(251,146,60,0.9)", fontSize:10, fontWeight:600, letterSpacing:"0.08em" }}>
            {hoverZone === "right" ? "NEXT" : "PREV"}
          </span>
        )}
      </div>

      {/* ── SLIDES ── */}
      {HERO_SLIDES.map((s, i) => {
        const isActive = currentSlide === i;
        const isPrev   = prevSlide === i;
        if (!isActive && !isPrev) return null;
        return (
          <div key={i} style={{ position:"absolute", inset:0, zIndex: isActive ? 10 : 9 }}>
            <div style={{
              position:"absolute", inset:0,
              animation: isActive && !isPrev
                ? `slideIn${direction === "right" ? "R" : "L"} 0.7s cubic-bezier(0.76,0,0.24,1) forwards`
                : isPrev
                  ? `slideOut${direction === "right" ? "L" : "R"} 0.7s cubic-bezier(0.76,0,0.24,1) forwards`
                  : "none",
            }}>
              <img src={s.image} alt={s.location} style={{
                width:"100%", height:"100%", objectFit:"cover",
                transform:`scale(1.1) translate3d(${mousePos.x}px,${mousePos.y}px,0)`,
                transition:"transform 0.6s ease-out",
                animation: isActive ? "kenBurns 9s ease-out forwards" : "none",
              }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.8) 100%)" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(108deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.18) 52%, transparent 100%)" }}/>
            </div>
          </div>
        );
      })}

      {/* ── AMBIENT GLOWS ── */}
      <div style={{ position:"absolute", top:"-8%", left:"-4%", width:"42rem", height:"42rem", background:"radial-gradient(circle, rgba(251,146,60,0.07) 0%, transparent 70%)", pointerEvents:"none", zIndex:20 }}/>
      <div style={{ position:"absolute", bottom:"-8%", right:"-4%", width:"38rem", height:"38rem", background:"radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", pointerEvents:"none", zIndex:20 }}/>

      {/* ── EDGE HOVER ZONES ── */}
      {["left","right"].map(side => (
        <div key={side} style={{
          position:"absolute", top:0, [side]:0, width:"13%", height:"100%", zIndex:40,
          opacity: hoverZone === side ? 1 : 0,
          transition:"opacity 0.25s ease",
          background: hoverZone === side
            ? `linear-gradient(to ${side==="left"?"right":"left"}, rgba(0,0,0,${0.28+hoverProgress*0.18}), transparent)`
            : "transparent",
          pointerEvents:"none",
          display:"flex", alignItems:"center",
          justifyContent: side==="left" ? "flex-start" : "flex-end",
        }}>
          <div style={{ padding: side==="left"?"0 0 0 18px":"0 18px 0 0", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
            {side==="left"
              ? <ChevronLeft size={30} color="rgba(255,255,255,0.85)"/>
              : <ChevronRight size={30} color="rgba(255,255,255,0.85)"/>}
            <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
              <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(251,146,60,0.8)" strokeWidth="1.5"
                strokeDasharray={`${hoverProgress*63} 63`} strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      ))}

      {/* ── SLIDE COUNTER (top-right) ── */}
      <div style={{ position:"absolute", top:28, right:28, zIndex:50, display:"flex", alignItems:"baseline", gap:8 }}>
        <span key={`c-${currentSlide}`} className="ch-tick" style={{
          fontFamily:"'Playfair Display', serif", fontSize:26, fontWeight:700, color:"rgba(255,255,255,0.92)", lineHeight:1,
        }}>{currentStr}</span>
        <div style={{ width:32, height:1, background:"rgba(255,255,255,0.22)", alignSelf:"center" }}/>
        <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontWeight:400, letterSpacing:"0.04em" }}>{totalStr}</span>
      </div>

      {/* ── VERTICAL DESTINATION STRIP (right) ── */}
      <div style={{
        position:"absolute", right:28, top:"50%", transform:"translateY(-50%)",
        zIndex:40, display:"flex", flexDirection:"column", gap:10, alignItems:"flex-end",
      }}>
        {HERO_SLIDES.map((s, i) => (
          <button key={i} onClick={() => { goTo(i, i > currentSlide ? "right" : "left"); resetAutoPlay(); }}
            style={{
              display:"flex", alignItems:"center", gap:8, background:"none", border:"none",
              cursor:"pointer", padding:0,
              opacity: currentSlide === i ? 1 : 0.28,
              transform: currentSlide === i ? "translateX(0)" : "translateX(5px)",
              transition:"all 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {currentSlide === i && (
              <span style={{
                fontSize:9, fontWeight:500, letterSpacing:"0.16em", color:"rgba(255,255,255,0.75)",
                writingMode:"vertical-rl", textTransform:"uppercase",
              }}>
                {s.location?.split(",")[0]}
              </span>
            )}
            <div style={{
              width: currentSlide === i ? 2 : 1,
              height: currentSlide === i ? 36 : 14,
              background: currentSlide === i
                ? "linear-gradient(to bottom, #fb923c, #fbbf24)"
                : "rgba(255,255,255,0.35)",
              borderRadius:4, transition:"all 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}/>
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ position:"absolute", inset:0, zIndex:30, display:"flex", alignItems:"center" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 52px", width:"100%" }}>
          <div style={{ maxWidth:660 }}>

            {/* DESTINATION PILL */}
            <div key={`tag-${currentSlide}`} className="ch-rise1" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"5px 14px 5px 6px", borderRadius:999,
              border:"1px solid rgba(251,146,60,0.28)",
              background:"rgba(251,146,60,0.07)",
              backdropFilter:"blur(12px)",
              marginBottom:22,
            }}>
              <div style={{
                width:22, height:22, borderRadius:"50%",
                background:"rgba(251,146,60,0.18)",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <Compass size={11} color="rgba(251,146,60,0.9)"/>
              </div>
              <span style={{ fontSize:10, fontWeight:600, color:"rgba(251,146,60,0.8)", letterSpacing:"0.14em", textTransform:"uppercase" }}>
                Featured Destination
              </span>
            </div>

            {/* HEADLINE */}
            <div style={{ overflow:"hidden" }}>
              <h1 key={`h-${currentSlide}`} className="ch-rise1" style={{
                fontFamily:"'Playfair Display', serif",
                fontSize:"clamp(2.4rem, 5.2vw, 5rem)",
                fontWeight:900,
                lineHeight:0.93,
                letterSpacing:"-0.03em",
                color:"#f0ece6",
                margin:0,
                textShadow:"0 6px 28px rgba(0,0,0,0.55)",
              }}>
                {slide.quote}
              </h1>
            </div>

            {/* ACCENT LINE */}
            <div key={`ln-${currentSlide}`} className="ch-rise2" style={{
              width:44, height:2, marginTop:22, marginBottom:18,
              background:"linear-gradient(to right, #fb923c, #fbbf24)", borderRadius:2,
            }}/>

            {/* DESCRIPTION */}
            <p key={`p-${currentSlide}`} className="ch-rise2" style={{
              fontSize:14.5, lineHeight:1.72, color:"rgba(180,172,165,0.88)",
              fontWeight:400, maxWidth:440, margin:"0 0 32px 0",
            }}>
              Discover breathtaking landscapes, authentic local experiences,
              and unforgettable escapes crafted for modern travelers.
            </p>

            {/* ── BUTTON ROW ── both items on same baseline via flexbox row + align-items:center ── */}
            <div key={`btns-${currentSlide}`} className="ch-rise3"
              style={{ display:"flex", flexDirection:"row", alignItems:"center", gap:12, flexWrap:"wrap" }}
            >
              {/* PRIMARY CTA */}
              <button
                className="ch-cta-btn"
                onClick={() => { onExplore?.(); resetAutoPlay(); }}
                style={{
                  display:"inline-flex", alignItems:"center", justifyContent:"center", gap:9,
                  height:50, padding:"0 26px", borderRadius:13, border:"none",
                  background:"linear-gradient(135deg, #fb923c 0%, #f59e0b 100%)",
                  color:"#1c0900", fontFamily:"'DM Sans', sans-serif",
                  fontSize:14, fontWeight:600, letterSpacing:"0.01em",
                  cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                  boxShadow:"0 8px 28px rgba(251,146,60,0.32), 0 2px 6px rgba(0,0,0,0.28)",
                  transition:"transform 0.25s ease, box-shadow 0.25s ease",
                }}
              >
                <span>Explore Destinations</span>
                <ArrowRight size={15} strokeWidth={2.5}/>
              </button>

              {/* SECONDARY TRUST BADGE — same height, same border-radius */}
              <div
                className="ch-badge-shine"
                style={{
                  display:"inline-flex", alignItems:"center", gap:10,
                  height:50, padding:"0 18px", borderRadius:13,
                  border:"1px solid rgba(255,255,255,0.1)",
                  background:"rgba(255,255,255,0.035)",
                  backdropFilter:"blur(18px)",
                  whiteSpace:"nowrap", flexShrink:0,
                }}
              >
                <div style={{
                  width:26, height:26, borderRadius:8,
                  background:"rgba(52,211,153,0.14)",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(52,211,153,0.88)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.42)", letterSpacing:"0.03em" }}>
                  Verified Locals&nbsp;•&nbsp;Direct Booking
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, zIndex:40,
        padding:"0 52px 28px",
        display:"flex", alignItems:"flex-end", justifyContent:"space-between",
        background:"linear-gradient(to top, rgba(0,0,0,0.48) 0%, transparent 100%)",
      }}>

        {/* LOCATION BADGE */}
        <div key={`loc-${currentSlide}`} className="ch-rise3" style={{
          display:"flex", alignItems:"center", gap:12,
          padding:"9px 16px", borderRadius:14,
          background:"rgba(0,0,0,0.32)", border:"1px solid rgba(255,255,255,0.09)",
          backdropFilter:"blur(20px)",
        }}>
          <div style={{
            width:34, height:34, borderRadius:9,
            background:"rgba(251,146,60,0.12)",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <MapPin size={15} color="rgba(251,146,60,0.78)"/>
          </div>
          <div>
            <p style={{ fontSize:9, fontWeight:500, color:"rgba(255,255,255,0.28)", letterSpacing:"0.2em", textTransform:"uppercase", margin:0, lineHeight:1 }}>
              Now Viewing
            </p>
            <h3 key={`ln2-${currentSlide}`} className="ch-tick" style={{
              fontFamily:"'Playfair Display', serif",
              fontSize:15, fontWeight:700, color:"#ebe7e1",
              margin:"3px 0 0", whiteSpace:"nowrap",
            }}>
              {slide.location}
            </h3>
          </div>
        </div>

        {/* CONTROLS ROW */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>

          <button className="ch-nav-btn" onClick={() => { goPrev(); resetAutoPlay(); }} style={{
            width:36, height:36, borderRadius:10,
            background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", transition:"all 0.2s", backdropFilter:"blur(8px)",
          }}>
            <ChevronLeft size={15} color="rgba(255,255,255,0.65)"/>
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            {HERO_SLIDES.map((_, i) => (
              <button key={i}
                onClick={() => { goTo(i, i > currentSlide ? "right" : "left"); resetAutoPlay(); }}
                style={{
                  position:"relative", overflow:"hidden", border:"none", padding:0,
                  borderRadius:99, cursor:"pointer",
                  background: currentSlide === i ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.2)",
                  width: currentSlide === i ? 44 : 7,
                  height: currentSlide === i ? 3 : 3,
                  transition:"width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {currentSlide === i && (
                  <div key={`prog-${currentSlide}`} className="ch-prog" style={{
                    position:"absolute", top:0, bottom:0, left:0,
                    background:"linear-gradient(to right, #fb923c, #fbbf24)",
                    borderRadius:99, width:"0%",
                  }}/>
                )}
              </button>
            ))}
          </div>

          <button className="ch-nav-btn" onClick={() => { goNext(); resetAutoPlay(); }} style={{
            width:36, height:36, borderRadius:10,
            background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", transition:"all 0.2s", backdropFilter:"blur(8px)",
          }}>
            <ChevronRight size={15} color="rgba(255,255,255,0.65)"/>
          </button>

        </div>
      </div>
    </section>
  );
}