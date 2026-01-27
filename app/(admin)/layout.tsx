import Providers from "@/app/providers";
import AdminShell from "../components/admin/common/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AdminShell>{children}</AdminShell>
    </Providers>
  );
}
  