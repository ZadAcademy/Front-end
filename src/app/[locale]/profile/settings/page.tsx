import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Settings, Bell, Shield, Key } from 'lucide-react';

export default async function SettingsPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);
  
  const t = await getTranslations('Profile.sidebar');

  return (
    <div className="w-full max-w-4xl mx-auto py-8 lg:py-0">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-8 sm:p-10">
        <h2 className="lg:font-cairo-bold-3xl font-cairo-bold-lg text-greyDarker mb-8 border-b pb-4 flex items-center gap-3">
          <Settings className="size-8 text-blueNormal" />
          {t('settings')}
        </h2>
        
        {/* Dummy Settings UI */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Bell className="size-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-cairo-bold-lg text-greyDarker">Email Notifications</h4>
                <p className="text-sm font-cairo-medium-sm text-greyNormal">Receive updates about your enrolled courses</p>
              </div>
            </div>
            <div className="w-11 h-6 bg-blueNormal rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Shield className="size-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-cairo-bold-lg text-greyDarker">Two-Factor Authentication</h4>
                <p className="text-sm font-cairo-medium-sm text-greyNormal">Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className="w-11 h-6 bg-gray-300 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Key className="size-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-cairo-bold-lg text-greyDarker">Change Password</h4>
                <p className="text-sm font-cairo-medium-sm text-greyNormal">Update your account password</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-cairo-semibold-sm hover:bg-gray-100 transition-colors">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
