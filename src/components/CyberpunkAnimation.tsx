import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
 */

interface RelayNode {
  id: number;
  x: number;
  y: number;
  url: string;
}

const relayUrls = [
  "wss://relay.nostr.band",
  "wss://relay.damus.io",
  "wss://nos.lol",
  "wss://relay.snort.social",
  "wss://nostr.wine",
  "wss://brb.io",
  "wss://eden.nostr.land",
];

export function CyberpunkHeroAnimation({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [relayNodes, setRelayNodes] = useState<RelayNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
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
    
    // Remove node after 3 seconds
    setTimeout(() => {
      setRelayNodes(prev => prev.filter(n => n.id !== newNode.id));
    }, 3000);
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
      <AnimatePresence>
        {relayNodes.map((node) => (
          <RelayNodeComponent key={node.id} node={node} />
        ))}
      </AnimatePresence>

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
    <motion.div
      className="absolute pointer-events-none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ left: node.x - 20, top: node.y - 20 }}
    >
      {/* Flash effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-400"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Node */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400 bg-cyan-400/20 animate-pulse" />
        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
      </div>
      
      {/* Label */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-cyan-400 font-mono"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {node.url}
      </motion.div>
    </motion.div>
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
        <motion.div
          key={i}
          className={cn(
            "absolute font-mono whitespace-nowrap overflow-hidden",
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
          }}
          initial={{ y: -100 }}
          animate={{ y: [0, 200] }}
          transition={{
            duration: col.isFast ? col.duration * 0.5 : col.duration,
            repeat: Infinity,
            ease: "linear",
            delay: col.delay,
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
        </motion.div>
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
      {/* Shockwave on hover */}
      <AnimatePresence>
        {isHovered && !prefersReducedMotion && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400"
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 w-64 h-64 -m-32"
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
      </motion.div>

      {/* Inner rotating ring (opposite direction) */}
      <motion.div
        className="absolute inset-0 w-48 h-48 -m-24"
        animate={prefersReducedMotion ? {} : { rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
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
      </motion.div>

      {/* Central key icon with glow */}
      <motion.div
        className="relative w-24 h-24 cursor-pointer"
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        whileHover={prefersReducedMotion ? {} : { scale: 1.15, rotate: 5 }}
      >
        {/* Neon bloom glow - hexagon shaped to match SVG */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <svg viewBox="0 0 100 100" className="w-[120%] h-[120%]" style={{ filter: "blur(15px)" }}>
            <polygon
              points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
              fill="url(#hexGradient)"
              opacity="0.6"
            />
          </svg>
        </motion.div>
        
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
      </motion.div>

      {/* Orbiting nodes */}
      {!prefersReducedMotion && [0, 90, 180, 270].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [0, Math.cos((angle * Math.PI) / 180) * 80],
            y: [0, Math.sin((angle * Math.PI) / 180) * 80],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.5,
          }}
          aria-hidden="true"
        >
          <div className="w-full h-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        </motion.div>
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
        <motion.div
          key={i}
          className={cn(
            "absolute text-2xl cursor-pointer select-none",
            el.color
          )}
          style={{ left: el.x, top: el.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: hoveredIndex === i ? 1 : [0.4, 0.9, 0.4],
            scale: hoveredIndex === i ? 1.5 : [1, 1.2, 1],
            y: [0, -15, 0],
            rotate: hoveredIndex === i ? 360 : 0,
          }}
          transition={{
            duration: 4 + i,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            rotate: { duration: 0.5 },
          }}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          whileHover={{ scale: 1.5 }}
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
          <AnimatePresence>
            {hoveredIndex === i && (
              <motion.span
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap text-white font-mono"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {el.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Additional circuit lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <motion.line
            key={`circuit-${i}`}
            x1={`${20 + i * 15}%`}
            y1="85%"
            x2={`${25 + i * 15}%`}
            y2="95%"
            stroke="#8B5CF6"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0.2, 0.6, 0.2] }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.2 },
              opacity: { duration: 3, repeat: Infinity, delay: i * 0.3 },
            }}
          />
        ))}
      </svg>
    </>
  );
}
