import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { courseLocalizedPricesSchema, CourseLocalizedPricesFormData } from '../lib/schemas/course-localized-prices-schema';

export const useCourseLocalizedPricesForm = () => {
  const form = useForm<CourseLocalizedPricesFormData>({
    resolver: zodResolver(courseLocalizedPricesSchema) as any,
    defaultValues: {
      prices: [
        { id: uuidv4(), countryCode: '', currencyCode: '', price: 0, discountPrice: null as number | null }
      ],
    },
  });

  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
    control: form.control,
    name: 'prices',
  });

  const onSubmit = (data: CourseLocalizedPricesFormData) => {
    // For now, simply console.log to verify shape as requested.
    const payload = {
      prices: data.prices.map((p) => ({
        countryCode: p.countryCode,
        currencyCode: p.currencyCode,
        price: p.price,
        discountPrice: p.discountPrice,
      })),
    };
    
    console.log('Localized Prices Payload:', JSON.stringify(payload, null, 2));
  };

  return {
    form,
    priceFields,
    appendPrice,
    removePrice,
    onSubmit,
  };
};
