// src/layouts/UserLayout.jsx
import Header from "@/shared/components/Header";
import { Outlet } from "react-router-dom";
import TickerNotice from "@/shared/components/TickerNotice";
import { Footer } from "@/shared/components/Footer";
import SupportButton from "@/shared/components/SupportButton";

function UserLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <TickerNotice />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SupportButton />
    </div>
  );
}

export default UserLayout;
