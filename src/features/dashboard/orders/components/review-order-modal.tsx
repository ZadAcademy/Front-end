'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Check, XCircle, Loader2, Maximize2 } from 'lucide-react';
import { OrderResponse, OrderStatus } from '../lib/types/orders-types';
import { useUpdateOrderStatusMutation } from '../hooks/use-orders-api';
import { toast } from 'sonner';

interface ReviewOrderModalProps {
  order: OrderResponse | null;
  onClose: () => void;
}

export default function ReviewOrderModal({ order, onClose }: ReviewOrderModalProps) {
  const t = useTranslations('Dashboard.orders.modal');
  const updateMutation = useUpdateOrderStatusMutation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pendingAction, setPendingAction] = useState<OrderStatus | null>(null);

  if (!order) return null;

  const handleUpdateStatus = (newStatus: OrderStatus.Accepted | OrderStatus.Denied) => {
    setPendingAction(newStatus);
    updateMutation.mutate(
      { orderId: order.id, request: { status: newStatus } },
      {
        onSuccess: () => {
          setPendingAction(null);
          toast.success(
            newStatus === OrderStatus.Accepted
              ? t('acceptSuccess', { defaultValue: 'Order accepted successfully' })
              : t('denySuccess', { defaultValue: 'Order denied successfully' })
          );
          onClose();
        },
        onError: () => {
          setPendingAction(null);
        }
      }
    );
  };

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/10">
            <div>
              <h3 className="font-cairo-bold-xl text-greyDark">{t('title', { defaultValue: 'Review Receipt' })}</h3>
              <p className="font-cairo-medium-sm text-greyNormal mt-1">
                {order.userFullName} • {order.courseTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-greyLightActive hover:bg-black/5 rounded-xl transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
            
            {/* Receipt Image Area */}
            <div className="flex-1 bg-gray-50 rounded-xl border border-black/5 flex items-center justify-center relative min-h-[300px] overflow-hidden group">
              {order.receiptImageUrl ? (
                <>
                  <img
                    src={order.receiptImageUrl}
                    alt="Receipt"
                    className="max-w-full max-h-[400px] object-contain cursor-pointer"
                    onClick={() => setIsFullscreen(true)}
                  />
                  <button 
                    onClick={() => setIsFullscreen(true)}
                    className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="size-5" />
                  </button>
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="size-8 text-red-500" />
                  </div>
                  <p className="font-cairo-bold-base text-greyDark">{t('expiredReceipt', { defaultValue: 'Receipt Expired' })}</p>
                  <p className="font-cairo-medium-sm text-greyNormal mt-1 max-w-xs mx-auto">
                    {t('expiredDescription', { defaultValue: 'This receipt image was deleted due to the 30-day retention policy.' })}
                  </p>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="w-full md:w-72 flex flex-col gap-4">
              <div className="bg-blueLight/5 rounded-xl p-4 border border-blueNormal/10">
                <span className="block font-cairo-medium-xs text-greyNormal mb-1">{t('studentInfo', { defaultValue: 'Student Information' })}</span>
                <span className="block font-cairo-bold-base text-greyDark">{order.userFullName}</span>
                <span className="block font-cairo-medium-sm text-greyDark mt-1">{order.userEmail}</span>
                <span className="block font-cairo-medium-sm text-greyDark mt-1" dir="ltr">{order.userPhoneNumber || 'N/A'}</span>
              </div>
              
              <div className="bg-blueLight/5 rounded-xl p-4 border border-blueNormal/10">
                <span className="block font-cairo-medium-xs text-greyNormal mb-1">{t('course', { defaultValue: 'Course' })}</span>
                <span className="block font-cairo-bold-base text-blueNormal">{order.courseTitle}</span>
              </div>

              <div className="bg-blueLight/5 rounded-xl p-4 border border-blueNormal/10">
                <span className="block font-cairo-medium-xs text-greyNormal mb-1">{t('submissionDate', { defaultValue: 'Submission Date' })}</span>
                <span className="block font-cairo-bold-sm text-greyDark">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              
              <div className="mt-auto pt-4 flex flex-col gap-3">
                <button
                  onClick={() => handleUpdateStatus(OrderStatus.Accepted)}
                  disabled={updateMutation.isPending}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-cairo-bold-base rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {pendingAction === OrderStatus.Accepted ? <Loader2 className="size-5 animate-spin" /> : <Check className="size-5" />}
                  {t('accept', { defaultValue: 'Accept & Enroll' })}
                </button>
                <button
                  onClick={() => handleUpdateStatus(OrderStatus.Denied)}
                  disabled={updateMutation.isPending}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-cairo-bold-base rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {pendingAction === OrderStatus.Denied ? <Loader2 className="size-5 animate-spin" /> : <X className="size-5" />}
                  {t('deny', { defaultValue: 'Deny' })}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && order.receiptImageUrl && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsFullscreen(false)}
        >
          <img
            src={order.receiptImageUrl}
            alt="Receipt Fullscreen"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}
