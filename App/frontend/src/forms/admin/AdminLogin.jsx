import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(adminLoginSchema) });
  const onSubmit = (event) => {
    event.stopPropagation();
    void handleSubmit((_data, submitEvent) => {
      submitEvent?.target.dispatchEvent(new Event("validatedsubmit", { bubbles: true, cancelable: true }));
    })(event);
  };

  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <p className="demo-admin-note">
          Local demo: <strong>admin@rewear.local</strong> / <strong>RewearAdmin!2026</strong>.
          This credential is not secure for a deployed website.
        </p>

        <form data-form-type="admin-login" noValidate onSubmit={onSubmit}>
          <h1>Admin Login</h1>

          <label htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" autoComplete="username" placeholder="Enter email" required {...register("email")} />
          {errors.email && <span className="form-field-error" role="alert">{errors.email.message}</span>}

          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" autoComplete="current-password" placeholder="Enter password" required {...register("password")} />
          {errors.password && <span className="form-field-error" role="alert">{errors.password.message}</span>}

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}

export default AdminLogin;