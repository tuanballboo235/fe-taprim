// src/layouts/UserLayout.jsx
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";
import TickerNotice from "../components/common/TickerNotice.jsx";
function UserLayout() {
  return (
    <>     
      <Header /> 
      <TickerNotice />
      <Outlet />
    </>
  );
}

export default UserLayout;
