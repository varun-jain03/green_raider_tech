import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/store/authSlice";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" },
];

export default function AppShell() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="font-semibold">Team Task Manager</p>
          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `rounded-md px-3 py-1.5 text-sm ${isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}>
                {item.label}
              </NavLink>
            ))}
            <button onClick={() => dispatch(logout())} className="rounded-md bg-rose-500 px-3 py-1.5 text-sm text-white">Logout</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5">
        <p className="mb-4 text-sm text-slate-600">Logged in as {user?.name} ({user?.role})</p>
        <Outlet />
      </main>
    </div>
  );
}
