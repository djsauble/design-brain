import { Outlet, NavLink } from "react-router";

export function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Product Discovery</h1>
        </div>
        <nav className="mt-4">
          <NavLink to="/problems" className="block p-4 text-gray-700 hover:bg-gray-200">
            Problems
          </NavLink>
        </nav>
      </div>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
