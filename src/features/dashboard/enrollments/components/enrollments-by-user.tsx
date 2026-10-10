'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2, ArrowUpDown } from 'lucide-react';
import { useEnrollmentUsersQuery } from '../hooks/use-enrollments-api';
import { useDebounce } from '@/features/dashboard/orders/hooks/use-debounce';
import Pagination from '@/features/dashboard/orders/components/pagination';
import { AdminUserEnrollment } from '../lib/types/enrollments-types';
import { ManageUserCoursesDrawer } from './manage-user-courses-drawer';
import { Button } from '@/shared/ui/button';

export function EnrollmentsByUser() {
  const t = useTranslations('Dashboard.enrollments');
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDesc, setSortDesc] = useState<boolean>(true);

  const { data, isLoading, isError } = useEnrollmentUsersQuery({
    page,
    pageSize: 10,
    search: debouncedSearch,
    isActive: isActiveFilter,
    sortBy,
    sortDescending: sortDesc
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = data?.items.find(u => u.id === selectedUserId) || null;

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-greyLightActive" />
          <input
            type="text"
            placeholder={t('searchUsers')}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 rtl:pl-4 rtl:pr-10 pr-4 rounded-lg border border-black/5 bg-white font-cairo-medium-sm focus:border-blueNormal outline-none transition-colors shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-black/5 w-full md:w-auto">
            <button
              onClick={() => { setIsActiveFilter(undefined); setPage(1); }}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-cairo-bold-sm transition-colors ${isActiveFilter === undefined ? 'bg-blue-50 text-blueNormal' : 'text-greyNormal hover:bg-black/5'}`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => { setIsActiveFilter(true); setPage(1); }}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-cairo-bold-sm transition-colors ${isActiveFilter === true ? 'bg-green-50 text-green-700' : 'text-greyNormal hover:bg-black/5'}`}
            >
              {t('filterActive')}
            </button>
            <button
              onClick={() => { setIsActiveFilter(false); setPage(1); }}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-cairo-bold-sm transition-colors ${isActiveFilter === false ? 'bg-gray-100 text-gray-700' : 'text-greyNormal hover:bg-black/5'}`}
            >
              {t('filterInactive')}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-black/5 text-greyDark font-cairo-bold-sm">
                <th className="py-4 px-6 font-medium cursor-pointer hover:text-blueNormal transition-colors" onClick={() => toggleSort('firstName')}>
                  <div className="flex items-center gap-2">{t('colUser')} <ArrowUpDown className="size-3" /></div>
                </th>
                <th className="py-4 px-6 font-medium">{t('colPhone')}</th>
                <th className="py-4 px-6 font-medium">{t('colStatus')}</th>
                <th className="py-4 px-6 font-medium w-1/3">{t('colCourses')}</th>
                <th className="py-4 px-6 font-medium cursor-pointer hover:text-blueNormal transition-colors" onClick={() => toggleSort('createdAt')}>
                  <div className="flex items-center gap-2">{t('colJoined')} <ArrowUpDown className="size-3" /></div>
                </th>
                <th className="py-4 px-6 font-medium text-end">{t('colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="size-8 animate-spin text-blueNormal mx-auto" />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-red-500 font-cairo-medium-base">
                    {t('errorLoading')}
                  </td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-greyNormal font-cairo-medium-base">
                    {t('noUsersFound')}
                  </td>
                </tr>
              ) : (
                data?.items.map((user) => (
                  <tr key={user.id} className="border-b border-black/5 hover:bg-blue-50/50 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blueNormal/10 text-blueNormal flex items-center justify-center font-cairo-bold-base shrink-0">
                          {user.firstName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-cairo-bold-sm text-greyDarker truncate">{user.firstName} {user.lastName}</span>
                          <span className="text-xs font-cairo-medium-sm text-greyNormal truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm font-cairo-medium-sm text-greyDark">
                      {user.phoneNumber ? `${user.countryCode} ${user.phoneNumber}` : '—'}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-cairo-bold-sm ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {user.isActive ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {user.enrolledCourses.slice(0, 2).map(c => (
                          <span key={c.id} className="bg-blueNormal/10 text-blueNormal px-2 py-0.5 rounded text-xs font-cairo-bold-xs max-w-[120px] truncate" title={c.title}>
                            {c.title}
                          </span>
                        ))}
                        {user.enrolledCourses.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-cairo-bold-xs">
                            +{user.enrolledCourses.length - 2}
                          </span>
                        )}
                        {user.enrolledCourses.length === 0 && (
                          <span className="text-xs text-greyNormal">{t('none')}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm font-cairo-medium-sm text-greyDark">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUserId(user.id)}
                        className="font-cairo-bold-sm text-blueNormal border-blueNormal/30 hover:bg-blueNormal/5"
                      >
                        {t('manageCourses')}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-black/5 flex justify-center bg-gray-50">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ManageUserCoursesDrawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUserId(null)}
        user={selectedUser}
      />
    </div>
  );
}
