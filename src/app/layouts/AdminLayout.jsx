// src/layouts/AdminLayout.jsx
import Sidebar from "@/features/admin/components/SideBar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 lg:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
