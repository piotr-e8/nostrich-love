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
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Mailbox className="mx-auto mb-3 h-6 w-6 text-primary-text dark:text-primary-400" strokeWidth={1.5} aria-hidden="true" />
          <h2 className="text-h2 font-display text-gray-900 dark:text-white mb-3">
            {t("nostrSimulator.title")}
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            {t("nostrSimulator.description")}
          </p>
        </div>

        {/* Animation Status */}
        {currentMessage && (
          <div className="mb-6 text-center animate-slide-down motion-reduce:animate-none">
            <span className="inline-block px-5 py-2.5 rounded-full text-body-sm font-medium border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
              {currentMessage}
            </span>
          </div>
        )}

        {/* Visualization */}
        <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-800">
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

                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                  className={cn("animate-fade-in motion-reduce:animate-none", isAnimating ? "stroke-primary-500" : "stroke-gray-300 dark:stroke-gray-700")}
                />
              ))}
              {connections.bob.map((relay) => (
                <line
                  key={`bob-${relay}`}
                  x1="520"
                  y1="87"
                  x2="300"
                  y2={relay === "relay1" ? "87" : "262"}

                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                  className={cn("animate-fade-in motion-reduce:animate-none", isAnimating ? "stroke-primary-500" : "stroke-gray-300 dark:stroke-gray-700")}
                />
              ))}
              {connections.carol.map((relay) => (
                <line
                  key={`carol-${relay}`}
                  x1="520"
                  y1="262"
                  x2="300"
                  y2={relay === "relay1" ? "87" : "262"}

                  strokeWidth="2"
                  strokeDasharray="6 4"
                  opacity="0.6"
                  className={cn("animate-fade-in motion-reduce:animate-none", isAnimating ? "stroke-primary-500" : "stroke-gray-300 dark:stroke-gray-700")}
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
                    <circle r="12" className="fill-amber-400 stroke-amber-500" strokeWidth="2" />
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
                          className="fill-emerald-500 animate-pulse motion-reduce:animate-none"
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
                          <circle r="12" className="fill-amber-400 stroke-amber-500" strokeWidth="2" />
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
                "w-16 h-16 rounded-lg border bg-rose-50 border-rose-300 dark:bg-gray-800 dark:border-rose-700",
                animationPhase === "sending" &&
                  "animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Home className="h-5 w-5 text-rose-700 dark:text-rose-400" strokeWidth={1.5} aria-hidden="true" />
                {animationPhase === "sending" && (
                  <div className="absolute -top-1 -end-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-gray-900 animate-scale-pop motion-reduce:animate-none" />
                )}
              </div>
              <span className="absolute -bottom-7 text-caption font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
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
                "w-16 h-16 rounded-lg border bg-blue-50 border-blue-300 dark:bg-gray-800 dark:border-blue-700",
                animationPhase === "delivering" &&
                  receives("bob") &&
                  "animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Home className="h-5 w-5 text-blue-700 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
                {animationPhase === "complete" && receives("bob") && (
                  <div className="absolute -top-1 -end-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-gray-900 animate-scale-pop motion-reduce:animate-none" />
                )}
              </div>
              <span className="absolute -bottom-7 text-caption font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
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
                "w-16 h-16 rounded-lg border bg-violet-50 border-violet-300 dark:bg-gray-800 dark:border-violet-700",
                animationPhase === "delivering" &&
                  receives("carol") &&
                  "animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Home className="h-5 w-5 text-violet-700 dark:text-violet-400" strokeWidth={1.5} aria-hidden="true" />
                {animationPhase === "complete" && receives("carol") && (
                  <div className="absolute -top-1 -end-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-gray-900 animate-scale-pop motion-reduce:animate-none" />
                )}
              </div>
              <span className="absolute -bottom-7 text-caption font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
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
                "w-20 h-20 rounded-lg border bg-emerald-50 border-emerald-300 dark:bg-gray-800 dark:border-emerald-700",
                animationPhase === "processing" &&
                  connections.alice.includes("relay1") &&
                  "animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Building2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" strokeWidth={1.5} aria-hidden="true" />
                {(animationPhase === "delivering" || animationPhase === "complete") &&
                  connections.alice.includes("relay1") && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <div className="animate-slide-down motion-reduce:animate-none">
                        <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                    </div>
                  )}
              </div>
              <span className="text-caption text-emerald-700 dark:text-emerald-400 mt-1 font-medium">{t("nostrSimulator.nodes.office")} 1</span>
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
                "w-20 h-20 rounded-lg border bg-emerald-50 border-emerald-300 dark:bg-gray-800 dark:border-emerald-700",
                animationPhase === "processing" &&
                  connections.alice.includes("relay2") &&
                  "animate-pulse-scale motion-reduce:animate-none"
              )}
            >
              <div className="relative">
                <Building2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400" strokeWidth={1.5} aria-hidden="true" />
                {(animationPhase === "delivering" || animationPhase === "complete") &&
                  connections.alice.includes("relay2") && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      <div className="animate-slide-down motion-reduce:animate-none">
                        <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                    </div>
                  )}
              </div>
              <span className="text-caption text-emerald-700 dark:text-emerald-400 mt-1 font-medium">{t("nostrSimulator.nodes.office")} 2</span>
            </div>
            </div>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Alice Connections */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center">
                <User className="h-5 w-5 text-rose-700 dark:text-rose-400" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <span className="text-body font-semibold text-gray-900 dark:text-white capitalize">{t("nostrSimulator.nodes.alice")}</span>
              <span className="text-caption text-gray-500 dark:text-gray-400 ms-auto">
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
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-body-sm transition-colors",
                      isConnected
                        ? "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-gray-800 dark:text-emerald-400"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-sm flex items-center justify-center transition-colors",
                        isConnected
                          ? "bg-emerald-600"
                          : "border border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {isConnected && <Check className="h-3 w-3 text-white" strokeWidth={1.5} aria-hidden="true" />}
                    </div>
                    <Building2
                      className={cn(
                        "h-4 w-4",
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
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center">
                <User className="h-5 w-5 text-blue-700 dark:text-blue-400" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <span className="text-body font-semibold text-gray-900 dark:text-white capitalize">{t("nostrSimulator.nodes.bob")}</span>
              <span className="text-caption text-gray-500 dark:text-gray-400 ms-auto">
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
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-body-sm transition-colors",
                      isConnected
                        ? "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-gray-800 dark:text-emerald-400"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-sm flex items-center justify-center transition-colors",
                        isConnected
                          ? "bg-emerald-600"
                          : "border border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {isConnected && <Check className="h-3 w-3 text-white" strokeWidth={1.5} aria-hidden="true" />}
                    </div>
                    <Building2
                      className={cn(
                        "h-4 w-4",
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
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center">
                <User className="h-5 w-5 text-violet-700 dark:text-violet-400" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <span className="text-body font-semibold text-gray-900 dark:text-white capitalize">{t("nostrSimulator.nodes.carol")}</span>
              <span className="text-caption text-gray-500 dark:text-gray-400 ms-auto">
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
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-body-sm transition-colors",
                      isConnected
                        ? "border border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-gray-800 dark:text-emerald-400"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-sm flex items-center justify-center transition-colors",
                        isConnected
                          ? "bg-emerald-600"
                          : "border border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {isConnected && <Check className="h-3 w-3 text-white" strokeWidth={1.5} aria-hidden="true" />}
                    </div>
                    <Building2
                      className={cn(
                        "h-4 w-4",
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
          <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center">
                <Send className="h-4 w-4 text-primary-text dark:text-primary-400" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <span className="text-body font-semibold text-gray-900 dark:text-white">{t("nostrSimulator.buttons.send")}</span>
            </div>

            <button
              onClick={sendPost}
              disabled={isAnimating || connections.alice.length === 0}
              className={cn(
                "w-full py-3 px-4 rounded-md font-semibold text-white transition-colors duration-200",
                "flex items-center justify-center gap-2",
                isAnimating || connections.alice.length === 0
                  ? "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
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
              <div className="mt-3 flex items-start gap-2 text-caption text-warning-700 dark:text-warning-400 rounded-md p-2 border border-warning-300 dark:border-warning-800">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
                <span>{t("nostrSimulator.messages.connectFirst")}</span>
              </div>
            )}

            {connections.alice.length > 0 && !isAnimating && (
              <div className="mt-3 flex items-center gap-2 text-caption text-emerald-700 dark:text-emerald-400">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t("nostrSimulator.messages.ready")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center shrink-0">
              <Info className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="text-body-sm text-gray-700 dark:text-gray-300 space-y-2">
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
