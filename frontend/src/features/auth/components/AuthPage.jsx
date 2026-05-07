// Dependencies
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// File import
import { clearAuthError, loginThunk, registerThunk } from "../store/authSlice";

const defaultSignup = { name: "", email: "", password: "", role: "member" };
const defaultLogin = { email: "", password: "" };

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(defaultLogin);
  const [signupForm, setSignupForm] = useState(defaultSignup);
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);

  if (token) return <Navigate to="/" replace />;

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(loginThunk(loginForm));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    const result = await dispatch(registerThunk(signupForm));
    if (!result.error) {
      setMode("login");
      setLoginForm({ email: signupForm.email, password: "" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-xl sm:p-8">
        <h1 className="text-2xl font-semibold">Team Task Manager</h1>
        <p className="mt-2 text-sm text-slate-300">Login or create an account to continue.</p>

        <div className="mt-6 flex gap-2 rounded-lg bg-slate-700 p-1">
          <button className={`w-1/2 rounded-md px-3 py-2 text-sm ${mode === "login" ? "bg-slate-900" : ""}`} onClick={() => {setMode("login"); dispatch(clearAuthError());}}>
            Login
          </button>
          <button className={`w-1/2 rounded-md px-3 py-2 text-sm ${mode === "signup" ? "bg-slate-900" : ""}`} onClick={() => {setMode("signup"); dispatch(clearAuthError());}}>
            Signup
          </button>
        </div>

        {error && <p className="mt-4 rounded-md bg-rose-500/20 p-2 text-sm text-rose-300">{error}</p>}

        {mode === "login" ? (
          <form className="mt-5 space-y-3" onSubmit={handleLogin}>
            <input className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Email" type="email" value={loginForm.email} onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))} required />
            <input className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Password" type="password" value={loginForm.password} onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))} required />
            <button className="w-full rounded-md bg-indigo-500 px-3 py-2 font-medium text-white" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="mt-5 space-y-3" onSubmit={handleSignup}>
            <input className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Name" value={signupForm.name} onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <input className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Email" type="email" value={signupForm.email} onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))} required />
            <input className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Password (min 6 chars)" type="password" value={signupForm.password} onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))} required />
            <select className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2" value={signupForm.role} onChange={(e) => setSignupForm((prev) => ({ ...prev, role: e.target.value }))}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button className="w-full rounded-md bg-emerald-500 px-3 py-2 font-medium text-white" disabled={loading}>
              {loading ? "Please wait..." : "Create account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}