import NavBar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default UserLayout;
