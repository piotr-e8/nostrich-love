import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Bitcoin, ArrowRight, Check, Copy } from "lucide-react";
import { cn, copyToClipboard } from "../../lib/utils";

interface ZapSimulatorProps {
  className?: string;
}

const PRESET_AMOUNTS = [10, 100, 1000, 5000, 10000];

export function ZapSimulator({ className }: ZapSimulatorProps) {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleZap = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCopy = async () => {
    const lnurl = `lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhhgmmjwscqzzsxqrpcgupzqvdkxsmm4w4ek2njsmqx93rz8sctjhjlyk`;
    const success = await copyToClipboard(lnurl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        "bg-gray-800/30 border border-border-dark rounded-2xl p-6",
        className,
      )}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-2xl flex items-center justify-center mb-4">
          <Zap className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Zap Simulator</h3>
        <p className="text-gray-400 text-sm">
          Practice sending zaps without spending real sats
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            Amount (sats)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setAmount(preset);
                  setCustomAmount("");
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  amount === preset && !customAmount
                    ? "bg-amber-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600",
                )}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Custom amount..."
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(parseInt(e.target.value) || 0);
            }}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Lightning Invoice</span>
            <button
              onClick={handleCopy}
              className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-gray-500 break-all">
            lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhhgmmjwscqzzsxqrpcgupzqvdkxsmm4w4ek2njsmqx93rz8sctjhjlyk
          </div>
        </div>

        <motion.button
          onClick={handleZap}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Bitcoin className="w-5 h-5" />
          Send {amount.toLocaleString()} sats
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center"
          >
            <Zap className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-green-400 font-medium">Zap sent successfully!</p>
            <p className="text-green-400/70 text-sm">
              (This was a simulation - no real sats were sent)
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
