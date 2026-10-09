import DiscountPoliciesList from "@/features/dashboard/ambassadors/components/discount-policies-list";

export const metadata = {
  title: 'Zad Ambassadors - Zad Academy',
  description: 'Manage Zad Ambassadors discount policies.',
};

export default function AmbassadorsPage() {
  return (
    <div className="p-6">
      <DiscountPoliciesList />
    </div>
  );
}
