import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTaskThunk,
  fetchTasksThunk,
  updateTaskStatusThunk
} from '../store/tasksSlice';
import { fetchProjectsThunk } from '../../projects/store/projectsSlice';

const initialForm = {
  title: '',
  project: '',
  priority: 'medium',
  dueDate: '',
  assignee: ''
};

export default function TasksPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.tasks);
  const projects = useSelector((state) => state.projects.items);
  const role = useSelector((state) => state.auth.user?.role);
  const [form, setForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchTasksThunk());
    dispatch(fetchProjectsThunk());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    if (!statusFilter) return items;
    return items.filter((task) => task.status === statusFilter);
  }, [items, statusFilter]);

  // Build assignee options from the selected project's members.
  // Handles both populated objects ({_id, name, email}) and raw ID strings.
  const selectedProjectMembers = useMemo(() => {
    const selected = projects.find((p) => p._id === form.project);
    if (!selected || !Array.isArray(selected.members)) return [];
    return selected.members.map((m) =>
      typeof m === 'string'
        ? { _id: m, name: m, email: '' }
        : { _id: m._id, name: m.name || m._id, email: m.email || '' }
    );
  }, [projects, form.project]);

  const handleCreate = (event) => {
    event.preventDefault();
    const payload = { ...form, dueDate: form.dueDate || null };
    if (!payload.assignee) delete payload.assignee;
    dispatch(createTaskThunk(payload));
    setForm(initialForm);
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <select
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {role === 'admin' && (
        <form
          className="mt-4 grid gap-2 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2"
          onSubmit={handleCreate}
        >
          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="Task title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />

          <select
            className="rounded-md border border-slate-300 px-3 py-2"
            value={form.project}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                project: e.target.value,
                assignee: ''
              }))
            }
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border border-slate-300 px-3 py-2"
            value={form.priority}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, priority: e.target.value }))
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            className="rounded-md border border-slate-300 px-3 py-2"
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, dueDate: e.target.value }))
            }
          />

          <select
            className="rounded-md border border-slate-300 px-3 py-2 md:col-span-2 disabled:bg-slate-100 disabled:text-slate-400"
            value={form.assignee}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, assignee: e.target.value }))
            }
            disabled={!form.project}
          >
            <option value="">
              {!form.project
                ? 'Select a project first'
                : selectedProjectMembers.length === 0
                ? 'No members in this project'
                : 'Unassigned'}
            </option>
            {selectedProjectMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.email ? `${member.name} (${member.email})` : member.name}
              </option>
            ))}
          </select>

          <button className="rounded-md bg-indigo-600 px-3 py-2 text-white md:col-span-2">
            Create task
          </button>
        </form>
      )}

      {loading && <p className="mt-4 text-slate-600">Loading tasks...</p>}
      {error && <p className="mt-4 text-rose-600">{error}</p>}

      <div className="mt-4 space-y-3">
        {filteredTasks.map((task) => (
          <article
            key={task._id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{task.title}</h3>
              <select
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                value={task.status}
                onChange={(e) =>
                  dispatch(
                    updateTaskStatusThunk({
                      id: task._id,
                      status: e.target.value
                    })
                  )
                }
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Project: {task.project?.name}
            </p>
            <p className="text-sm text-slate-600">Priority: {task.priority}</p>
            <p className="text-sm text-slate-600">
              Assignee: {task.assignee?.name ?? 'Unassigned'}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}