import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext.jsx";
import { dashboardPathForRole } from "../routes/roleRedirect.js";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => location.state?.from?.pathname, [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    const res = login({ email, password });
    if (!res.ok) {
      setError(res.message);
      return;
    }
    const stored = JSON.parse(localStorage.getItem("das_auth_user_v1"));
    navigate(from || dashboardPathForRole(stored?.role), { replace: true });
  }

  return (
    <div className="container-app py-10 pt-20">
      <div className="mx-auto max-w-md">
        <div className="card card-pad">
          <h2 className="text-xl font-semibold text-slate-900">Login</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use demo accounts from Home page or your registered role.
          </p>

          {error ? (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@demo.com"
                type="email"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                type="password"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-brand-700">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

