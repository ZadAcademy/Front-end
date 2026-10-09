import { Users, Handshake, RotateCcw, Link2, type LucideIcon } from 'lucide-react';
import { AmbassadorType } from '../types/ambassador-types';

/**
 * UI configuration per ambassador type.
 * `key` is used to look up translations under `Dashboard.ambassadors.types.{key}`.
 */
export interface AmbassadorTypeConfig {
  key: 'groupEnrollment' | 'engineerLeads' | 'returningStudent' | 'groupLinks';
  icon: LucideIcon;
  /** Tailwind classes for the icon bubble */
  iconClass: string;
  /** Tailwind classes for the top accent bar of the card */
  accentClass: string;
}

export const AMBASSADOR_TYPE_CONFIG: Record<AmbassadorType, AmbassadorTypeConfig> = {
  [AmbassadorType.GroupEnrollment]: {
    key: 'groupEnrollment',
    icon: Users,
    iconClass: 'bg-blue-50 text-blue-600',
    accentClass: 'from-blue-500 to-indigo-500',
  },
  [AmbassadorType.EngineerLeads]: {
    key: 'engineerLeads',
    icon: Handshake,
    iconClass: 'bg-amber-50 text-amber-600',
    accentClass: 'from-amber-400 to-orange-500',
  },
  [AmbassadorType.ReturningStudent]: {
    key: 'returningStudent',
    icon: RotateCcw,
    iconClass: 'bg-emerald-50 text-emerald-600',
    accentClass: 'from-emerald-400 to-teal-500',
  },
  [AmbassadorType.GroupLinks]: {
    key: 'groupLinks',
    icon: Link2,
    iconClass: 'bg-violet-50 text-violet-600',
    accentClass: 'from-violet-500 to-fuchsia-500',
  },
};

export const getAmbassadorTypeConfig = (type: number): AmbassadorTypeConfig =>
  AMBASSADOR_TYPE_CONFIG[type as AmbassadorType] ?? AMBASSADOR_TYPE_CONFIG[AmbassadorType.GroupEnrollment];
