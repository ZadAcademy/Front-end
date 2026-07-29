import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { courseLocalizedPricesSchema, CourseLocalizedPricesFormData } from '../lib/schemas/course-localized-prices-schema';
import { useSearchParams } from 'next/navigation';
import { useUpdateLocalizedPricesMutation, useGetCourseQuery, useDeleteLocalizedPriceMutation } from './use-course-api';

export const useCourseLocalizedPricesForm = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const tToasts = useTranslations('Dashboard.addCourse.toasts');
  const { mutate: updateLocalizedPrices, isPending } = useUpdateLocalizedPricesMutation();
  const { mutate: deleteLocalizedPrice, isPending: isDeleting } = useDeleteLocalizedPriceMutation();

  const { data: courseData, isLoading: isLoadingCourse } = useGetCourseQuery(courseId);

  const form = useForm<CourseLocalizedPricesFormData>({
    resolver: zodResolver(courseLocalizedPricesSchema) as any,
    defaultValues: {
      prices: [
        { id: uuidv4(), countryCode: '', currencyCode: '', price: 0, discountPrice: null as number | null }
      ],
    },
  });

  useEffect(() => {
    if (courseData) {
      form.reset({
        prices: courseData.localizedPrices && courseData.localizedPrices.length > 0
          ? courseData.localizedPrices.map(p => ({
              id: p.id,
              countryCode: p.countryCode,
              currencyCode: p.currencyCode,
              price: p.price,
              discountPrice: p.discountPrice ?? null,
            }))
          : [{ id: uuidv4(), countryCode: '', currencyCode: '', price: 0, discountPrice: null }]
      });
    }
  }, [courseData, form]);

  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
    control: form.control,
    name: 'prices',
  });

  const handleRemovePrice = (index: number) => {
    const priceToRemove = form.getValues(`prices.${index}`);
    
    // Check if it's an existing price from the backend
    const isFromBackend = courseData?.localizedPrices?.some(p => p.id === priceToRemove.id);

    if (isFromBackend && courseId) {
      deleteLocalizedPrice({ courseId, priceId: priceToRemove.id }, {
        onSuccess: () => {
          removePrice(index);
          toast.success(tToasts('localizedPriceDeleted'));
        },
        onError: (error) => {
          toast.error(error.message || tToasts('localizedPriceDeleteFailed'));
        }
      });
    } else {
      removePrice(index);
    }
  };

  const onSubmit = (data: CourseLocalizedPricesFormData) => {
    if (!courseId) {
      toast.error(tToasts('missingCourseId'));
      return;
    }
    
    const payload = {
      prices: data.prices.map((p) => ({
        id: p.id,
        countryCode: p.countryCode,
        currencyCode: p.currencyCode,
        price: p.price,
        discountPrice: p.discountPrice,
      })),
    };
    
    updateLocalizedPrices({
      courseId,
      data: payload,
    }, {
      onSuccess: () => {
        toast.success(tToasts('localizedPricesUpdated'));
      },
      onError: (error) => {
        toast.error(error.message || tToasts('localizedPricesUpdateFailed'));
      }
    });
  };

  return {
    form,
    priceFields,
    appendPrice,
    removePrice: handleRemovePrice,
    onSubmit,
    courseId,
    isPending,
    isDeleting,
  };
};
