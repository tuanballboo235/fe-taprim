// src/layouts/UserLayout.jsx
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";
import TickerNotice from "../components/common/TickerNotice.jsx";
import { Footer } from "../components/common/Footer.jsx";
function UserLayout() {
  return (
    <>
      <Header />
      <TickerNotice />
      <Outlet />
      <Footer />
    </>
  );
}

export default UserLayout;
