import React, { useId, useState } from "react";
import { Zap, Bitcoin, ArrowRight, Check, Copy } from "lucide-react";
import { cn, copyToClipboard } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";

interface ZapSimulatorProps {
  className?: string;
}

const PRESET_AMOUNTS = [10, 100, 1000, 5000, 10000];

export function ZapSimulator({ className }: ZapSimulatorProps) {
  const { t } = useTranslation();
  const amountInputId = useId();
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
        "rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <div className="text-center mb-6">
        <Zap
          className="mx-auto mb-4 h-6 w-6 text-gray-400 dark:text-gray-500"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h3 className="mb-2 text-h3 text-gray-900 dark:text-white">{t('zapSimulator.title')}</h3>
        <p className="text-body-sm text-gray-600 dark:text-gray-400">
          {t('zapSimulator.description')}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor={amountInputId} className="mb-2 block text-body-sm text-gray-600 dark:text-gray-400">
            {t('zapSimulator.labels.amount')}
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
                  "rounded-md px-4 py-2 text-body-sm font-medium transition-colors",
                  amount === preset && !customAmount
                    ? "bg-primary-600 text-white"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800",
                )}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>
          <input
            id={amountInputId}
            type="number"
            placeholder={t('zapSimulator.labels.amount')}
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(parseInt(e.target.value) || 0);
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-body text-gray-900 placeholder-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-sm text-gray-600 dark:text-gray-400">{t('zapSimulator.labels.invoice')}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-body-sm text-primary-text underline-offset-2 hover:underline dark:text-primary-400"
            >
              {copied ? (
                <Check className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              )}
              {copied ? t('zapSimulator.buttons.pay') : t('zapSimulator.buttons.copy')}
            </button>
          </div>
          <div className="break-all font-mono text-caption text-gray-500 dark:text-gray-400">
            lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhhgmmjwscqzzsxqrpcgupzqvdkxsmm4w4ek2njsmqx93rz8sctjhjlyk
          </div>
        </div>

        <button
          onClick={handleZap}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 py-4 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <Bitcoin className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          {t('zapSimulator.buttons.pay')} {amount.toLocaleString()} sats
          <ArrowRight
            className="h-5 w-5 rtl:rotate-180"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>

        {showSuccess && (
          <div
            className="animate-slide-up rounded-lg border border-success-200 bg-success-50 p-4 text-center motion-reduce:animate-none dark:border-success-900 dark:bg-success-950"
          >
            <Zap
              className="mx-auto mb-2 h-5 w-5 text-success-700 dark:text-success-400"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="font-medium text-success-800 dark:text-success-300">{t('zapSimulator.steps.confirm')}</p>
            <p className="text-body-sm text-success-800 dark:text-success-400">
              {t('zapSimulator.description')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
