"use client";

import { Loader2 } from 'lucide-react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
  id?: string;
  ariaLabel?: string;
}

/**
 * Accessible RTL-aware toggle switch.
 */
export default function ToggleSwitch({
  checked,
  onChange,
  disabled,
  isLoading,
  id,
  ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
        transition-colors duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueNormal focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${checked ? 'bg-emerald-500' : 'bg-gray-300'}
      `}
    >
      <span
        className={`
          inline-flex size-5 items-center justify-center rounded-full bg-white shadow-sm
          transition-transform duration-200
          ${checked ? 'translate-x-[22px] rtl:-translate-x-[22px]' : 'translate-x-0.5 rtl:-translate-x-0.5'}
        `}
      >
        {isLoading && <Loader2 className="size-3 animate-spin text-greyNormal" />}
      </span>
    </button>
  );
}
