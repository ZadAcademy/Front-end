'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaymentMethodCardProps {
  logoUrl: string;
  title: string;
  accountIdentifier: string;
  instructionDescription: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function PaymentMethodCard({
  logoUrl,
  title,
  accountIdentifier,
  instructionDescription,
  isSelected,
  onClick,
}: PaymentMethodCardProps) {
  const t = useTranslations('Checkout.paymentCard');
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(accountIdentifier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = accountIdentifier;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col mb-4">
      <div 
        onClick={onClick}
        className={`flex flex-col sm:flex-row items-center sm:justify-between p-4 bg-white rounded-xl border transition-all duration-300 cursor-pointer ${
          isSelected 
            ? 'border-blueNormal shadow-[0_0_0_1px_rgba(37,99,235,1)] shadow-blueNormal/20' 
            : 'border-black/10 hover:border-blueNormal/50'
        }`}
      >
        {/* Left side: Logo */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={title}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="font-cairo-bold-lg text-blueNormal">{title.charAt(0)}</span>
            )}
          </div>
        </div>

        {/* Center: Title and Number */}
        <div className="flex flex-col items-center sm:items-end justify-center w-full sm:w-auto mt-4 sm:mt-0 flex-1 px-4">
          <span className="font-cairo-bold-base text-greyDark">{title}</span>
          <span className="font-cairo-medium-sm text-greyNormal">{t('accountNumber', { defaultValue: 'Account Number' })}</span>
          <span className="font-mono font-cairo-bold-lg text-greyDark tracking-wide mt-1" dir="ltr">
            {accountIdentifier}
          </span>
        </div>

        {/* Right side: Copy Button */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-start mt-4 sm:mt-0 shrink-0 border-t sm:border-t-0 sm:border-s sm:ps-4 border-black/5 pt-4 sm:pt-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blueLight/20 text-blueNormal font-cairo-semibold-sm hover:bg-blueNormal hover:text-white transition-colors w-full sm:w-auto justify-center"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            <span>{t('copyData', { defaultValue: 'Copy Data' })}</span>
          </button>
        </div>
      </div>

      {/* Optional: Show instructions if selected */}
      {isSelected && instructionDescription && (
        <div className="mt-2 p-4 bg-orange-50 border border-orange-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
          <h4 className="font-cairo-bold-sm text-orange-600 mb-2">{t('importantInstructions', { defaultValue: 'Important Instructions:' })}</h4>
          <p className="font-cairo-medium-sm text-orange-800 leading-relaxed whitespace-pre-line">
            {instructionDescription}
          </p>
        </div>
      )}
    </div>
  );
}
