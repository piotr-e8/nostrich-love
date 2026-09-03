import React, { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "../lib/utils";
import { LogoText } from "./ui/LogoText";

/**
 * Cyberpunk-style Nostr Network Animation
 * Features:
 * - Matrix-style falling characters
 * - Glitch effects with scramble
 * - Neon grid cityscape with mouse spotlight
 * - Interactive relay node spawning
 * - Floating keys and lightning bolts
 * - Circuit board patterns with bloom effects
 * - Retro-futuristic aesthetic
 * - Accessibility: prefers-reduced-motion support
 *
 * Animations are plain CSS. Bespoke keyframes live in the <style> block
 * below (motion-library removal #28); shared enter animations come from
 * tailwind.config.js.
 */

interface RelayNode {
  id: number;
  x: number;
  y: number;
  url: string;
}

const relayUrls = [
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.snort.social",
  "wss://nostr.wine",
  "wss://eden.nostr.land",
];

export function CyberpunkHeroAnimation({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [relayNodes, setRelayNodes] = useState<RelayNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setMounted(true);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
      // Clear all pending timeouts on unmount
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || prefersReducedMotion) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const url = relayUrls[Math.floor(Math.random() * relayUrls.length)];

    const newNode: RelayNode = {
      id: Date.now(),
      x,
      y,
      url,
    };

    setRelayNodes(prev => [...prev, newNode]);

    // Remove node after 3 seconds - track timeout for cleanup
    const timeout = setTimeout(() => {
      setRelayNodes(prev => prev.filter(n => n.id !== newNode.id));
      // Remove timeout from ref after it fires
      timeoutsRef.current = timeoutsRef.current.filter(t => t !== timeout);
    }, 3000);
    timeoutsRef.current.push(timeout);
  }, [prefersReducedMotion]);

  // if (!mounted) {
  //   return (
  //     <div
  //       className={cn(
  //         "relative w-full h-[500px] bg-black overflow-hidden",
  //         className,
  //       )}
  //     >
  //       <div className="absolute inset-0 flex items-center justify-center">
  //         <div className="text-cyan-400 text-6xl font-bold tracking-wider">
  //           NOSTR.LOVE
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[500px] overflow-hidden bg-black cursor-crosshair",
        className,
      )}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Bespoke keyframes for this decorative art component. Names are
          prefixed to avoid collisions (the style tag is not scoped). */}
      <style>{`
        @keyframes cyber-flash {
          from { transform: scale(0); opacity: 1; }
          to { transform: scale(3); opacity: 0; }
        }
        @keyframes cyber-rain {
          from { transform: translateY(0); }
          to { transform: translateY(200px); }
        }
        @keyframes cyber-shockwave {
          from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        @keyframes cyber-orbit {
          from { transform: translate(0, 0); }
          to { transform: translate(var(--orbit-x), var(--orbit-y)); }
        }
        @keyframes cyber-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-15px) scale(1.2); opacity: 0.9; }
        }
        @keyframes cyber-hover-pop {
          to { transform: scale(1.5) rotate(360deg); opacity: 1; }
        }
        @keyframes cyber-beam-draw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes cyber-beam-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        .cyber-flash {
          animation: cyber-flash 0.5s ease-out forwards;
        }
        .cyber-rain {
          animation: cyber-rain linear infinite;
        }
        .cyber-shockwave {
          animation: cyber-shockwave 1s ease-out forwards;
        }
        .cyber-orbit {
          animation: cyber-orbit 4s ease-in-out infinite alternate;
        }
        .cyber-float {
          animation: cyber-float ease-in-out infinite;
        }
        .cyber-hover-pop {
          animation: cyber-hover-pop 0.5s ease-out forwards;
        }
        .cyber-beam {
          stroke-dasharray: 1;
          animation:
            cyber-beam-draw 2s ease-out both,
            cyber-beam-pulse 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .cyber-flash, .cyber-rain, .cyber-shockwave, .cyber-orbit,
          .cyber-float, .cyber-hover-pop, .cyber-beam {
            animation: none;
          }
        }
      `}</style>

      {/* Animated grid background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black"
        aria-hidden="true"
      />

      {/* Mouse-following spotlight */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none z-5 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px,
              rgba(139, 92, 246, 0.15), transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Perspective grid floor */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gridFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* Horizontal lines with perspective */}
        {[...Array(20)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={300 + i * 10}
            x2="100%"
            y2={300 + i * 10 + i * 5}
            stroke="url(#gridFade)"
            strokeWidth="1"
            opacity={0.3 + i * 0.02}
          />
        ))}
        {/* Vertical lines converging to center */}
        {[...Array(15)].map((_, i) => {
          const x = (i / 14) * 100;
          return (
            <line
              key={`v-${i}`}
              x1={`${x}%`}
              y1="60%"
              x2={`${50 + (x - 50) * 3}%`}
              y2="100%"
              stroke="#8B5CF6"
              strokeWidth="1"
              opacity={0.2}
            />
          );
        })}
      </svg>

      {/* Matrix rain effect */}
      {!prefersReducedMotion && <MatrixRain />}

      {/* Central circuit board hub */}
      <CircuitHub prefersReducedMotion={prefersReducedMotion} />

      {/* Click-spawned relay nodes */}
      {relayNodes.map((node) => (
        <RelayNodeComponent key={node.id} node={node} />
      ))}

      {/* Logo text with scramble effect
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
        <LogoText
          enableScramble={!prefersReducedMotion}
          enableGlitch={!prefersReducedMotion}
          showTagline={true}
          size="lg"
        />
      </div> */}

      {/* Floating cyberpunk elements */}
      {!prefersReducedMotion && <FloatingCyberElements />}

      {/* Scan lines - reduced opacity */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.01),rgba(0,0,255,0.04))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-60"
        aria-hidden="true"
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function RelayNodeComponent({ node }: { node: RelayNode }) {
  return (
    <div
      className="animate-scale-in motion-reduce:animate-none absolute pointer-events-none"
      style={{ left: node.x - 20, top: node.y - 20 }}
    >
      {/* Flash effect */}
      <div className="cyber-flash absolute inset-0 rounded-full bg-cyan-400" />

      {/* Node */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400 bg-cyan-400/20 animate-pulse" />
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
      </div>

      {/* Label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-cyan-400 font-mono">
        <div
          className="animate-slide-down motion-reduce:animate-none"
          style={{ animationDelay: "200ms" }}
        >
          {node.url}
        </div>
      </div>
    </div>
  );
}

function MatrixRain() {
  const characters =
    "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  const nostrMessages = ["DECENTRALIZED", "CENSORSHIP", "RESISTANT", "NOSTR", "FREEDOM", "PRIVACY"];

  // Memoize random values to prevent re-renders
  const [columns] = useState(() =>
    [...Array(10)].map((_, i) => ({
      left: `${i * 10 + 5}%`,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      isFast: Math.random() > 0.7,
      showMessage: Math.random() > 0.9,
      message: nostrMessages[Math.floor(Math.random() * nostrMessages.length)],
      characters: [...Array(20)].map(() =>
        characters[Math.floor(Math.random() * characters.length)]
      ),
    }))
  );

  return (
    <>
      {columns.map((col, i) => (
        <div
          key={i}
          className={cn(
            "cyber-rain absolute font-mono whitespace-nowrap overflow-hidden",
            col.isFast ? "text-cyan-300/50 text-sm" : "text-cyan-500/30 text-xs"
          )}
          style={{
            left: col.left,
            top: 0,
            width: "1em",
            height: "40%",
            writingMode: "vertical-rl",
            textOrientation: "upright",
            willChange: "transform",
            animationDuration: `${col.isFast ? col.duration * 0.5 : col.duration}s`,
            animationDelay: `${col.delay}s`,
          }}
          aria-hidden="true"
        >
          {col.showMessage ? (
            col.message.split("").map((char, j) => (
              <span key={j} className="text-cyan-300 font-bold">
                {char}
              </span>
            ))
          ) : (
            col.characters.map((char, j) => (
              <span key={j}>{char}</span>
            ))
          )}
        </div>
      ))}
    </>
  );
}

function CircuitHub({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Shockwave on hover (one-shot, stays faded out while hover persists) */}
      {isHovered && !prefersReducedMotion && (
        <div className="cyber-shockwave absolute left-1/2 top-1/2 w-[400px] h-[400px] rounded-full border-2 border-cyan-400" />
      )}

      {/* Outer rotating ring */}
      <div
        className={cn(
          "absolute inset-0 w-64 h-64 -m-32",
          !prefersReducedMotion &&
            "animate-spin motion-reduce:animate-none [animation-duration:20s]"
        )}
        style={{ willChange: "transform" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="0.5"
            strokeDasharray="10 5"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Inner rotating ring (opposite direction) */}
      <div
        className={cn(
          "absolute inset-0 w-48 h-48 -m-24",
          !prefersReducedMotion &&
            "animate-spin motion-reduce:animate-none [animation-duration:15s] [animation-direction:reverse]"
        )}
        style={{ willChange: "transform" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="0.5"
            strokeDasharray="5 10"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Central key icon with glow */}
      <div
        className={cn(
          "relative w-24 h-24 cursor-pointer",
          !prefersReducedMotion &&
            "animate-pulse-scale motion-reduce:animate-none [animation-duration:3s]"
        )}
      >
        {/* Neon bloom glow - hexagon shaped to match SVG */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none",
            !prefersReducedMotion && "animate-pulse motion-reduce:animate-none [animation-duration:3s]"
          )}
        >
          <svg viewBox="0 0 100 100" className="w-[120%] h-[120%]" style={{ filter: "blur(15px)" }}>
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="url(#hexGradient)"
              opacity="0.6"
            />
          </svg>
        </div>

        <svg viewBox="0 0 100 100" className="w-full h-full relative">
          <defs>
            <linearGradient
              id="hexGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
            fill="rgba(0, 0, 0, 0.7)"
            stroke="url(#hexGradient)"
            strokeWidth="2"
            filter="url(#glow)"
          />
          {/* Key symbol */}
          <g transform="translate(50, 50)" filter="url(#glow)">
            <circle
              cx="0"
              cy="-5"
              r="8"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="3"
              x2="0"
              y2="20"
              stroke="#06B6D4"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="12"
              x2="6"
              y2="12"
              stroke="#06B6D4"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="18"
              x2="4"
              y2="18"
              stroke="#06B6D4"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>

      {/* Orbiting nodes */}
      {!prefersReducedMotion && [0, 90, 180, 270].map((angle, i) => (
        <div
          key={i}
          className="cyber-orbit absolute w-3 h-3"
          style={
            {
              left: "50%",
              top: "50%",
              "--orbit-x": `${Math.cos((angle * Math.PI) / 180) * 80}px`,
              "--orbit-y": `${Math.sin((angle * Math.PI) / 180) * 80}px`,
              animationDelay: `${i * 0.5}s`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        >
          <div className="w-full h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        </div>
      ))}
    </div>
  );
}

function FloatingCyberElements() {
  const elements = [
    { icon: "⚡", x: "15%", y: "30%", color: "text-yellow-400", label: "Zaps" },
    { icon: "🔐", x: "85%", y: "25%", color: "text-cyan-400", label: "Secure" },
    { icon: "💬", x: "80%", y: "70%", color: "text-green-400", label: "Social" },
    { icon: "🔑", x: "20%", y: "75%", color: "text-purple-400", label: "Keys" },
    { icon: "📡", x: "90%", y: "50%", color: "text-pink-400", label: "Relays" },
    { icon: "⛓️", x: "10%", y: "50%", color: "text-orange-400", label: "Decentralized" },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {elements.map((el, i) => (
        <div
          key={i}
          className={cn(
            "absolute text-2xl cursor-pointer select-none",
            hoveredIndex === i ? "cyber-hover-pop" : "cyber-float",
            el.color
          )}
          style={{
            left: el.x,
            top: el.y,
            animationDuration: hoveredIndex === i ? undefined : `${4 + i}s`,
            animationDelay: hoveredIndex === i ? undefined : `${i * 0.3}s`,
          }}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-hidden="true"
        >
          <span
            style={{
              filter: hoveredIndex === i
                ? "drop-shadow(0 0 15px currentColor)"
                : "drop-shadow(0 0 8px currentColor)"
            }}
          >
            {el.icon}
          </span>

          {/* Label on hover */}
          {hoveredIndex === i && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap text-white font-mono">
              <span className="animate-slide-down motion-reduce:animate-none inline-block">
                {el.label}
              </span>
            </span>
          )}
        </div>
      ))}

      {/* Additional circuit lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <line
            key={`circuit-${i}`}
            className="cyber-beam"
            pathLength={1}
            x1={`${20 + i * 15}%`}
            y1="85%"
            x2={`${25 + i * 15}%`}
            y2="95%"
            stroke="#8B5CF6"
            strokeWidth="1"
            style={{ animationDelay: `${i * 0.2}s, ${i * 0.3}s` }}
          />
        ))}
      </svg>
    </>
  );
}
