// src/layouts/AdminLayout.jsx
import Sidebar from "../components/admin/SideBar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
