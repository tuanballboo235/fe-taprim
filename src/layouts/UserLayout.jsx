// src/layouts/UserLayout.jsx
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default UserLayout;
