'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  List,
  PlusCircle,
  ChevronDown,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * DashboardSidebar — Collapsible navigation sidebar for the dashboard.
 * Contains expandable sections for each module.
 * Currently supports: Dashboard home + Courses module.
 */
export default function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const t = useTranslations('Dashboard.sidebar');
  const pathname = usePathname();

  /* ─── Track which sections are expanded ─── */
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    courses: true, // Courses section open by default
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /* ─── Check if a path is the current active route ─── */
  const isActive = (path: string) => pathname === path;

  /* ─── Navigation items configuration ─── */
  const navItems = [
    {
      key: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      key: 'courses',
      label: t('courses'),
      icon: BookOpen,
      children: [
        { label: t('listCourses'), href: '/dashboard/courses', icon: List },
        { label: t('addCourse'), href: '/dashboard/courses/add', icon: PlusCircle },
      ],
    },
  ];

  return (
    <>
      {/* ─── Mobile Overlay ─── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          fixed top-0 bottom-0 z-50 w-64
          bg-white border-e border-black/10 shadow-sm
          transition-transform duration-300 ease-in-out
          lg:static lg:z-auto
          flex flex-col
          ${isOpen ? 'translate-x-0' : 'max-lg:-translate-x-full max-lg:rtl:translate-x-full'}
        `}
      >
        {/* ─── Sidebar Header ─── */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-black/5">
          <Link href="/dashboard" className="shrink-0">
            <span className="font-cairo-bold-xl text-blueNormal cursor-pointer select-none">
              زاد
            </span>
          </Link>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg
                       hover:bg-black/5 transition-colors cursor-pointer bg-transparent border-none"
            aria-label="Close sidebar"
          >
            <X className="size-5 text-greyDark" />
          </button>
        </div>

        {/* ─── Navigation Links ─── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              /* ── Simple link (no children) ── */
              if (!item.children) {
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href!}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        font-cairo-medium-lg transition-all duration-200
                        ${isActive(item.href!)
                          ? 'bg-blueNormal text-white shadow-md shadow-blueNormal/20'
                          : 'text-greyDark hover:bg-blueLight/50'
                        }
                      `}
                    >
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              }

              /* ── Expandable section (has children) ── */
              const isSectionOpen = expandedSections[item.key];
              const hasActiveChild = item.children.some((child) => isActive(child.href));

              return (
                <li key={item.key}>
                  {/* Section header — clickable to expand/collapse */}
                  <button
                    onClick={() => toggleSection(item.key)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      font-cairo-medium-lg transition-all duration-200
                      cursor-pointer bg-transparent border-none text-start
                      ${hasActiveChild
                        ? 'text-blueNormal bg-blueLight/30'
                        : 'text-greyDark hover:bg-blueLight/50'
                      }
                    `}
                  >
                    <item.icon className="size-5" />
                    <span className="flex-1">{item.label}</span>
                    <ChevronDown
                      className={`size-4 transition-transform duration-200 ${
                        isSectionOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Expandable children list */}
                  <div
                    className={`
                      grid transition-all duration-200 ease-in-out
                      ${isSectionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                    `}
                  >
                    <ul className="overflow-hidden">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg ms-6 mt-1
                              font-cairo-medium-sm transition-all duration-200
                              ${isActive(child.href)
                                ? 'bg-blueNormal text-white shadow-md shadow-blueNormal/20'
                                : 'text-greyNormal hover:bg-blueLight/50 hover:text-greyDark'
                              }
                            `}
                          >
                            <child.icon className="size-4" />
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
