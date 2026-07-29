import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";

/**
 * Animated Nostrich Hero Section
 * Features:
 * - Decentralized network of nodes (relays)
 * - Animated nostrich (ostrich) silhouette
 * - Connecting lines representing the protocol
 * - Floating keys and messages
 *
 * Animations are plain CSS. Bespoke keyframes live in the <style> block
 * below (motion-library removal #28); shared enter animations come from
 * tailwind.config.js.
 */

export function NostrichHeroAnimation({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative w-full h-[500px] bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden",
          className,
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Placeholder sits on an unconditional dark gradient, so use the
              dark-surface shade in both themes. */}
          <div className="text-primary-400 text-6xl font-bold">
            Nostrich.love
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-[500px] overflow-hidden", className)}>
      {/* Bespoke keyframes for this decorative art component. Names are
          prefixed to avoid collisions (the style tag is not scoped). */}
      <style>{`
        @keyframes nostrich-node-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes nostrich-aura {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        @keyframes nostrich-float {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
        @keyframes nostrich-part-in {
          from { opacity: 0; transform: scale(0); }
        }
        @keyframes nostrich-neck-in {
          from { transform: scaleY(0); }
        }
        @keyframes nostrich-beak-in {
          from { transform: scaleX(0); }
        }
        @keyframes nostrich-fade-in {
          from { opacity: 0; }
        }
        @keyframes nostrich-crown-in {
          from { opacity: 0; transform: scale(0) rotate(-45deg); }
        }
        @keyframes nostrich-beam-draw {
          from { stroke-dashoffset: 1; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nostrich-beam-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        .nostrich-part {
          transform-box: fill-box;
          transform-origin: center;
          animation: nostrich-part-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .nostrich-neck {
          transform-box: fill-box;
          transform-origin: bottom;
          animation: nostrich-neck-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .nostrich-beak {
          transform-box: fill-box;
          transform-origin: left;
          animation: nostrich-beak-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .nostrich-legs {
          animation: nostrich-fade-in 0.5s ease-out both;
        }
        .nostrich-crown {
          transform-box: fill-box;
          transform-origin: center;
          animation: nostrich-crown-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .nostrich-node {
          animation: nostrich-node-pulse 3s ease-in-out infinite;
        }
        .nostrich-aura {
          animation: nostrich-aura 4s ease-in-out infinite;
        }
        .nostrich-float {
          animation: nostrich-float 4s ease-in-out infinite;
        }
        .nostrich-beam {
          stroke-dasharray: 1;
          animation:
            nostrich-beam-draw 2s ease-out both,
            nostrich-beam-pulse 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .nostrich-part, .nostrich-neck, .nostrich-beak, .nostrich-legs,
          .nostrich-crown, .nostrich-node, .nostrich-aura, .nostrich-float,
          .nostrich-beam {
            animation: none;
          }
        }
      `}</style>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900" />

      {/* Animated grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Decentralized network nodes */}
      <NetworkNodes />

      {/* Central Nostrich */}
      <NostrichMascot />

      {/* Floating elements */}
      <FloatingElements />

      {/* Connection beams */}
      <ConnectionBeams />
    </div>
  );
}

function NetworkNodes() {
  const nodes = [
    { x: "15%", y: "25%", delay: 0 },
    { x: "85%", y: "30%", delay: 0.5 },
    { x: "25%", y: "70%", delay: 1 },
    { x: "75%", y: "65%", delay: 1.5 },
    { x: "50%", y: "15%", delay: 2 },
    { x: "10%", y: "50%", delay: 2.5 },
    { x: "90%", y: "55%", delay: 3 },
    { x: "40%", y: "85%", delay: 3.5 },
    { x: "60%", y: "80%", delay: 4 },
  ];

  return (
    <>
      {nodes.map((node, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: node.x, top: node.y }}
        >
          <div
            className="nostrich-node w-3 h-3 bg-primary-500 rounded-full shadow-lg shadow-primary-500/50"
            style={{ animationDelay: `${node.delay}s` }}
          />
        </div>
      ))}
    </>
  );
}

function NostrichMascot() {
  // Stylized ostrich silhouette with purple theme
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Inner wrapper carries the enter animation so it doesn't clobber the
          centering transform on the positioned parent. */}
      <div
        className="animate-scale-in motion-reduce:animate-none [animation-duration:1s]"
        style={{ animationDelay: "500ms" }}
      >
        {/* Glowing aura */}
        <div className="nostrich-aura absolute inset-0 blur-3xl">
          <div className="w-64 h-64 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full" />
        </div>

        {/* Ostrich/Nostrich SVG */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          className="relative z-10 drop-shadow-2xl"
        >
          <defs>
            <linearGradient
              id="ostrichGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>

          {/* Body */}
          <ellipse
            className="nostrich-part"
            style={{ animationDelay: "300ms", animationDuration: "0.8s" }}
            cx="100"
            cy="130"
            rx="45"
            ry="35"
            fill="url(#ostrichGradient)"
          />

          {/* Neck */}
          <rect
            className="nostrich-neck"
            style={{ animationDelay: "500ms" }}
            x="85"
            y="60"
            width="30"
            height="70"
            rx="15"
            fill="url(#ostrichGradient)"
          />

          {/* Head */}
          <ellipse
            className="nostrich-part"
            style={{ animationDelay: "800ms", animationDuration: "0.5s" }}
            cx="100"
            cy="50"
            rx="25"
            ry="20"
            fill="url(#ostrichGradient)"
          />

          {/* Beak */}
          <path
            className="nostrich-beak"
            style={{ animationDelay: "1000ms" }}
            d="M 120 50 L 145 55 L 120 60 Z"
            fill="#F59E0B"
          />

          {/* Eye */}
          <circle
            className="nostrich-part"
            style={{ animationDelay: "1100ms", animationDuration: "0.3s" }}
            cx="108"
            cy="48"
            r="5"
            fill="white"
          />
          <circle
            className="nostrich-part"
            style={{ animationDelay: "1300ms", animationDuration: "0.2s" }}
            cx="108"
            cy="48"
            r="2"
            fill="#1F2937"
          />

          {/* Legs */}
          <g className="nostrich-legs" style={{ animationDelay: "1200ms" }}>
            <rect
              x="80"
              y="160"
              width="8"
              height="30"
              rx="4"
              fill="url(#ostrichGradient)"
            />
            <rect
              x="112"
              y="160"
              width="8"
              height="30"
              rx="4"
              fill="url(#ostrichGradient)"
            />
          </g>

          {/* Crown feathers (showing it's the "king" of decentralized social) */}
          <g className="nostrich-crown" style={{ animationDelay: "1400ms" }}>
            <path
              d="M 85 35 Q 75 15 85 25"
              stroke="#8B5CF6"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M 100 30 Q 100 10 100 22"
              stroke="#8B5CF6"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M 115 35 Q 125 15 115 25"
              stroke="#8B5CF6"
              strokeWidth="3"
              fill="none"
            />
          </g>
        </svg>

        {/* Key icon on body */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="animate-scale-in motion-reduce:animate-none"
            style={{ animationDelay: "1600ms", animationDuration: "0.5s" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 12 L12 2 M12 2 L14 4 M12 2 L10 4" />
            </svg>
          </div>
        </div>

        {/* NOSTRICH text */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div
            className="animate-slide-up motion-reduce:animate-none"
            style={{ animationDelay: "1800ms", animationDuration: "0.8s" }}
          >
            <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              NOSTRICH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingElements() {
  const elements = [
    { icon: "🔑", x: "20%", y: "40%", delay: 0 },
    { icon: "⚡", x: "80%", y: "35%", delay: 0.5 },
    { icon: "💬", x: "75%", y: "75%", delay: 1 },
    { icon: "🔐", x: "25%", y: "80%", delay: 1.5 },
    { icon: "📡", x: "85%", y: "20%", delay: 2 },
  ];

  return (
    <>
      {elements.map((el, i) => (
        <div
          key={i}
          className="nostrich-float absolute text-2xl"
          style={{ left: el.x, top: el.y, animationDelay: `${el.delay}s` }}
        >
          {el.icon}
        </div>
      ))}
    </>
  );
}

function ConnectionBeams() {
  // Animated connection lines between nodes
  const beams = [
    { x1: "15%", y1: "25%", x2: "50%", y2: "50%" },
    { x1: "85%", y1: "30%", x2: "50%", y2: "50%" },
    { x1: "25%", y1: "70%", x2: "50%", y2: "50%" },
    { x1: "75%", y1: "65%", x2: "50%", y2: "50%" },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {beams.map((beam, i) => (
        <line
          key={i}
          className="nostrich-beam"
          pathLength={1}
          x1={beam.x1}
          y1={beam.y1}
          x2={beam.x2}
          y2={beam.y2}
          stroke="url(#beamGradient)"
          strokeWidth="2"
          style={{ animationDelay: `${i * 0.3}s, ${i * 0.5}s` }}
        />
      ))}
      <defs>
        <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
