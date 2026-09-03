import React, { useState, useEffect } from "react";
import {
  Key,
  Copy,
  Check,
  Smartphone,
  Globe,
  Monitor,
  ArrowRight,
  MessageCircle,
  UserPlus,
  Zap,
  Heart,
  Server,
  Send,
  RefreshCw,
  AlertTriangle,
  PartyPopper,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { DamusInteractiveSimulator } from "./damus";
import { useTranslation } from "../../hooks/useTranslation";

type Mode = "keygen" | "client-picker" | "first-day";
type Client = "damus" | "amethyst" | "iris" | "primal" | "coracle";
type Step = "relays" | "post" | "follow" | "interact" | "zap";

interface QuickstartSimulatorProps {
  mode: Mode;
  className?: string;
}

export function QuickstartSimulator({ mode, className }: QuickstartSimulatorProps) {
  switch (mode) {
    case "keygen":
      return <KeyGenSimulator className={className} />;
    case "client-picker":
      return <ClientPickerSimulator className={className} />;
    case "first-day":
      return <FirstDaySimulator className={className} />;
    default:
      return null;
  }
}

// ============================================
// MODE 1: KEY GENERATION
// ============================================

function KeyGenSimulator({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<{ npub: string; nsec: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showPrivate, setShowPrivate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKeys = () => {
    setIsGenerating(true);
    // Simulate key generation delay
    setTimeout(() => {
      const mockNpub = "npub1" + Array(58).fill(0).map(() => 
        "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
      ).join("");
      const mockNsec = "nsec1" + Array(58).fill(0).map(() => 
        "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
      ).join("");
      
      setKeys({ npub: mockNpub, nsec: mockNsec });
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      {!keys ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center">
          <Key className="mx-auto mb-3 h-6 w-6 text-primary-text dark:text-primary-400" strokeWidth={1.5} aria-hidden="true" />
          <h3 className="text-xl font-bold mb-2">{t("quickstartSimulator.steps.createKeys")}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("quickstartSimulator.keyGen.description")}
          </p>
          <button
            onClick={generateKeys}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                {t("quickstartSimulator.buttons.generating")}
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                {t("quickstartSimulator.buttons.generateKeys")}
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Public Key */}
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <div>
                <h4 className="font-bold text-green-700 dark:text-green-400">{t("quickstartSimulator.keyGen.publicKeyTitle")}</h4>
                <p className="text-xs text-green-600 dark:text-green-500">{t("quickstartSimulator.keyGen.publicKeyDesc")}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
              <code className="text-xs break-all text-gray-800 dark:text-gray-200">
                {keys.npub}
              </code>
            </div>
            <button
              onClick={() => copyToClipboard(keys.npub, "npub")}
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400"
            >
              {copied === "npub" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied === "npub" ? t("quickstartSimulator.buttons.copied") : t("quickstartSimulator.buttons.copyPublic")}
            </button>
          </div>

          {/* Private Key */}
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-bold text-red-700 dark:text-red-400">{t("quickstartSimulator.keyGen.privateKeyTitle")}</h4>
                  <p className="text-xs text-red-600 dark:text-red-500">{t("quickstartSimulator.keyGen.privateKeyDesc")}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrivate(!showPrivate)}
                className="text-xs text-red-600 hover:text-red-700 underline"
              >
                {showPrivate ? t("quickstartSimulator.buttons.hide") : t("quickstartSimulator.buttons.show")}
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
              <code className="text-xs break-all text-gray-800 dark:text-gray-200">
                {showPrivate ? keys.nsec : "•".repeat(keys.nsec.length)}
              </code>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => copyToClipboard(keys.nsec, "nsec")}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                {copied === "nsec" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === "nsec" ? t("quickstartSimulator.buttons.copied") : t("quickstartSimulator.buttons.copyPrivate")}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-400">
              {t("quickstartSimulator.keyGen.important")}
            </div>
          </div>

          <button
            onClick={generateKeys}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {t("quickstartSimulator.buttons.generateNewKeys")}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// MODE 2: CLIENT PICKER
// ============================================

const CLIENTS: { id: Client; name: string; icon: React.ReactNode; platform: string; description: string }[] = [
  { id: "damus", name: "Damus", icon: <Smartphone className="w-6 h-6" />, platform: "iOS", description: "Clean, simple, great for beginners" },
  { id: "amethyst", name: "Amethyst", icon: <Smartphone className="w-6 h-6" />, platform: "Android", description: "Feature-rich, highly customizable" },
  { id: "iris", name: "Iris", icon: <Globe className="w-6 h-6" />, platform: "Web", description: "Works everywhere, no install needed" },
  { id: "primal", name: "Primal", icon: <Smartphone className="w-6 h-6" />, platform: "All platforms", description: "Beautiful interface, easy discovery" },
  { id: "coracle", name: "Coracle", icon: <Monitor className="w-6 h-6" />, platform: "Web", description: "Simple, fast, great for desktop" },
];

function ClientPickerSimulator({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {!selectedClient ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLIENTS.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client.id)}
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 text-start hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600">
                  {client.icon}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {client.platform}
                </span>
              </div>
              <h4 className="font-bold text-lg mb-1 group-hover:text-purple-600 transition-colors">
                {client.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {client.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {t("quickstartSimulator.buttons.tryIt")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <ClientSimulation 
          client={selectedClient} 
          onBack={() => setSelectedClient(null)} 
        />
      )}
    </div>
  );
}

function ClientSimulation({ client, onBack }: { client: Client; onBack: () => void }) {
  const { t } = useTranslation();
  const clientData = CLIENTS.find(c => c.id === client)!;
  
  const simulations: Record<Client, React.ReactNode> = {
    damus: <DamusSimulation />,
    amethyst: <AmethystSimulation />,
    iris: <IrisSimulation />,
    primal: <PrimalSimulation />,
    coracle: <CoracleSimulation />,
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
          >
            <span aria-hidden="true" className="inline-block rtl:rotate-180">←</span>{" "}
            {t("quickstartSimulator.buttons.back")}
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className="font-semibold">{clientData.name} {t("quickstartSimulator.simulator")}</span>
        </div>
        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
          {t("quickstartSimulator.simulationMode")}
        </span>
      </div>
      
      <div className="p-4">
        {simulations[client]}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-t border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-400 text-center">
          {t("quickstartSimulator.simulationNote")}
        </p>
      </div>
    </div>
  );
}

// Simple simulation components for each client
function DamusSimulation() {
  return <DamusInteractiveSimulator />;
}

function AmethystSimulation() {
  return (
    <div className="max-w-sm mx-auto bg-gray-900 rounded-lg overflow-hidden border-8 border-gray-800">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Amethyst</h3>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-700 rounded-full" />
            <div className="w-8 h-8 bg-purple-500 rounded-full" />
          </div>
        </div>
        
        {/* Tab bar */}
        <div className="flex gap-4 mb-4 text-sm text-gray-400 border-b border-gray-700 pb-2">
          <span className="text-purple-400 border-b-2 border-purple-400 pb-2">Following</span>
          <span>Global</span>
          <span>Messages</span>
          <span>Zaps</span>
        </div>
        
        {/* Posts with more detail */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div>
                <div className="text-sm font-semibold text-white">Carol</div>
                <div className="text-xs text-gray-500">carol@nostrplebs.com</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">The customization options in Amethyst are incredible!</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex gap-3">
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> 12</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 234</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> 45</span>
              </div>
              <span className="text-purple-400">Reply</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IrisSimulation() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[400px]">
      <div className="border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Iris</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">Following</button>
            <button className="px-3 py-1 text-gray-600 dark:text-gray-400 text-sm">Global</button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
          <input
            type="text"
            aria-label="Write a post"
            placeholder="What's happening?"
            className="w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-300"
          />
          <div className="flex justify-end mt-2">
            <button className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm">Post</button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Dave</span>
                <span className="text-gray-500 text-sm">dave@iris.to</span>
                <span className="text-gray-400 text-sm">· 1h</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-1">Iris works on any device with no download required. Perfect for getting started!</p>
              <div className="flex gap-6 mt-2 text-gray-500">
                <MessageCircle className="w-4 h-4" />
                <RefreshCw className="w-4 h-4" />
                <Heart className="w-4 h-4" />
                <Send className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrimalSimulation() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg min-h-[400px]">
      <div className="bg-primary-600 text-white p-4">
        <h3 className="font-bold text-lg">Primal</h3>
        <p className="text-sm opacity-80">Beautiful and intuitive</p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 mb-6">
          {["Home", "Explore", "Messages", "Notifications"].map((tab) => (
            <button key={tab} className="text-xs py-2 text-center text-gray-600 dark:text-gray-400 hover:text-purple-600">
              {tab}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">Emma</span>
                  <span className="text-xs text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">✓</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">The UI in Primal is so clean! Love the discovery features</p>
                <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                  <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /> 23</span>
                  <span className="flex items-center gap-1"><Zap className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /> 1.2k</span>
                  <span className="flex items-center gap-1"><Heart className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /> 89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoracleSimulation() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg min-h-[400px] p-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Coracle</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Simple and fast</p>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-full" />
              <span className="font-semibold text-sm">Frank</span>
              <span className="text-xs text-gray-400">· 30m</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Coracle is perfect for desktop. Minimal, fast, no clutter.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-teal-500 rounded-full" />
              <span className="font-semibold text-sm">Grace</span>
              <span className="text-xs text-gray-400">· 2h</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Love the simplicity. Just what I need.</p>
          </div>
        </div>
        
        <div className="mt-6 flex gap-2">
          <input
            type="text"
            aria-label="Write a post"
            placeholder="Say something..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODE 3: FIRST DAY SIMULATOR
// ============================================

function FirstDaySimulator({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>("relays");
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());
  const [connectedRelays, setConnectedRelays] = useState<string[]>(["relay.damus.io"]);
  const [hasPosted, setHasPosted] = useState(false);
  const [followedCount, setFollowedCount] = useState(0);
  const [hasZapped, setHasZapped] = useState(false);

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "relays", label: t("quickstartSimulator.steps.connectRelay"), icon: <Server className="w-4 h-4" /> },
    { id: "post", label: t("quickstartSimulator.steps.makePost"), icon: <Send className="w-4 h-4" /> },
    { id: "follow", label: t("quickstartSimulator.steps.followPeople"), icon: <UserPlus className="w-4 h-4" /> },
    { id: "interact", label: t("quickstartSimulator.steps.interact"), icon: <Heart className="w-4 h-4" /> },
    { id: "zap", label: t("quickstartSimulator.steps.receiveZap"), icon: <Zap className="w-4 h-4" /> },
  ];

  const completeStep = (step: Step) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    const nextIndex = steps.findIndex(s => s.id === step) + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                completedSteps.has(step.id)
                  ? "bg-green-500 text-white"
                  : currentStep === step.id
                  ? "bg-purple-600 text-white ring-4 ring-purple-200"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              )}
            >
              {completedSteps.has(step.id) ? <Check className="w-5 h-5" /> : step.icon}
            </button>
            {idx < steps.length - 1 && (
              <div className={cn(
                "w-12 h-0.5 mx-1",
                completedSteps.has(step.id) ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          {currentStep === "relays" && (
            <div
              key="relays"
              className="animate-slide-up motion-reduce:animate-none"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Server className="w-6 h-6 text-purple-600" />
                {t("quickstartSimulator.steps.connectRelay")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("quickstartSimulator.relayStep.description")}
              </p>

              <div className="space-y-3">
                {["relay.damus.io", "nos.lol", "relay.snort.social"].map((relay) => (
                  <div
                    key={relay}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
                      connectedRelays.includes(relay)
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300"
                    )}
                    onClick={() => {
                      if (connectedRelays.includes(relay)) {
                        setConnectedRelays(prev => prev.filter(r => r !== relay));
                      } else {
                        setConnectedRelays(prev => [...prev, relay]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        connectedRelays.includes(relay) ? "bg-green-500" : "bg-gray-300"
                      )} />
                      <code className="text-sm">wss://{relay}</code>
                    </div>
                    {connectedRelays.includes(relay) && (
                      <span className="text-sm text-green-600 font-semibold">{t("quickstartSimulator.relayStep.connected")}</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => completeStep("relays")}
                disabled={connectedRelays.length === 0}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold"
              >
                {connectedRelays.length > 0 ? t("quickstartSimulator.buttons.continue") : t("quickstartSimulator.relayStep.connectOne")}
              </button>
            </div>
          )}

          {currentStep === "post" && (
            <div
              key="post"
              className="animate-slide-up motion-reduce:animate-none"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Send className="w-6 h-6 text-purple-600" />
                {t("quickstartSimulator.postStep.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("quickstartSimulator.postStep.description")}
              </p>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <textarea
                      aria-label={t("quickstartSimulator.postStep.title")}
                      placeholder={t("quickstartSimulator.postStep.placeholder")}
                      className="w-full bg-transparent border-none resize-none outline-none text-gray-800 dark:text-gray-200"
                      rows={3}
                      onChange={(e) => setHasPosted(e.target.value.length > 0)}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">0/280</span>
                      <button
                        onClick={() => completeStep("post")}
                        disabled={!hasPosted}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {t("quickstartSimulator.buttons.post")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  {t("quickstartSimulator.postStep.tip")}
                </p>
              </div>
            </div>
          )}

          {currentStep === "follow" && (
            <div
              key="follow"
              className="animate-slide-up motion-reduce:animate-none"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-purple-600" />
                {t("quickstartSimulator.followStep.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("quickstartSimulator.followStep.description")}
              </p>

              <div className="space-y-3">
                {[
                  { name: "Alice", handle: "alice@nostrplebs.com", bio: "Bitcoin educator", followers: "12k" },
                  { name: "Bob", handle: "bob@example.com", bio: "Developer & designer", followers: "5k" },
                  { name: "Carol", handle: "carol@nos.lol", bio: "Artist & creator", followers: "8k" },
                  { name: "Dave", handle: "dave@iris.to", bio: "Nostr enthusiast", followers: "3k" },
                  { name: "Emma", handle: "emma@primal.net", bio: "Writer & podcaster", followers: "15k" },
                ].map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.handle}</div>
                        <div className="text-xs text-gray-400">{user.bio} · {user.followers} followers</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setFollowedCount(prev => prev + 1)}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700"
                    >
                      {t("quickstartSimulator.buttons.follow")}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("quickstartSimulator.followStep.following")}: {followedCount}/3
                </span>
                <button
                  onClick={() => completeStep("follow")}
                  disabled={followedCount < 3}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  {t("quickstartSimulator.buttons.continue")}
                </button>
              </div>
            </div>
          )}

          {currentStep === "interact" && (
            <div
              key="interact"
              className="animate-slide-up motion-reduce:animate-none"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-purple-600" />
                {t("quickstartSimulator.steps.interact")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("quickstartSimulator.interactStep.description")}
              </p>

              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Alice</span>
                        <span className="text-gray-500 text-sm">· 1h</span>
                      </div>
                      <p className="mt-1">Just published a guide to Nostr for beginners! Check it out</p>
                      <div className="flex gap-6 mt-3 text-gray-500">
                        <button className="flex items-center gap-1 hover:text-purple-600">
                          <MessageCircle className="w-4 h-4" /> {t("quickstartSimulator.buttons.reply")}
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-600">
                          <RefreshCw className="w-4 h-4" /> {t("quickstartSimulator.buttons.repost")}
                        </button>
                        <button 
                          className="flex items-center gap-1 hover:text-red-500"
                          onClick={() => completeStep("interact")}
                        >
                          <Heart className="w-4 h-4" /> {t("quickstartSimulator.buttons.like")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4 text-center">
                {t("quickstartSimulator.interactStep.instruction")}
              </p>
            </div>
          )}

          {currentStep === "zap" && (
            <div
              key="zap"
              className="animate-slide-up motion-reduce:animate-none"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                {t("quickstartSimulator.zapStep.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t("quickstartSimulator.zapStep.description")}
              </p>

              {!hasZapped ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-10 h-10 text-yellow-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t("quickstartSimulator.zapStep.invitation")}
                  </p>
                  <button
                    onClick={() => setHasZapped(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto"
                  >
                    <Zap className="w-5 h-5" />
                    {t("quickstartSimulator.zapStep.receive")}
                  </button>
                </div>
              ) : (
                <div
                  className="animate-scale-in motion-reduce:animate-none bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-6 text-center"
                >
                  <Zap className="mx-auto mb-2 h-6 w-6 text-warning-700 dark:text-warning-400" strokeWidth={1.5} aria-hidden="true" />
                  <h4 className="text-xl font-bold text-yellow-800 dark:text-yellow-400 mb-2">
                    {t("quickstartSimulator.zapStep.received")}
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-500 mb-4">
                    {t("quickstartSimulator.zapStep.earnInfo")}
                  </p>
                  <button
                    onClick={() => completeStep("zap")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold"
                  >
                    {t("quickstartSimulator.buttons.awesome")}
                  </button>
                </div>
              )}
            </div>
          )}

        {completedSteps.size === steps.length && (
          <div
            className="animate-scale-in motion-reduce:animate-none mt-6 text-center"
          >
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6">
              <PartyPopper className="mx-auto mb-2 h-6 w-6 text-success-700 dark:text-success-400" strokeWidth={1.5} aria-hidden="true" />
              <h4 className="text-xl font-bold text-green-800 dark:text-green-400">
                {t("quickstartSimulator.completion.title")}
              </h4>
              <p className="text-green-700 dark:text-green-500 mt-2">
                {t("quickstartSimulator.completion.description")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
