import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <nav>Navbar</nav>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
