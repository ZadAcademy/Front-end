"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { User, BookOpen, Settings, LogOut, ChevronRight } from "lucide-react";
import { useGetProfileQuery } from "../hooks/use-profile-api";

export default function ProfileSidebar() {
  const t = useTranslations("Profile.sidebar");
  const pathname = usePathname();
  const { data: profile } = useGetProfileQuery();

  // Extract locale from pathname (e.g. /en/profile -> /en)
  const locale = pathname.split('/')[1] || 'en';

  const navItems = [
    {
      name: t("personalInfo", { defaultValue: "Personal Information" }),
      href: `/${locale}/profile`,
      icon: User,
      // Exact match for base profile route
      isActive: pathname === `/${locale}/profile`,
    },
    {
      name: t("myCourses", { defaultValue: "My Courses" }),
      href: `/${locale}/profile/courses`,
      icon: BookOpen,
      isActive: pathname.startsWith(`/${locale}/profile/courses`),
    },
    {
      name: t("settings", { defaultValue: "Settings" }),
      href: `/${locale}/profile/settings`,
      icon: Settings,
      isActive: pathname.startsWith(`/${locale}/profile/settings`),
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* User Mini Profile Header */}
      {profile && (
        <div className="p-6 border-b border-black/5 bg-gray-50/50 flex flex-col items-center text-center">
          <div className="size-20 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white mb-3 flex items-center justify-center">
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="size-8 text-gray-300" />
            )}
          </div>
          <h3 className="font-cairo-bold-lg text-greyDarker">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-sm font-cairo-medium-sm text-greyNormal truncate w-full px-2">
            {profile.email}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col p-4 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 font-cairo-semibold-base
              ${item.isActive 
                ? "bg-blueNormal text-white shadow-md shadow-blueNormal/20" 
                : "text-greyDark hover:bg-gray-100 hover:text-blueNormal"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon className={`size-5 transition-colors ${item.isActive ? "text-white" : "text-greyNormal group-hover:text-blueNormal"}`} />
              <span>{item.name}</span>
            </div>
            {!item.isActive && (
              <ChevronRight className="size-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 rtl:rotate-180" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
