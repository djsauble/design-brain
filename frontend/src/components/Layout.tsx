import { Outlet, NavLink, useLocation, Link } from "react-router-dom";
import React from 'react';

export function Layout() {
  const location = useLocation();
  const pathnames: string[] = location.pathname.split('/').filter((x: string) => x);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <nav className="p-4">
          <Link to="/" className="text-gray-700 hover:underline">
            Design Brain
          </Link>
          {pathnames.map((name: string, index: number) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <React.Fragment key={name}>
                <span className="mx-2">/</span>
                {isLast ? (
                  <span className="text-gray-500">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                ) : (
                  <Link to={routeTo} className="text-gray-700 hover:underline">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
