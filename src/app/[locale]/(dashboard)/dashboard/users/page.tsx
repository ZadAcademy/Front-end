import UsersList from "@/features/dashboard/roles/components/users-list";

export const metadata = {
  title: 'User Management - Zad Academy',
};

export default function UsersPage() {
  return (
    <div className="p-6">
      <UsersList />
    </div>
  );
}
