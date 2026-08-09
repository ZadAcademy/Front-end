import RolesList from "@/features/dashboard/roles/components/roles-list";

export const metadata = {
  title: 'Roles Management - Zad Academy',
};

export default function RolesPage() {
  return (
    <div className="p-6">
      <RolesList />
    </div>
  );
}
