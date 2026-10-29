import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import "../App.css";

// Shared buyer/seller sign-up and login page, with a separate admin-only login mode.
export default function AuthPage({ admin = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  // Submit credentials to the auth context and redirect to the account's dashboard.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const values = new FormData(event.currentTarget);

    try {
      const account = mode === "signup"
        ? await signUp({
            name: values.get("name"),
            email: values.get("email"),
            password: values.get("password"),
            role,
          })
        : await login({
            email: values.get("email"),
            password: values.get("password"),
            role: admin ? "admin" : undefined,
          });
      navigate(`/${account.role}/dashboard`, { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Could not sign you in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <Link className="logo auth-logo" to="/">RE-WEAR</Link>
      <section className="auth-card">
        <p className="small-title">{admin ? "ADMIN PORTAL" : "MEMBER PORTAL"}</p>
        <h1>{admin ? "Admin Login" : mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <p className="auth-description">
          {admin
            ? "Sign in to manage RE-WEAR users, listings, orders, and complaints."
            : "Use one account to shop as a buyer or manage your seller listings."}
        </p>

        {/* Buyer and seller accounts share the same login/sign-up form. */}
        {!admin && (
          <div className="auth-tabs" aria-label="Account action">
            <button
              className={mode === "login" ? "active" : ""}
              type="button"
              onClick={() => { setSearchParams({ mode: "login" }); setError(""); }}
            >
              Log in
            </button>
            <button
              className={mode === "signup" ? "active" : ""}
              type="button"
              onClick={() => { setSearchParams({ mode: "signup" }); setError(""); }}
            >
              Sign up
            </button>
          </div>
        )}

        {/* Display the local-only demo admin credential and its security limitation. */}
        {admin && (
          <p className="demo-admin-note">
            Local demo admin: <strong>admin@rewear.local</strong> / <strong>RewearAdmin!2026</strong>
            <br />
            This demo credential is not secure for a deployed website.
          </p>
        )}

        {/* Collect account details and display login/signup errors accessibly. */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && !admin && (
            <>
              <label htmlFor="auth-name">Full name</label>
              <input id="auth-name" name="name" autoComplete="name" required />
              <label htmlFor="auth-role">Account type</label>
              <select id="auth-role" value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </>
          )}
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            minLength={mode === "signup" ? 8 : undefined}
            required
          />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : admin ? "Sign in as Admin" : mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
        {!admin && (
          <p className="auth-switch">
            Admin? <Link to="/admin/login">Open the separate admin login</Link>
          </p>
        )}
      </section>
    </main>
  );
}
