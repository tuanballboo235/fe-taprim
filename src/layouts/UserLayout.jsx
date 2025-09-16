// src/layouts/UserLayout.jsx
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";
import TickerNotice from "../components/common/TickerNotice.jsx";
import { Footer } from "../components/common/Footer.jsx";
import SupportButton from "../components/common/SupportButton.jsx";

function UserLayout() {
  return (
    <>
      <Header />
      <TickerNotice />
      <Outlet />
      <Footer />
      <SupportButton />
    </>
  );
}

export default UserLayout;
