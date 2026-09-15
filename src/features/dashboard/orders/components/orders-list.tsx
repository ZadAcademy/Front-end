'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2, Search, Eye, Filter } from 'lucide-react';
import { OrderResponse, OrderStatus } from '../lib/types/orders-types';
import { useGetAllOrdersQuery } from '../hooks/use-orders-api';
import ReviewOrderModal from './review-order-modal';
import Pagination from './pagination';
import { useDebounce } from '../hooks/use-debounce';

export default function OrdersList() {
  const t = useTranslations('Dashboard.orders');
  
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 500);

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  // We query all orders; the API returns both newOrders (pending) and oldOrders (history)
  // If we are on 'pending', we shouldn't pass a status filter (unless we want to enforce it, but the API already splits them).
  // If we are on 'history', we might filter by Accepted/Denied.
  const queryStatus = activeTab === 'pending' ? OrderStatus.Pending : statusFilter;

  const { data: ordersData, isLoading, isError } = useGetAllOrdersQuery({
    page,
    pageSize,
    search: debouncedSearch,
    status: queryStatus,
  });

  const currentDataset = activeTab === 'pending' ? ordersData?.newOrders : ordersData?.oldOrders;

  const columnHelper = createColumnHelper<OrderResponse>();

  const columns = [
    columnHelper.accessor('userFullName', {
      header: t('table.student', { defaultValue: 'Student' }),
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-cairo-semibold-sm text-greyDark">{info.getValue()}</span>
          <span className="font-cairo-medium-xs text-greyNormal">{info.row.original.userEmail}</span>
        </div>
      ),
    }),
    columnHelper.accessor('courseTitle', {
      header: t('table.course', { defaultValue: 'Course' }),
      cell: (info) => <span className="font-cairo-medium-sm text-greyDark">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: t('table.status', { defaultValue: 'Status' }),
      cell: (info) => {
        const status = info.getValue();
        if (status === OrderStatus.Pending) {
          return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-cairo-semibold-xs">{t('statusNames.pending', { defaultValue: 'Pending' })}</span>;
        }
        if (status === OrderStatus.Accepted) {
          return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-cairo-semibold-xs">{t('statusNames.accepted', { defaultValue: 'Accepted' })}</span>;
        }
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-cairo-semibold-xs">{t('statusNames.denied', { defaultValue: 'Denied' })}</span>;
      },
    }),
    columnHelper.accessor('createdAt', {
      header: t('table.date', { defaultValue: 'Date' }),
      cell: (info) => (
        <span className="font-cairo-medium-sm text-greyNormal">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: t('table.actions', { defaultValue: 'Actions' }),
      cell: (info) => (
        <button
          onClick={() => setSelectedOrder(info.row.original)}
          className="inline-flex w-fit items-center gap-2 px-3 py-1.5 bg-blueLight/10 text-blueNormal hover:bg-blueNormal hover:text-white transition-colors rounded-lg font-cairo-semibold-sm"
        >
          <Eye className="size-4" />
          {t('actions.review', { defaultValue: 'Review' })}
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: currentDataset?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-black/5">
        <div>
          <h1 className="font-cairo-bold-2xl text-greyDark">{t('title', { defaultValue: 'Orders Management' })}</h1>
          <p className="font-cairo-medium-sm text-greyNormal mt-1">
            {t('subtitle', { defaultValue: 'Review and manage student payment receipts' })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        {/* Tabs & Filters */}
        <div className="p-5 border-b border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('pending'); setPage(1); setStatusFilter(undefined); }}
              className={`px-6 py-2 rounded-lg font-cairo-bold-sm transition-all ${
                activeTab === 'pending'
                  ? 'bg-white text-blueNormal shadow-sm'
                  : 'text-greyNormal hover:text-greyDark'
              }`}
            >
              {t('tabs.pending', { defaultValue: 'Pending Orders' })}
              {activeTab === 'pending' && currentDataset && (
                <span className="ms-2 px-2 py-0.5 bg-blueNormal/10 rounded-md text-xs">{currentDataset.totalCount}</span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('history'); setPage(1); }}
              className={`px-6 py-2 rounded-lg font-cairo-bold-sm transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-blueNormal shadow-sm'
                  : 'text-greyNormal hover:text-greyDark'
              }`}
            >
              {t('tabs.history', { defaultValue: 'Order History' })}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-greyLightActive" />
              <input
                type="text"
                placeholder={t('searchPlaceholder', { defaultValue: 'Search by name, email, course...' })}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal text-sm font-cairo-medium-sm"
              />
            </div>
            
            {activeTab === 'history' && (
              <select
                value={statusFilter === undefined ? '' : statusFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setStatusFilter(val === '' ? undefined : Number(val) as OrderStatus);
                  setPage(1);
                }}
                className="py-2 pl-3 pr-8 bg-gray-50 border border-black/10 rounded-xl focus:outline-none focus:border-blueNormal focus:ring-1 focus:ring-blueNormal text-sm font-cairo-medium-sm"
              >
                <option value="">{t('filter.all', { defaultValue: 'All Status' })}</option>
                <option value={OrderStatus.Accepted}>{t('filter.accepted', { defaultValue: 'Accepted' })}</option>
                <option value={OrderStatus.Denied}>{t('filter.denied', { defaultValue: 'Denied' })}</option>
              </select>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-gray-50 border-b border-black/5">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 font-cairo-semibold-sm text-greyNormal whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <Loader2 className="size-8 animate-spin text-blueNormal mx-auto mb-2" />
                    <span className="font-cairo-medium-sm text-greyNormal">{t('loading', { defaultValue: 'Loading orders...' })}</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-red-500 font-cairo-medium-sm">
                    {t('error', { defaultValue: 'Failed to load orders' })}
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-greyNormal font-cairo-medium-sm">
                    {t('empty', { defaultValue: 'No orders found' })}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-black/5 hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {currentDataset && currentDataset.totalPages > 1 && (
          <div className="p-5 border-t border-black/5 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={currentDataset.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ReviewOrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
