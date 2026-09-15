import CheckoutPage from "@/features/checkout/checkout-page";

export const metadata = {
  title: 'Checkout - Zad Academy',
};

export default async function CheckoutRoute({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <CheckoutPage courseId={courseId} />;
}
