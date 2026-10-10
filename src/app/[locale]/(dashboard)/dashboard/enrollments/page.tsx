import EnrollmentsPage from '@/features/dashboard/enrollments/components/enrollments-page';

export const metadata = {
  title: 'Enrollments Management - Zad Academy',
};

export default function Page() {
  return (
    <div className="p-6">
      <EnrollmentsPage />
    </div>
  );
}
