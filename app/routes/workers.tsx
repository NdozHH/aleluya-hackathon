import { Outlet } from "@remix-run/react";

export default function Workers() {
  return (
    <div className="h-full">
      <h3>Workers route</h3>
      <Outlet />
    </div>
  );
}
