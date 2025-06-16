import { Outlet, NavLink } from "react-router";

export function Layout() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <nav>
          <NavLink to="/problems" className="block p-4 text-gray-700 hover:bg-gray-200">
            Design Brain
          </NavLink>
        </nav>
      </div>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
