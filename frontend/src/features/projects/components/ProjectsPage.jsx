import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProjectMemberThunk,
  createProjectThunk,
  fetchProjectsThunk,
  removeProjectMemberThunk,
} from "../store/projectsSlice";
import { fetchUsersThunk } from "../../users/store/usersSlice";

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.projects);
  const role = useSelector((state) => state.auth.user?.role);
  const users = useSelector((state) => state.users.items);
  const [form, setForm] = useState({ name: "", description: "" });
  const [memberSelections, setMemberSelections] = useState({});

  useEffect(() => {
    dispatch(fetchProjectsThunk());
    if (role === "admin") {
      dispatch(fetchUsersThunk());
    }
  }, [dispatch, role]);

  const handleCreate = (event) => {
    event.preventDefault();
    dispatch(createProjectThunk(form));
    setForm({ name: "", description: "" });
  };

  const getMemberId = (member) => {
    if (!member) return "";
    return typeof member === "string" ? member : member._id;
  };

  const getMemberName = (member) => {
    if (!member) return "Unknown";
    if (typeof member === "string") return member;
    return member.name || member.email || member._id;
  };

  const handleAddMember = (projectId) => {
    const userId = memberSelections[projectId];
    if (!userId) return;
    dispatch(addProjectMemberThunk({ projectId, userId }));
    setMemberSelections((prev) => ({ ...prev, [projectId]: "" }));
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
            <div className="mt-3 space-y-2">
              {(project.members || []).map((member) => {
                const memberId = getMemberId(member);
                return (
                  <div key={memberId} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-2 py-1.5">
                    <p className="text-sm text-slate-700">{getMemberName(member)}</p>
                    {role === "admin" && (
                      <button
                        onClick={() =>
                          dispatch(removeProjectMemberThunk({ projectId: project._id, userId: memberId }))
                        }
                        className="rounded-md bg-rose-100 px-2 py-1 text-xs text-rose-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {role === "admin" && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <select
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={memberSelections[project._id] || ""}
                  onChange={(e) =>
                    setMemberSelections((prev) => ({
                      ...prev,
                      [project._id]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select user to add</option>
                  {users
                    .filter((user) => !(project.members || []).some((member) => getMemberId(member) === user._id))
                    .map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => handleAddMember(project._id)}
                  className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white"
                >
                  Add Member
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
