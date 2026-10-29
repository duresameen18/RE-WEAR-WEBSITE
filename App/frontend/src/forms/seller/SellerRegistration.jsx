import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const phonePattern = /^\+?(?:[0-9][\s().-]*){7,15}$/;
const sellerRegistrationSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters.").max(80, "Name must be at most 80 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().regex(phonePattern, "Enter a valid phone number with 7 to 15 digits."),
  shopName: z.string().trim().min(2, "Enter at least 2 characters.").max(100, "Shop name must be at most 100 characters."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128, "Password must be at most 128 characters."),
});

function SellerRegistration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(sellerRegistrationSchema) });
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

        <form data-form-type="seller-registration" noValidate onSubmit={onSubmit}>
          <h1>Seller Registration</h1>

          <label htmlFor="seller-name">Full Name</label>
          <input id="seller-name" type="text" autoComplete="name" minLength="2" maxLength="80" pattern=".*\S.*" title="Enter a name with at least 2 non-space characters." placeholder="Enter your name" required {...register("name")} />
          {errors.name && <span className="form-field-error" role="alert">{errors.name.message}</span>}

          <label htmlFor="seller-email">Email</label>
          <input id="seller-email" type="email" autoComplete="email" placeholder="Enter email" required {...register("email")} />
          {errors.email && <span className="form-field-error" role="alert">{errors.email.message}</span>}

          <label htmlFor="seller-phone">Phone</label>
          <input id="seller-phone" type="tel" autoComplete="tel" pattern="\+?(?:[0-9][\s().-]*){7,15}" maxLength="25" title="Enter a valid phone number with 7 to 15 digits." placeholder="Enter phone number" required {...register("phone")} />
          {errors.phone && <span className="form-field-error" role="alert">{errors.phone.message}</span>}

          <label htmlFor="seller-shop">Shop Name</label>
          <input id="seller-shop" type="text" minLength="2" maxLength="100" pattern=".*\S.*" title="Enter a shop name with at least 2 non-space characters." placeholder="Enter shop name" required {...register("shopName")} />
          {errors.shopName && <span className="form-field-error" role="alert">{errors.shopName.message}</span>}

          <label htmlFor="seller-password">Password</label>
          <input id="seller-password" type="password" autoComplete="new-password" minLength="8" maxLength="128" placeholder="Create password" required {...register("password")} />
          {errors.password && <span className="form-field-error" role="alert">{errors.password.message}</span>}

          <button type="submit">Register as Seller</button>
        </form>

      </div>
    </div>
  );
}

export default SellerRegistration;