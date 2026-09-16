'use client';

import { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';
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
}: PaymentMethodCardProps) {
  const t = useTranslations('Checkout.paymentCard');
  const [copied, setCopied] = useState(false);

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
    <div className="flex flex-col mb-6 bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      
      {/* ─── Top Section: Account Details ─── */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between p-5">
        
        {/* Left side: Logo */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-24 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-black/5 p-2">
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
        <div className="flex flex-col items-center sm:items-end justify-center w-full sm:w-auto mt-5 sm:mt-0 flex-1 px-4 text-center sm:text-end">
          <span className="font-cairo-bold-lg text-greyDark">{title}</span>
          <span className="font-cairo-medium-sm text-greyNormal mt-1">{t('accountNumber', { defaultValue: 'Account Number' })}</span>
          <span className="font-mono font-cairo-bold-xl text-blueNormal tracking-wide mt-1" dir="ltr">
            {accountIdentifier}
          </span>
        </div>

        {/* Right side: Copy Button */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-start mt-5 sm:mt-0 shrink-0 sm:border-s sm:ps-6 border-black/5">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blueLight/10 text-blueNormal font-cairo-bold-sm hover:bg-blueNormal hover:text-white transition-colors w-full sm:w-auto cursor-pointer border border-blueNormal/10 hover:border-transparent"
          >
            {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
            <span>{t('copyData', { defaultValue: 'Copy Data' })}</span>
          </button>
        </div>
      </div>

      {/* ─── Bottom Section: Instructions ─── */}
      {instructionDescription && (
        <div className="p-5 bg-orange-50/50 border-t border-orange-100 flex gap-3 items-start">
          <div className="mt-0.5 shrink-0">
            <Info className="size-5 text-orange-500" />
          </div>
          <div className="flex flex-col">
            <h4 className="font-cairo-bold-sm text-orange-700 mb-1">
              {t('importantInstructions', { defaultValue: 'Important Instructions' })}
            </h4>
            <p className="font-cairo-medium-sm text-orange-800/80 leading-relaxed whitespace-pre-line">
              {instructionDescription}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
