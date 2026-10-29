import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const buyerLoginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

function BuyerLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(buyerLoginSchema) });
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

        <form data-form-type="buyer-login" noValidate onSubmit={onSubmit}>
          <h1>Buyer Login</h1>

          <label htmlFor="buyer-login-email">Email</label>
          <input id="buyer-login-email" type="email" autoComplete="username" placeholder="Enter email" required {...register("email")} />
          {errors.email && <span className="form-field-error" role="alert">{errors.email.message}</span>}

          <label htmlFor="buyer-login-password">Password</label>
          <input id="buyer-login-password" type="password" autoComplete="current-password" placeholder="Enter password" required {...register("password")} />
          {errors.password && <span className="form-field-error" role="alert">{errors.password.message}</span>}

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}

export default BuyerLogin;