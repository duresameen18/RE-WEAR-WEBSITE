import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const sellerLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

function SellerLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(sellerLoginSchema) });
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

        <form data-form-type="seller-login" noValidate onSubmit={onSubmit}>
          <h1>Seller Login</h1>

          <label htmlFor="seller-login-email">Email</label>
          <input id="seller-login-email" type="email" autoComplete="username" placeholder="Enter email" required {...register("email")} />
          {errors.email && <span className="form-field-error" role="alert">{errors.email.message}</span>}

          <label htmlFor="seller-login-password">Password</label>
          <input id="seller-login-password" type="password" autoComplete="current-password" placeholder="Enter password" required {...register("password")} />
          {errors.password && <span className="form-field-error" role="alert">{errors.password.message}</span>}

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}

export default SellerLogin;