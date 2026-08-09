import React, { useState, useEffect } from "react";
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
import { useTranslation } from "../../hooks/useTranslation";

type Person = "alice" | "bob" | "carol";
type Relay = "relay1" | "relay2";

export function NostrSimulator({ className }: { className?: string }) {
  const { t } = useTranslation();
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
    setCurrentMessage(t("nostrSimulator.messages.sending"));

    setTimeout(() => {
      const relayNames = connections.alice
        .map((r) => (r === "relay1" ? t("nostrSimulator.nodes.relay") + " 1" : t("nostrSimulator.nodes.relay") + " 2"))
        .join(" & ");
      setCurrentMessage(t("nostrSimulator.messages.broadcasting").replace("{{relays}}", relayNames));
      setAnimationPhase("processing");
    }, 1000);

    setTimeout(() => {
      setCurrentMessage(t("nostrSimulator.messages.syncing"));
    }, 1800);

    setTimeout(() => {
      const recipients = ["bob", "carol"].filter((p) => receives(p as Person));
      if (recipients.length > 0) {
        const names = recipients
          .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
          .join(" & ");
        setCurrentMessage(t("nostrSimulator.messages.delivering").replace("{{recipients}}", names));
      } else {
        setCurrentMessage(t("nostrSimulator.messages.noDelivery"));
      }
      setAnimationPhase("delivering");
    }, 2600);

    setTimeout(() => {
      const bobReceives = receives("bob");
      const carolReceives = receives("carol");

      if (bobReceives && carolReceives) {
        setCurrentMessage(t("nostrSimulator.messages.received").replace("{{recipients}}", "Bob & Carol"));
      } else if (bobReceives) {
        setCurrentMessage(t("nostrSimulator.messages.receivedOne").replace("{{recipient}}", "Bob").replace("{{other}}", "Carol"));
      } else if (carolReceives) {
        setCurrentMessage(t("nostrSimulator.messages.receivedOne").replace("{{recipient}}", "Carol").replace("{{other}}", "Bob"));
      } else {
        setCurrentMessage(t("nostrSimulator.messages.noOneShares"));
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

  // Drives the envelope transit: letters mount at their origin, then
  // `phaseEntered` flips on the next frame and CSS transitions them to the
  // destination (double-rAF mount idiom). "complete" keeps the
  // delivering positions so the letters stay parked at the recipients.
  const [phaseEntered, setPhaseEntered] = useState(false);
  useEffect(() => {
    if (animationPhase === "complete") return;
    setPhaseEntered(false);
    if (animationPhase !== "sending" && animationPhase !== "delivering") return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPhaseEntered(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [animationPhase]);

  return (
    <div className={cn("w-full my-8", className)}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/20 rounded-2xl mb-4">
            <Mailbox className="w-7 h-7 text-purple-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t("nostrSimulator.title")}
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            {t("nostrSimulator.description")}
          </p>
        </div>

        {/* Animation Status */}
        {currentMessage && (
          <div className="mb-6 text-center animate-slide-down motion-reduce:animate-none">
            <span className="inline-block bg-purple-500/20 text-purple-300 px-5 py-2.5 rounded-full text-sm font-medium border border-purple-500/30">
              {currentMessage}
            </span>
          </div>
        )}

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
                <line
                  key={`alice-${relay}`}
                  x1="80"
                  y1="175"
                  x2="300"
                  y2={relay === "relay1" ? "87" : "262"}
                  stroke={isAnimating ? "#8b5cf6" : "#4b5563"}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                  className="animate-fade-in motion-reduce:animate-none"
                />
              ))}
              {connections.bob.map((relay) => (
                <line
                  key={`bob-${relay}`}
                  x1="520"
                  y1="87"
                  x2="300"
                  y2={relay === "relay1" ? "87" : "262"}
                  stroke={isAnimating ? "#8b5cf6" : "#4b5563"}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                  className="animate-fade-in motion-reduce:animate-none"
                />
              ))}
              {connections.carol.map((relay) => (
                <line
                  key={`carol-${relay}`}
                  x1="520"
                  y1="262"
                  x2="300"
                  y2={relay === "relay1" ? "87" : "262"}
                  stroke={isAnimating ? "#8b5cf6" : "#4b5563"}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                  className="animate-fade-in motion-reduce:animate-none"
                />
              ))}

              {/* Animation: Alice to Post Offices */}
              {animationPhase === "sending" &&
                connections.alice.map((relay) => (
                  <g
                    key={`to-${relay}`}
                    className="transition-transform duration-[800ms] ease-in-out motion-reduce:transition-none"
                    style={{
                      transform: phaseEntered
                        ? `translate(300px, ${relay === "relay1" ? 87 : 262}px)`
                        : "translate(80px, 175px)",
                    }}
                  >
                    <circle r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                    <text
                      fontSize="14"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      ✉️
                    </text>
                  </g>
                ))}

              {/* Animation: Processing Dots */}
              {animationPhase === "processing" &&
                connections.alice.map((relay) => {
                  const y = relay === "relay1" ? 87 : 262;
                  return (
                    <g key={`process-${relay}`}>
                      {[0, 1, 2].map((i) => (
                        <circle
                          key={i}
                          cx={300 + (i - 1) * 15}
                          cy={y + 45}
                          r="5"
                          fill="#34d399"
                          className="animate-pulse motion-reduce:animate-none"
                          style={{ animationDelay: `${i * 200}ms` }}
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
                        <g
                          key={`from-${relay}-to-${person}`}
                          className="transition-transform duration-[800ms] ease-in-out motion-reduce:transition-none"
                          style={{
                            transform: phaseEntered
                              ? `translate(520px, ${toY}px)`
                              : `translate(300px, ${fromY}px)`,
                          }}
                        >
                          <circle r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                          <text
                            fontSize="14"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            ✉️
                          </text>
                        </g>
                      );
                    })
                )}
            </svg>

            {/* Nodes */}
            {/* Alice */}
            <div
              className="absolute"
              style={{ left: "13%", top: "50%", transform: "translate(-50%, -50%)" }}
            >
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                "w-16 h-16 rounded-xl border-2 bg-rose-500/20 border-rose-500",
                animationPhase === "sending" &&
                  "shadow-lg shadow-rose-500/30 animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Home className="w-6 h-6 text-rose-400" />
                {animationPhase === "sending" && (
                  <div className="absolute -top-1 -end-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-gray-800 animate-scale-pop motion-reduce:animate-none" />
                )}
              </div>
              <span className="absolute -bottom-7 text-white text-xs font-medium whitespace-nowrap bg-gray-900/90 px-2 py-0.5 rounded">
                {t("nostrSimulator.nodes.alice")}
              </span>
            </div>
            </div>

            {/* Bob */}
            <div
              className="absolute"
              style={{ left: "87%", top: "25%", transform: "translate(-50%, -50%)" }}
            >
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                "w-16 h-16 rounded-xl border-2 bg-blue-500/20 border-blue-500",
                animationPhase === "delivering" &&
                  receives("bob") &&
                  "shadow-lg shadow-blue-500/30 animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Home className="w-6 h-6 text-blue-400" />
                {animationPhase === "complete" && receives("bob") && (
                  <div className="absolute -top-1 -end-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-gray-800 animate-scale-pop motion-reduce:animate-none" />
                )}
              </div>
              <span className="absolute -bottom-7 text-white text-xs font-medium whitespace-nowrap bg-gray-900/90 px-2 py-0.5 rounded">
                {t("nostrSimulator.nodes.bob")}
              </span>
            </div>
            </div>

            {/* Carol */}
            <div
              className="absolute"
              style={{ left: "87%", top: "75%", transform: "translate(-50%, -50%)" }}
            >
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                "w-16 h-16 rounded-xl border-2 bg-violet-500/20 border-violet-500",
                animationPhase === "delivering" &&
                  receives("carol") &&
                  "shadow-lg shadow-violet-500/30 animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Home className="w-6 h-6 text-violet-400" />
                {animationPhase === "complete" && receives("carol") && (
                  <div className="absolute -top-1 -end-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-gray-800 animate-scale-pop motion-reduce:animate-none" />
                )}
              </div>
              <span className="absolute -bottom-7 text-white text-xs font-medium whitespace-nowrap bg-gray-900/90 px-2 py-0.5 rounded">
                {t("nostrSimulator.nodes.carol")}
              </span>
            </div>
            </div>

            {/* Post Office 1 */}
            <div
              className="absolute"
              style={{ left: "50%", top: "25%", transform: "translate(-50%, -50%)" }}
            >
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                "w-20 h-20 rounded-xl border-2 bg-emerald-500/10 border-emerald-500/50",
                animationPhase === "processing" &&
                  connections.alice.includes("relay1") &&
                  "shadow-lg shadow-emerald-500/20 animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Building2 className="w-7 h-7 text-emerald-400" />
                {(animationPhase === "delivering" || animationPhase === "complete") &&
                  connections.alice.includes("relay1") && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <div className="animate-slide-down motion-reduce:animate-none">
                        <Mail className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                  )}
              </div>
              <span className="text-xs text-emerald-300 mt-1 font-medium">{t("nostrSimulator.nodes.office")} 1</span>
            </div>
            </div>

            {/* Post Office 2 */}
            <div
              className="absolute"
              style={{ left: "50%", top: "75%", transform: "translate(-50%, -50%)" }}
            >
            <div
              className={cn(
                "flex flex-col items-center justify-center",
                "w-20 h-20 rounded-xl border-2 bg-emerald-500/10 border-emerald-500/50",
                animationPhase === "processing" &&
                  connections.alice.includes("relay2") &&
                  "shadow-lg shadow-emerald-500/20 animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Building2 className="w-7 h-7 text-emerald-400" />
                {(animationPhase === "delivering" || animationPhase === "complete") &&
                  connections.alice.includes("relay2") && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <div className="animate-slide-down motion-reduce:animate-none">
                        <Mail className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                  )}
              </div>
              <span className="text-xs text-emerald-300 mt-1 font-medium">{t("nostrSimulator.nodes.office")} 2</span>
            </div>
            </div>
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
              <span className="font-semibold text-white capitalize">{t("nostrSimulator.nodes.alice")}</span>
              <span className="text-xs text-gray-500 ms-auto">
                {connections.alice.length} {connections.alice.length !== 1 ? t("nostrSimulator.connections") : t("nostrSimulator.connection")}
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
                    <span className="flex-1 text-start">
                      {relay === "relay1" ? `${t("nostrSimulator.nodes.office")} 1` : `${t("nostrSimulator.nodes.office")} 2`}
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
              <span className="font-semibold text-white capitalize">{t("nostrSimulator.nodes.bob")}</span>
              <span className="text-xs text-gray-500 ms-auto">
                {connections.bob.length} {connections.bob.length !== 1 ? t("nostrSimulator.connections") : t("nostrSimulator.connection")}
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
                    <span className="flex-1 text-start">
                      {relay === "relay1" ? `${t("nostrSimulator.nodes.office")} 1` : `${t("nostrSimulator.nodes.office")} 2`}
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
              <span className="font-semibold text-white capitalize">{t("nostrSimulator.nodes.carol")}</span>
              <span className="text-xs text-gray-500 ms-auto">
                {connections.carol.length} {connections.carol.length !== 1 ? t("nostrSimulator.connections") : t("nostrSimulator.connection")}
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
                    <span className="flex-1 text-start">
                      {relay === "relay1" ? `${t("nostrSimulator.nodes.office")} 1` : `${t("nostrSimulator.nodes.office")} 2`}
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
              <span className="font-semibold text-white">{t("nostrSimulator.buttons.send")}</span>
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
                    ? t("nostrSimulator.controls.sending")
                    : animationPhase === "processing"
                      ? t("nostrSimulator.controls.processing")
                      : animationPhase === "delivering"
                        ? t("nostrSimulator.controls.delivering")
                        : t("nostrSimulator.controls.complete")
                  : t("nostrSimulator.buttons.sendFromAlice")}
              </span>
            </button>

            {connections.alice.length === 0 && !isAnimating && (
              <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{t("nostrSimulator.messages.connectFirst")}</span>
              </div>
            )}

            {connections.alice.length > 0 && !isAnimating && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t("nostrSimulator.messages.ready")}</span>
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
                {t("nostrSimulator.explanation.deliveryTitle")}
                {t("nostrSimulator.explanation.deliveryDesc")}
              </p>
              <p>
                {t("nostrSimulator.explanation.insightTitle")}
                {t("nostrSimulator.explanation.insightDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
