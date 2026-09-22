'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BellRing, History, CalendarClock, BadgeDollarSign } from 'lucide-react';
import SendNotificationForm from './send-notification-form';
import NotificationHistoryTable from './notification-history-table';
import ExpiryManagement from './expiry-management';
import PriceAlertForm from './price-alert-form';

export default function AdminNotificationsPage() {
  const t = useTranslations('Dashboard.notifications');

  type TabKey = 'send' | 'history' | 'expiry' | 'price';
  const [activeTab, setActiveTab] = useState<TabKey>('send');

  const tabs = [
    { key: 'send' as const, label: t('tabSend', { defaultValue: 'Send Notification' }), icon: BellRing },
    { key: 'history' as const, label: t('tabHistory', { defaultValue: 'History' }), icon: History },
    { key: 'expiry' as const, label: t('tabExpiry', { defaultValue: 'Expiry Management' }), icon: CalendarClock },
    { key: 'price' as const, label: t('tabPrice', { defaultValue: 'Price Alerts' }), icon: BadgeDollarSign },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-cairo-bold-2xl text-greyDark">
          {t('pageTitle', { defaultValue: 'Notifications Management' })}
        </h1>
        <p className="font-cairo-medium-sm text-greyNormal mt-1">
          {t('pageSubtitle', { defaultValue: 'Send broadcasts, manage expirations, and view history.' })}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide  ">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-cairo-bold-sm transition-all whitespace-nowrap cursor-pointer border-none ${
              activeTab === tab.key
                ? 'bg-blueNormal text-white shadow-md shadow-blueNormal/20 translate-y-[1px]'
                : 'bg-white text-greyNormal hover:bg-black/5 hover:text-greyDarker'
            }`}
          >
            <tab.icon className={`size-4 ${activeTab === tab.key ? 'text-white' : 'text-greyNormal'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="min-h-[500px]">
        {activeTab === 'send' && <SendNotificationForm />}
        {activeTab === 'history' && <NotificationHistoryTable />}
        {activeTab === 'expiry' && <ExpiryManagement />}
        {activeTab === 'price' && <PriceAlertForm />}
      </div>
    </div>
  );
}
