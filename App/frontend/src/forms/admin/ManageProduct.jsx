import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const manageProductSchema = z.object({
  productId: z.string().min(1, "Select a product."),
  action: z.enum(["approve", "hide", "delete"], { error: "Select an action." }),
  reason: z.string().max(500, "Reason must be at most 500 characters."),
});

function ManageProduct({ products = [] }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(manageProductSchema) });
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

        <form data-form-type="manage-product" noValidate onSubmit={onSubmit}>
          <h1>Manage Product</h1>

          <label htmlFor="managed-product">Select Product</label>
          <select id="managed-product" defaultValue="" required {...register("productId")}>
            <option value="" disabled>Select Product</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
          {errors.productId && <span className="form-field-error" role="alert">{errors.productId.message}</span>}

          <label htmlFor="product-action">Action</label>
          <select id="product-action" defaultValue="" required {...register("action")}>
            <option value="" disabled>Select Action</option>
            <option value="approve">Approve Product</option>
            <option value="hide">Hide Product</option>
            <option value="delete">Delete Product</option>
          </select>
          {errors.action && <span className="form-field-error" role="alert">{errors.action.message}</span>}

          <label htmlFor="product-reason">Reason</label>
          <textarea id="product-reason" maxLength="500" placeholder="Enter reason" {...register("reason")}></textarea>
          {errors.reason && <span className="form-field-error" role="alert">{errors.reason.message}</span>}

          <button type="submit">Apply Action</button>
        </form>

      </div>
    </div>
  );
}

export default ManageProduct;