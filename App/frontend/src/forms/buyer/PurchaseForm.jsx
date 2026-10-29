import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const phonePattern = /^\+?(?:[0-9][\s().-]*){7,15}$/;
const purchaseSchema = z.object({
  productId: z.string().min(1, "Select a product."),
  size: z.enum(["Small", "Medium", "Large", "XL"], { error: "Select a size." }),
  quantity: z.coerce.number().int("Enter a whole number.").min(1, "Quantity must be at least one."),
  address: z.string().trim().min(10, "Address must be at least 10 characters.").max(300, "Address must be at most 300 characters."),
  phone: z.string().regex(phonePattern, "Enter a valid phone number with 7 to 15 digits."),
});

function PurchaseForm({ products = [] }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(purchaseSchema) });
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

        <form data-form-type="purchase" noValidate onSubmit={onSubmit}>
          <h1>Purchase Item</h1>

          <label htmlFor="purchase-product">Product Name</label>
          <select id="purchase-product" defaultValue="" required {...register("productId")}>
            <option value="" disabled>Select a product</option>
            {products.filter((product) => product.status !== "hidden" && product.status !== "removed" && product.status !== "draft").map((product) => (
              <option key={product.id} value={product.id}>{product.name} — Rs. {Number(product.price).toLocaleString()}</option>
            ))}
          </select>
          {errors.productId && <span className="form-field-error" role="alert">{errors.productId.message}</span>}

          <label htmlFor="purchase-size">Size</label>
          <select id="purchase-size" defaultValue="" required {...register("size")}>
            <option value="" disabled>Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>
          {errors.size && <span className="form-field-error" role="alert">{errors.size.message}</span>}

          <label htmlFor="purchase-quantity">Quantity</label>
          <input id="purchase-quantity" type="number" min="1" step="1" placeholder="Enter quantity" required {...register("quantity")} />
          {errors.quantity && <span className="form-field-error" role="alert">{errors.quantity.message}</span>}

          <label htmlFor="purchase-address">Delivery Address</label>
          <textarea id="purchase-address" autoComplete="street-address" minLength="10" maxLength="300" title="Enter a delivery address with at least 10 characters." placeholder="Enter delivery address" required {...register("address")}></textarea>
          {errors.address && <span className="form-field-error" role="alert">{errors.address.message}</span>}

          <label htmlFor="purchase-phone">Phone</label>
          <input id="purchase-phone" type="tel" autoComplete="tel" pattern="\+?(?:[0-9][\s().-]*){7,15}" maxLength="25" title="Enter a valid phone number with 7 to 15 digits." placeholder="Enter phone number" required {...register("phone")} />
          {errors.phone && <span className="form-field-error" role="alert">{errors.phone.message}</span>}

          <button type="submit">Place Order</button>
        </form>

      </div>
    </div>
  );
}

export default PurchaseForm;