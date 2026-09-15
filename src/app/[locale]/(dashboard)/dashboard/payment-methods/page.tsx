import PaymentMethodsList from "@/features/dashboard/payment-methods/components/payment-methods-list";

export const metadata = {
  title: 'Payment Methods - Zad Academy',
};

export default function PaymentMethodsPage() {
  return (
    <div className="p-6">
      <PaymentMethodsList />
    </div>
  );
}
