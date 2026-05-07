import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardThunk } from "../store/dashboardSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardThunk());
  }, [dispatch]);

  const totals = stats?.totals;

  return (
    <section>
      <h2 className="text-xl font-semibold">Dashboard</h2>
      {loading && <p className="mt-3 text-slate-600">Loading dashboard...</p>}
      {error && <p className="mt-3 text-rose-600">{error}</p>}
      {totals && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(totals).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm capitalize text-slate-500">{key}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
