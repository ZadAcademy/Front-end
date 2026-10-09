'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X, Check, XCircle, Loader2, Maximize2, Bell, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { OrderResponse, OrderStatus } from '../lib/types/orders-types';
import { useUpdateOrderStatusMutation } from '../hooks/use-orders-api';
import { useSendNotificationMutation } from '@/features/notifications/hooks/use-admin-notifications-api';
import { NotificationType } from '@/features/notifications/lib/types/notification-types';
import { toast } from 'sonner';

interface ReviewOrderModalProps {
  order: OrderResponse | null;
  onClose: () => void;
}

type ModalStep = 'review' | 'confirm';

export default function ReviewOrderModal({ order, onClose }: ReviewOrderModalProps) {
  const t = useTranslations('Dashboard.orders.modal');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const updateMutation = useUpdateOrderStatusMutation();
  const sendNotificationMutation = useSendNotificationMutation();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [step, setStep] = useState<ModalStep>('review');
  const [chosenAction, setChosenAction] = useState<OrderStatus.Accepted | OrderStatus.Denied | null>(null);

  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationCustomType, setNotificationCustomType] = useState('');

  if (!order) return null;

  /* ─── Default notification messages ─── */
  const getDefaultTitle = (action: OrderStatus.Accepted | OrderStatus.Denied) => {
    if (action === OrderStatus.Accepted) {
      return isRTL
        ? `تم قبول طلبك في ${order.courseTitle}`
        : `Your order for ${order.courseTitle} has been accepted`;
    }
    return isRTL
      ? `تم رفض طلبك في ${order.courseTitle}`
      : `Your order for ${order.courseTitle} has been denied`;
  };

  const getDefaultMessage = (action: OrderStatus.Accepted | OrderStatus.Denied) => {
    if (action === OrderStatus.Accepted) {
      return isRTL
        ? `مرحبًا ${order.userFullName}،\n\nتم قبول طلبك وتفعيل اشتراكك في الدورة "${order.courseTitle}" بنجاح. يمكنك الآن البدء في التعلم.\n\nبالتوفيق!`
        : `Hello ${order.userFullName},\n\nYour order has been accepted and your enrollment in "${order.courseTitle}" has been activated. You can start learning now.\n\nGood luck!`;
    }
    return isRTL
      ? `مرحبًا ${order.userFullName}،\n\nنأسف لإبلاغك بأن طلبك للاشتراك في الدورة "${order.courseTitle}" تم رفضه. يرجى التأكد من صحة إيصال التحويل والمبلغ المطلوب والمحاولة مرة أخرى.\n\nلأي استفسار، تواصل معنا.`
      : `Hello ${order.userFullName},\n\nWe regret to inform you that your order for "${order.courseTitle}" has been denied. Please verify your transfer receipt and the required amount, then try again.\n\nFor any questions, feel free to contact us.`;
  };

  const handleActionClick = (action: OrderStatus.Accepted | OrderStatus.Denied) => {
    setChosenAction(action);
    setNotificationTitle(getDefaultTitle(action));
    setNotificationMessage(getDefaultMessage(action));
    setNotificationCustomType('');
    setStep('confirm');
  };

  const handleConfirmAndSend = () => {
    if (!chosenAction) return;

    updateMutation.mutate(
      { orderId: order.id, request: { status: chosenAction } },
      {
        onSuccess: () => {
          sendNotificationMutation.mutate(
            {
              title: notificationTitle.trim(),
              message: notificationMessage.trim(),
              type: NotificationType.OrderConfirmation,
              customType: notificationCustomType.trim() || undefined,
              targetCourseId: order.courseId,
              targetUserIds: [order.userId],
              broadcastToAll: false,
            },
            {
              onSuccess: () => {
                toast.success(
                  chosenAction === OrderStatus.Accepted
                    ? t('acceptSuccessWithNotif', { defaultValue: 'Order accepted & notification sent to the student' })
                    : t('denySuccessWithNotif', { defaultValue: 'Order denied & notification sent to the student' })
                );
                onClose();
              },
              onError: () => {
                toast.warning(t('notifFailed', { defaultValue: 'Order updated but notification failed to send.' }));
                onClose();
              },
            }
          );
        },
        onError: () => {
          toast.error(t('updateFailed', { defaultValue: 'Failed to update order status' }));
        },
      }
    );
  };

  const isProcessing = updateMutation.isPending || sendNotificationMutation.isPending;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-black/10">
            <div className="flex items-center gap-3">
              {step === 'confirm' && (
                <button
                  onClick={() => setStep('review')}
                  disabled={isProcessing}
                  className="p-2 hover:bg-black/5 rounded-xl transition-colors text-greyNormal"
                >
                  {isRTL ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
                </button>
              )}
              <div>
                <h3 className="font-cairo-bold-xl text-greyDark">
                  {step === 'review' ? t('title', { defaultValue: 'Review Receipt' }) : t('confirmTitle', { defaultValue: 'Confirm & Notify' })}
                </h3>
                <p className="font-cairo-medium-sm text-greyNormal mt-0.5">
                  {order.userFullName} • {order.courseTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="p-2 text-greyLightActive hover:bg-black/5 rounded-xl transition-colors disabled:opacity-50"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">

            {step === 'review' ? (
              <>
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

                  {order.discountRequestId && (
                    <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-200/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="block font-cairo-bold-sm text-orange-700">{t('discountRequest', { defaultValue: 'Discount Request' })}</span>
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 font-cairo-bold-xs">
                          {order.discountPolicyPercent}% OFF
                        </span>
                      </div>
                      
                      <span className="block font-cairo-medium-xs text-orange-600/80 mb-1">{t('discountType', { defaultValue: 'Type' })}</span>
                      <span className="block font-cairo-bold-sm text-orange-800 mb-3">{order.discountTypeName || 'N/A'}</span>

                      {order.discountCourseName && (
                        <div className="mb-3">
                          <span className="block font-cairo-medium-xs text-orange-600/80 mb-1">{t('prevCourse', { defaultValue: 'Previous Course' })}</span>
                          <span className="block font-cairo-medium-sm text-orange-800">{order.discountCourseName}</span>
                          <span className="block font-cairo-regular-xs text-orange-800/80">{order.discountCourseNumber}</span>
                        </div>
                      )}

                      {order.discountProofData && order.discountProofData.length > 0 && (
                        <div className="mb-3">
                          <span className="block font-cairo-medium-xs text-orange-600/80 mb-1">{t('proofData', { defaultValue: 'Provided Proof' })}</span>
                          <ul className="list-disc list-inside space-y-1">
                            {order.discountProofData.map((proof, idx) => (
                              <li key={idx} className="font-cairo-medium-sm text-orange-800 break-all">{proof}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {order.discountNotes && (
                        <div>
                          <span className="block font-cairo-medium-xs text-orange-600/80 mb-1">{t('notes', { defaultValue: 'Notes' })}</span>
                          <p className="font-cairo-regular-sm text-orange-800 bg-orange-100/50 p-2 rounded-lg text-sm">{order.discountNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <button
                      onClick={() => handleActionClick(OrderStatus.Accepted)}
                      className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-cairo-bold-base rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="size-5" />
                      {t('accept', { defaultValue: 'Accept & Enroll' })}
                    </button>
                    <button
                      onClick={() => handleActionClick(OrderStatus.Denied)}
                      className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-cairo-bold-base rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="size-5" />
                      {t('deny', { defaultValue: 'Deny' })}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col gap-6 animate-in slide-in-from-right-4 duration-200">
                <div className={`flex items-center gap-3 p-4 rounded-xl border ${chosenAction === OrderStatus.Accepted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${chosenAction === OrderStatus.Accepted ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    <Bell className={`size-5 ${chosenAction === OrderStatus.Accepted ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-cairo-bold-base ${chosenAction === OrderStatus.Accepted ? 'text-green-700' : 'text-red-700'}`}>
                      {chosenAction === OrderStatus.Accepted
                        ? t('confirmAccept', { defaultValue: 'You are about to accept this order' })
                        : t('confirmDeny', { defaultValue: 'You are about to deny this order' })}
                    </h4>
                    <p className={`font-cairo-medium-sm mt-0.5 ${chosenAction === OrderStatus.Accepted ? 'text-green-600' : 'text-red-600'}`}>
                      {t('notifyDesc', { defaultValue: 'A notification will be sent. Customize the message below.' })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-cairo-bold-sm text-greyDark">
                      {t('notifTitle', { defaultValue: 'Notification Title' })}
                    </label>
                    <input
                      type="text"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      disabled={isProcessing}
                      className="h-12 px-4 rounded-xl border bg-gray-50 font-cairo-medium-sm text-greyDarker
                                outline-none focus:bg-white focus:ring-4 transition-all border-black/10 focus:border-blueNormal focus:ring-blueNormal/10
                                disabled:opacity-60"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-cairo-bold-sm text-greyDark">
                      {t('customTypeLabel', { defaultValue: 'Notification Type Label (Optional)' })}
                    </label>
                    <input
                      type="text"
                      value={notificationCustomType}
                      onChange={(e) => setNotificationCustomType(e.target.value)}
                      disabled={isProcessing}
                      placeholder={t('customTypePlaceholder', { defaultValue: 'e.g. Announcement, Alert...' })}
                      className="h-12 px-4 rounded-xl border bg-gray-50 font-cairo-medium-sm text-greyDarker
                                outline-none focus:bg-white focus:ring-4 transition-all border-black/10 focus:border-blueNormal focus:ring-blueNormal/10
                                disabled:opacity-60"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-cairo-bold-sm text-greyDark">
                      {t('notifMessage', { defaultValue: 'Notification Message' })}
                    </label>
                    <textarea
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      disabled={isProcessing}
                      rows={5}
                      className="px-4 py-3 rounded-xl border bg-gray-50 font-cairo-medium-sm text-greyDarker
                                outline-none focus:bg-white focus:ring-4 transition-all resize-none border-black/10 focus:border-blueNormal focus:ring-blueNormal/10
                                disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 mt-auto flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-greyDark font-cairo-bold-base rounded-xl
                              transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRTL ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
                    {t('goBack', { defaultValue: 'Go Back' })}
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmAndSend}
                    disabled={isProcessing || !notificationTitle.trim() || !notificationMessage.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blueNormal text-white
                              font-cairo-bold-base hover:bg-blueNormalHover transition-colors shadow-lg shadow-blueNormal/20
                              cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Send className="size-5" />
                    )}
                    {chosenAction === OrderStatus.Accepted
                      ? t('confirmAcceptBtn', { defaultValue: 'Accept & Send Notification' })
                      : t('confirmDenyBtn', { defaultValue: 'Deny & Send Notification' })}
                  </button>
                </div>
              </div>
            )}

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
