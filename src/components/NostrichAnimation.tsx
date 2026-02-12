import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

/**
 * Animated Nostrich Hero Section
 * Features:
 * - Decentralized network of nodes (relays)
 * - Animated nostrich (ostrich) silhouette
 * - Connecting lines representing the protocol
 * - Floating keys and messages
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
          <div className="text-primary-500 text-6xl font-bold">
            Nostrich.love
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full h-[500px] overflow-hidden", className)}>
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
        <motion.div
          key={i}
          className="absolute"
          style={{ left: node.x, top: node.y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            delay: node.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-3 h-3 bg-primary-500 rounded-full shadow-lg shadow-primary-500/50" />
        </motion.div>
      ))}
    </>
  );
}

function NostrichMascot() {
  // Stylized ostrich silhouette with purple theme
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Glowing aura */}
      <motion.div
        className="absolute inset-0 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-64 h-64 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full" />
      </motion.div>

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
        <motion.ellipse
          cx="100"
          cy="130"
          rx="45"
          ry="35"
          fill="url(#ostrichGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Neck */}
        <motion.rect
          x="85"
          y="60"
          width="30"
          height="70"
          rx="15"
          fill="url(#ostrichGradient)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ originY: 1 }}
        />

        {/* Head */}
        <motion.ellipse
          cx="100"
          cy="50"
          rx="25"
          ry="20"
          fill="url(#ostrichGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />

        {/* Beak */}
        <motion.path
          d="M 120 50 L 145 55 L 120 60 Z"
          fill="#F59E0B"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          style={{ originX: 0 }}
        />

        {/* Eye */}
        <motion.circle
          cx="108"
          cy="48"
          r="5"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        />
        <motion.circle
          cx="108"
          cy="48"
          r="2"
          fill="#1F2937"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, delay: 1.3 }}
        />

        {/* Legs */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
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
        </motion.g>

        {/* Crown feathers (showing it's the "king" of decentralized social) */}
        <motion.g
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
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
        </motion.g>
      </svg>

      {/* Key icon on body */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
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
      </motion.div>

      {/* NOSTRICH text */}
      <motion.div
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          NOSTRICH
        </span>
      </motion.div>
    </motion.div>
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
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ left: el.x, top: el.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.icon}
        </motion.div>
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
        <motion.line
          key={i}
          x1={beam.x1}
          y1={beam.y1}
          x2={beam.x2}
          y2={beam.y2}
          stroke="url(#beamGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0.2, 0.6, 0.2] }}
          transition={{
            pathLength: { duration: 2, delay: i * 0.3 },
            opacity: { duration: 3, repeat: Infinity, delay: i * 0.5 },
          }}
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
