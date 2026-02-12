import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Home,
  Send,
  Info,
  Building2,
  Check,
  Mailbox,
  User,
} from "lucide-react";
import { cn } from "../../lib/utils";

type Person = "alice" | "bob" | "carol";
type Relay = "relay1" | "relay2";

export function NostrSimulator({ className }: { className?: string }) {
  const [connections, setConnections] = useState<Record<Person, Relay[]>>({
    alice: ["relay1"],
    bob: ["relay1"],
    carol: ["relay2"],
  });

  const [animationPhase, setAnimationPhase] = useState<
    "idle" | "sending" | "processing" | "delivering" | "complete"
  >("idle");
  const [currentMessage, setCurrentMessage] = useState<string>("");

  function toggleConnection(person: Person, relay: Relay) {
    setConnections((prev) => {
      const has = prev[person].includes(relay);
      return {
        ...prev,
        [person]: has
          ? prev[person].filter((r) => r !== relay)
          : [...prev[person], relay],
      };
    });
  }

  function sendPost() {
    if (animationPhase !== "idle") return;

    setAnimationPhase("sending");
    setCurrentMessage("✉️ Alice writes a letter...");

    setTimeout(() => {
      const relayNames = connections.alice
        .map((r) => (r === "relay1" ? "Post Office 1" : "Post Office 2"))
        .join(" & ");
      setCurrentMessage(`📮 Dropping letter at ${relayNames}...`);
      setAnimationPhase("processing");
    }, 1000);

    setTimeout(() => {
      setCurrentMessage("🏤 Post office sorting mail...");
    }, 1800);

    setTimeout(() => {
      const recipients = ["bob", "carol"].filter((p) => receives(p as Person));
      if (recipients.length > 0) {
        const names = recipients
          .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
          .join(" & ");
        setCurrentMessage(`📬 Delivering to ${names}...`);
      } else {
        setCurrentMessage("📭 No one else shares this post office");
      }
      setAnimationPhase("delivering");
    }, 2600);

    setTimeout(() => {
      const bobReceives = receives("bob");
      const carolReceives = receives("carol");

      if (bobReceives && carolReceives) {
        setCurrentMessage("✅ Bob & Carol received the letter!");
      } else if (bobReceives) {
        setCurrentMessage(
          "✅ Bob received it! Carol uses a different post office"
        );
      } else if (carolReceives) {
        setCurrentMessage(
          "✅ Carol received it! Bob uses a different post office"
        );
      } else {
        setCurrentMessage("📭 No delivery - no one shares Alice's post office");
      }
      setAnimationPhase("complete");
    }, 3800);

    setTimeout(() => {
      setAnimationPhase("idle");
      setCurrentMessage("");
    }, 5500);
  }

  function receives(person: Person) {
    return connections.alice.some((r) => connections[person].includes(r));
  }

  const isAnimating = animationPhase !== "idle";

  return (
    <div className={cn("w-full my-8", className)}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/20 rounded-2xl mb-4">
            <Mailbox className="w-7 h-7 text-purple-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            How Nostr Works
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Think of relays as{" "}
            <span className="text-purple-400 font-semibold">post offices</span>.
            You choose which ones to use, and letters only reach people who use
            the same post offices.
          </p>
        </div>

        {/* Animation Status */}
        <AnimatePresence mode="wait">
          {currentMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 text-center"
            >
              <span className="inline-block bg-purple-500/20 text-purple-300 px-5 py-2.5 rounded-full text-sm font-medium border border-purple-500/30">
                {currentMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visualization */}
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-8 border border-gray-700/50">
          <div className="relative h-[300px] md:h-[350px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 600 350"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Connection Lines */}
              {connections.alice.map((relay) => (
                <motion.line
                  key={`alice-${relay}`}
                  x1="80"
                  y1="175"
                  x2="300"
                  y2={relay === "relay1" ? "87" : "262"}
                  stroke={isAnimating ? "#8b5cf6" : "#4b5563"}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
              {connections.bob.map((relay) => (
                <motion.line
                  key={`bob-${relay}`}
                  x1="520"
                  y1="87"
                  x2="300"
                  y2={relay === "relay1" ? "87" : "262"}
                  stroke={isAnimating ? "#8b5cf6" : "#4b5563"}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
              {connections.carol.map((relay) => (
                <motion.line
                  key={`carol-${relay}`}
                  x1="520"
                  y1="262"
                  x2="300"
                  y2={relay === "relay1" ? "87" : "262"}
                  stroke={isAnimating ? "#8b5cf6" : "#4b5563"}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.5 }}
                />
              ))}

              {/* Animation: Alice to Post Offices */}
              {animationPhase === "sending" &&
                connections.alice.map((relay) => (
                  <motion.g key={`to-${relay}`}>
                    <motion.circle
                      r="12"
                      fill="#fbbf24"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      initial={{ cx: 80, cy: 175 }}
                      animate={{
                        cx: 300,
                        cy: relay === "relay1" ? 87 : 262,
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                    <motion.text
                      fontSize="14"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      initial={{ x: 80, y: 175 }}
                      animate={{
                        x: 300,
                        y: relay === "relay1" ? 87 : 262,
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      ✉️
                    </motion.text>
                  </motion.g>
                ))}

              {/* Animation: Processing Dots */}
              {animationPhase === "processing" &&
                connections.alice.map((relay) => {
                  const y = relay === "relay1" ? 87 : 262;
                  return (
                    <g key={`process-${relay}`}>
                      {[0, 1, 2].map((i) => (
                        <motion.circle
                          key={i}
                          cx={300 + (i - 1) * 15}
                          cy={y + 45}
                          r="5"
                          fill="#34d399"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </g>
                  );
                })}

              {/* Animation: Post Offices to Recipients */}
              {(animationPhase === "delivering" ||
                animationPhase === "complete") &&
                (["bob", "carol"] as Person[]).map(
                  (person) =>
                    receives(person) &&
                    connections[person].map((relay) => {
                      const fromY = relay === "relay1" ? 87 : 262;
                      const toY = person === "bob" ? 87 : 262;
                      return (
                        <motion.g key={`from-${relay}-to-${person}`}>
                          <motion.circle
                            r="12"
                            fill="#fbbf24"
                            stroke="#f59e0b"
                            strokeWidth="2"
                            initial={{ cx: 300, cy: fromY }}
                            animate={{ cx: 520, cy: toY }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          />
                          <motion.text
                            fontSize="14"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            initial={{ x: 300, y: fromY }}
                            animate={{ x: 520, y: toY }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                          >
                            ✉️
                          </motion.text>
                        </motion.g>
                      );
                    })
                )}
            </svg>

            {/* Nodes */}
            {/* Alice */}
            <motion.div
              className={cn(
                "absolute flex flex-col items-center justify-center",
                "w-16 h-16 rounded-xl border-2 bg-rose-500/20 border-rose-500",
                animationPhase === "sending" && "shadow-lg shadow-rose-500/30"
              )}
              style={{ left: "13%", top: "50%", transform: "translate(-50%, -50%)" }}
              animate={animationPhase === "sending" ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: animationPhase === "sending" ? Infinity : 0 }}
            >
              <div className="relative">
                <Home className="w-6 h-6 text-rose-400" />
                {animationPhase === "sending" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-gray-800"
                  />
                )}
              </div>
              <span className="absolute -bottom-7 text-white text-xs font-medium whitespace-nowrap bg-gray-900/90 px-2 py-0.5 rounded">
                Alice
              </span>
            </motion.div>

            {/* Bob */}
            <motion.div
              className={cn(
                "absolute flex flex-col items-center justify-center",
                "w-16 h-16 rounded-xl border-2 bg-blue-500/20 border-blue-500",
                animationPhase === "delivering" &&
                  receives("bob") &&
                  "shadow-lg shadow-blue-500/30"
              )}
              style={{ left: "87%", top: "25%", transform: "translate(-50%, -50%)" }}
              animate={
                animationPhase === "delivering" && receives("bob")
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 0.5, repeat: animationPhase === "delivering" && receives("bob") ? Infinity : 0 }}
            >
              <div className="relative">
                <Home className="w-6 h-6 text-blue-400" />
                {animationPhase === "complete" && receives("bob") && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-gray-800"
                  />
                )}
              </div>
              <span className="absolute -bottom-7 text-white text-xs font-medium whitespace-nowrap bg-gray-900/90 px-2 py-0.5 rounded">
                Bob
              </span>
            </motion.div>

            {/* Carol */}
            <motion.div
              className={cn(
                "absolute flex flex-col items-center justify-center",
                "w-16 h-16 rounded-xl border-2 bg-violet-500/20 border-violet-500",
                animationPhase === "delivering" &&
                  receives("carol") &&
                  "shadow-lg shadow-violet-500/30"
              )}
              style={{ left: "87%", top: "75%", transform: "translate(-50%, -50%)" }}
              animate={
                animationPhase === "delivering" && receives("carol")
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 0.5, repeat: animationPhase === "delivering" && receives("carol") ? Infinity : 0 }}
            >
              <div className="relative">
                <Home className="w-6 h-6 text-violet-400" />
                {animationPhase === "complete" && receives("carol") && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-gray-800"
                  />
                )}
              </div>
              <span className="absolute -bottom-7 text-white text-xs font-medium whitespace-nowrap bg-gray-900/90 px-2 py-0.5 rounded">
                Carol
              </span>
            </motion.div>

            {/* Post Office 1 */}
            <motion.div
              className={cn(
                "absolute flex flex-col items-center justify-center",
                "w-20 h-20 rounded-xl border-2 bg-emerald-500/10 border-emerald-500/50",
                animationPhase === "processing" &&
                  connections.alice.includes("relay1") &&
                  "shadow-lg shadow-emerald-500/20"
              )}
              style={{ left: "50%", top: "25%", transform: "translate(-50%, -50%)" }}
              animate={
                animationPhase === "processing" && connections.alice.includes("relay1")
                  ? { scale: [1, 1.03, 1] }
                  : {}
              }
              transition={{ duration: 0.6, repeat: animationPhase === "processing" && connections.alice.includes("relay1") ? Infinity : 0 }}
            >
              <div className="relative">
                <Building2 className="w-7 h-7 text-emerald-400" />
                {(animationPhase === "delivering" || animationPhase === "complete") &&
                  connections.alice.includes("relay1") && (
                    <motion.div
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute -top-2 left-1/2 -translate-x-1/2"
                    >
                      <Mail className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  )}
              </div>
              <span className="text-xs text-emerald-300 mt-1 font-medium">Office 1</span>
            </motion.div>

            {/* Post Office 2 */}
            <motion.div
              className={cn(
                "absolute flex flex-col items-center justify-center",
                "w-20 h-20 rounded-xl border-2 bg-emerald-500/10 border-emerald-500/50",
                animationPhase === "processing" &&
                  connections.alice.includes("relay2") &&
                  "shadow-lg shadow-emerald-500/20"
              )}
              style={{ left: "50%", top: "75%", transform: "translate(-50%, -50%)" }}
              animate={
                animationPhase === "processing" && connections.alice.includes("relay2")
                  ? { scale: [1, 1.03, 1] }
                  : {}
              }
              transition={{ duration: 0.6, repeat: animationPhase === "processing" && connections.alice.includes("relay2") ? Infinity : 0 }}
            >
              <div className="relative">
                <Building2 className="w-7 h-7 text-emerald-400" />
                {(animationPhase === "delivering" || animationPhase === "complete") &&
                  connections.alice.includes("relay2") && (
                    <motion.div
                      initial={{ y: -5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute -top-2 left-1/2 -translate-x-1/2"
                    >
                      <Mail className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  )}
              </div>
              <span className="text-xs text-emerald-300 mt-1 font-medium">Office 2</span>
            </motion.div>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Alice Connections */}
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-rose-400" />
              </div>
              <span className="font-semibold text-white capitalize">Alice</span>
              <span className="text-xs text-gray-500 ml-auto">
                {connections.alice.length} connection
                {connections.alice.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {(["relay1", "relay2"] as Relay[]).map((relay) => {
                const isConnected = connections.alice.includes(relay);
                return (
                  <button
                    key={relay}
                    onClick={() => toggleConnection("alice", relay)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                      isConnected
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center transition-all",
                        isConnected
                          ? "bg-emerald-500"
                          : "bg-gray-700 border border-gray-600"
                      )}
                    >
                      {isConnected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <Building2
                      className={cn(
                        "w-4 h-4",
                        isConnected ? "text-emerald-400" : "text-gray-500"
                      )}
                    />
                    <span className="flex-1 text-left">
                      {relay === "relay1" ? "Post Office 1" : "Post Office 2"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bob Connections */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-semibold text-white capitalize">Bob</span>
              <span className="text-xs text-gray-500 ml-auto">
                {connections.bob.length} connection
                {connections.bob.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {(["relay1", "relay2"] as Relay[]).map((relay) => {
                const isConnected = connections.bob.includes(relay);
                return (
                  <button
                    key={relay}
                    onClick={() => toggleConnection("bob", relay)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                      isConnected
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center transition-all",
                        isConnected
                          ? "bg-emerald-500"
                          : "bg-gray-700 border border-gray-600"
                      )}
                    >
                      {isConnected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <Building2
                      className={cn(
                        "w-4 h-4",
                        isConnected ? "text-emerald-400" : "text-gray-500"
                      )}
                    />
                    <span className="flex-1 text-left">
                      {relay === "relay1" ? "Post Office 1" : "Post Office 2"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Carol Connections */}
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-400" />
              </div>
              <span className="font-semibold text-white capitalize">Carol</span>
              <span className="text-xs text-gray-500 ml-auto">
                {connections.carol.length} connection
                {connections.carol.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-2">
              {(["relay1", "relay2"] as Relay[]).map((relay) => {
                const isConnected = connections.carol.includes(relay);
                return (
                  <button
                    key={relay}
                    onClick={() => toggleConnection("carol", relay)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                      isConnected
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center transition-all",
                        isConnected
                          ? "bg-emerald-500"
                          : "bg-gray-700 border border-gray-600"
                      )}
                    >
                      {isConnected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <Building2
                      className={cn(
                        "w-4 h-4",
                        isConnected ? "text-emerald-400" : "text-gray-500"
                      )}
                    />
                    <span className="flex-1 text-left">
                      {relay === "relay1" ? "Post Office 1" : "Post Office 2"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Send Letter */}
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/10 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Send className="w-4 h-4 text-purple-400" />
              </div>
              <span className="font-semibold text-white">Send Letter</span>
            </div>

            <button
              onClick={sendPost}
              disabled={isAnimating || connections.alice.length === 0}
              className={cn(
                "w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200",
                "flex items-center justify-center gap-2",
                isAnimating || connections.alice.length === 0
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
              )}
            >
              <Mail
                className={cn("w-5 h-5", isAnimating && "animate-bounce")}
              />
              <span>
                {isAnimating
                  ? animationPhase === "sending"
                    ? "Sending..."
                    : animationPhase === "processing"
                      ? "Processing..."
                      : animationPhase === "delivering"
                        ? "Delivering..."
                        : "Complete!"
                  : "Send from Alice"}
              </span>
            </button>

            {connections.alice.length === 0 && !isAnimating && (
              <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Connect Alice to a post office first</span>
              </div>
            )}

            {connections.alice.length > 0 && !isAnimating && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ready to send</span>
              </div>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-sm text-gray-300 space-y-2">
              <p>
                <strong className="text-white">How delivery works:</strong> A
                letter only reaches someone if they use at least one of the
                same post offices as the sender.
              </p>
              <p>
                <strong className="text-white">Key insight:</strong> Post
                offices don&apos;t talk to each other. If Alice uses Post Office
                1 and Carol only uses Post Office 2, Carol will never receive
                Alice&apos;s letters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
