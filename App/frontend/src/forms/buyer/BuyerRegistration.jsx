import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const phonePattern = /^\+?(?:[0-9][\s().-]*){7,15}$/;
const buyerRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters.").max(80, "Name must be at most 80 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128, "Password must be at most 128 characters."),
  phone: z.string().regex(phonePattern, "Enter a valid phone number with 7 to 15 digits."),
});

function BuyerRegistration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(buyerRegistrationSchema) });
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

        <form data-form-type="buyer-registration" noValidate onSubmit={onSubmit}>
          <h1>Buyer Registration</h1>

          <label htmlFor="buyer-name">Full Name</label>
          <input id="buyer-name" type="text" autoComplete="name" minLength="2" maxLength="80" pattern=".*\S.*" title="Enter a name with at least 2 non-space characters." placeholder="Enter your name" required {...register("name")} />
          {errors.name && <span className="form-field-error" role="alert">{errors.name.message}</span>}

          <label htmlFor="buyer-email">Email</label>
          <input id="buyer-email" type="email" autoComplete="email" placeholder="Enter your email" required {...register("email")} />
          {errors.email && <span className="form-field-error" role="alert">{errors.email.message}</span>}

          <label htmlFor="buyer-password">Password</label>
          <input id="buyer-password" type="password" autoComplete="new-password" minLength="8" maxLength="128" placeholder="Create password" required {...register("password")} />
          {errors.password && <span className="form-field-error" role="alert">{errors.password.message}</span>}

          <label htmlFor="buyer-phone">Phone</label>
          <input id="buyer-phone" type="tel" autoComplete="tel" pattern="\+?(?:[0-9][\s().-]*){7,15}" maxLength="25" title="Enter a valid phone number with 7 to 15 digits." placeholder="Enter phone number" required {...register("phone")} />
          {errors.phone && <span className="form-field-error" role="alert">{errors.phone.message}</span>}

          <button type="submit">Register</button>
        </form>

      </div>
    </div>
  );
}

export default BuyerRegistration;