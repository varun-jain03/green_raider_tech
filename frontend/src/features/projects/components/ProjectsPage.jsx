import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProjectThunk, fetchProjectsThunk } from "../store/projectsSlice";

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.projects);
  const role = useSelector((state) => state.auth.user?.role);
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    dispatch(fetchProjectsThunk());
  }, [dispatch]);

  const handleCreate = (event) => {
    event.preventDefault();
    dispatch(createProjectThunk(form));
    setForm({ name: "", description: "" });
  };

  return (
    <section>
      <h2 className="text-xl font-semibold">Projects</h2>
      {role === "admin" && (
        <form className="mt-4 grid gap-2 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2" onSubmit={handleCreate}>
          <input className="rounded-md border border-slate-300 px-3 py-2" placeholder="Project name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          <input className="rounded-md border border-slate-300 px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <button className="rounded-md bg-indigo-600 px-3 py-2 text-white sm:col-span-2">Create project</button>
        </form>
      )}
      {loading && <p className="mt-4 text-slate-600">Loading projects...</p>}
      {error && <p className="mt-4 text-rose-600">{error}</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((project) => (
          <article key={project._id} className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{project.description || "No description"}</p>
            <p className="mt-2 text-xs text-slate-500">Members: {project.members?.length || 0}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
