import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { cn } from "../../lib/utils";
import { DamusInteractiveSimulator } from "./damus";

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
        <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Key className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Generate Your Keys</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to create your Nostr identity.
            This happens entirely in your browser.
          </p>
          <button
            onClick={generateKeys}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                Generate My Keys
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
                <h4 className="font-bold text-green-700 dark:text-green-400">Public Key (npub)</h4>
                <p className="text-xs text-green-600 dark:text-green-500">Safe to share everywhere</p>
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
              {copied === "npub" ? "Copied!" : "Copy Public Key"}
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
                  <h4 className="font-bold text-red-700 dark:text-red-400">Private Key (nsec)</h4>
                  <p className="text-xs text-red-600 dark:text-red-500">NEVER share this with anyone</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrivate(!showPrivate)}
                className="text-xs text-red-600 hover:text-red-700 underline"
              >
                {showPrivate ? "Hide" : "Show"}
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
                {copied === "nsec" ? "Copied!" : "Copy Private Key"}
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-400">
              <strong>Important:</strong> Save your private key in 3+ places (password manager, paper, encrypted file). 
              If you lose it, your account is gone forever. No exceptions.
            </div>
          </div>

          <button
            onClick={generateKeys}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Generate New Keys (Current ones will be lost)
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {!selectedClient ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLIENTS.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client.id)}
              className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 text-left hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
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
                Try it <ArrowRight className="w-4 h-4" />
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
  const clientData = CLIENTS.find(c => c.id === client)!;
  
  const simulations: Record<Client, React.ReactNode> = {
    damus: <DamusSimulation />,
    amethyst: <AmethystSimulation />,
    iris: <IrisSimulation />,
    primal: <PrimalSimulation />,
    coracle: <CoracleSimulation />,
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
          >
            ← Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className="font-semibold">{clientData.name} Simulator</span>
        </div>
        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
          SIMULATION MODE
        </span>
      </div>
      
      <div className="p-4">
        {simulations[client]}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-t border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-400 text-center">
          This is a simulation. Try the interface, then go back to try others or proceed to Step 3.
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
    <div className="max-w-sm mx-auto bg-gray-900 rounded-3xl overflow-hidden border-8 border-gray-800">
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
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full" />
              <div>
                <div className="text-sm font-semibold text-white">Carol</div>
                <div className="text-xs text-gray-500">carol@nostrplebs.com</div>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">The customization options in Amethyst are incredible! 🎨</p>
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
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
          <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">Emma</span>
                  <span className="text-xs text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">✓</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">The UI in Primal is so clean! Love the discovery features ✨</p>
                <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">💬 23</span>
                  <span className="flex items-center gap-1">⚡ 1.2k</span>
                  <span className="flex items-center gap-1">❤️ 89</span>
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
  const [currentStep, setCurrentStep] = useState<Step>("relays");
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());
  const [connectedRelays, setConnectedRelays] = useState<string[]>(["relay.damus.io"]);
  const [hasPosted, setHasPosted] = useState(false);
  const [followedCount, setFollowedCount] = useState(0);
  const [hasZapped, setHasZapped] = useState(false);

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "relays", label: "Connect Relays", icon: <Server className="w-4 h-4" /> },
    { id: "post", label: "First Post", icon: <Send className="w-4 h-4" /> },
    { id: "follow", label: "Follow People", icon: <UserPlus className="w-4 h-4" /> },
    { id: "interact", label: "Interact", icon: <Heart className="w-4 h-4" /> },
    { id: "zap", label: "Receive Zap", icon: <Zap className="w-4 h-4" /> },
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <AnimatePresence mode="wait">
          {currentStep === "relays" && (
            <motion.div
              key="relays"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Server className="w-6 h-6 text-purple-600" />
                Connect to Relays
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Relays are servers that store and share posts. Most clients auto-connect to popular ones, 
                but let's make sure you're connected.
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
                      <span className="text-sm text-green-600 font-semibold">Connected</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => completeStep("relays")}
                disabled={connectedRelays.length === 0}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold"
              >
                {connectedRelays.length > 0 ? "Continue →" : "Connect at least one relay"}
              </button>
            </motion.div>
          )}

          {currentStep === "post" && (
            <motion.div
              key="post"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Send className="w-6 h-6 text-purple-600" />
                Make Your First Post
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Time to say hello! Write your first post. Don't worry, this is just a simulation.
              </p>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <textarea
                      placeholder="Hello Nostr! Excited to be here. 👋"
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
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  <strong>Tip:</strong> First posts are usually greetings, introductions, or questions. 
                  Keep it simple and authentic!
                </p>
              </div>
            </motion.div>
          )}

          {currentStep === "follow" && (
            <motion.div
              key="follow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-purple-600" />
                Follow Some Accounts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your feed is empty because you're not following anyone yet. Follow at least 3 accounts to see posts.
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
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full" />
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
                      Follow
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Following: {followedCount}/3
                </span>
                <button
                  onClick={() => completeStep("follow")}
                  disabled={followedCount < 3}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === "interact" && (
            <motion.div
              key="interact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-purple-600" />
                Interact with Posts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Now your feed has content! Try liking, replying, or reposting to join the conversation.
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
                      <p className="mt-1">Just published a guide to Nostr for beginners! Check it out 👇</p>
                      <div className="flex gap-6 mt-3 text-gray-500">
                        <button className="flex items-center gap-1 hover:text-purple-600">
                          <MessageCircle className="w-4 h-4" /> Reply
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-600">
                          <RefreshCw className="w-4 h-4" /> Repost
                        </button>
                        <button 
                          className="flex items-center gap-1 hover:text-red-500"
                          onClick={() => completeStep("interact")}
                        >
                          <Heart className="w-4 h-4" /> Like
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-4 text-center">
                Click "Like" to complete this step
              </p>
            </motion.div>
          )}

          {currentStep === "zap" && (
            <motion.div
              key="zap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Receive a Zap
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Zaps are Bitcoin tips sent over Lightning Network. Let's simulate receiving one!
              </p>

              {!hasZapped ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-10 h-10 text-yellow-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Someone wants to send you a tip!
                  </p>
                  <button
                    onClick={() => setHasZapped(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto"
                  >
                    <Zap className="w-5 h-5" />
                    Receive 1,000 sats
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-6 text-center"
                >
                  <div className="text-4xl mb-2">⚡</div>
                  <h4 className="text-xl font-bold text-yellow-800 dark:text-yellow-400 mb-2">
                    You received 1,000 sats!
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-500 mb-4">
                    That's about $0.30 in Bitcoin. This is how creators earn on Nostr.
                  </p>
                  <button
                    onClick={() => completeStep("zap")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-semibold"
                  >
                    Awesome! →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {completedSteps.size === steps.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-center"
          >
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6">
              <div className="text-4xl mb-2">🎉</div>
              <h4 className="text-xl font-bold text-green-800 dark:text-green-400">
                You completed the first day simulation!
              </h4>
              <p className="text-green-700 dark:text-green-500 mt-2">
                You're ready for the real thing. Move on to Step 4 to pick your client.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
