import { z } from 'zod';

export const courseLocalizedPricesSchema = z.object({
  prices: z.array(
    z.object({
      id: z.string().optional(),
      countryCode: z.string().min(1, 'countryRequired'),
      currencyCode: z.string().min(1, 'currencyRequired'),
      price: z.coerce.number().min(0, 'priceInvalid'),
      discountPrice: z.coerce.number().min(0, 'discountPriceInvalid').nullable().optional(),
    }).refine(
      (data) => {
        if (data.discountPrice != null && data.price != null && data.discountPrice >= data.price) {
          return false;
        }
        return true;
      },
      {
        message: 'discountPriceMustBeLessThanPrice',
        path: ['discountPrice'],
      }
    )
  ).min(1, 'atLeastOnePriceRequired'),
});

export type CourseLocalizedPricesFormData = z.infer<typeof courseLocalizedPricesSchema>;
