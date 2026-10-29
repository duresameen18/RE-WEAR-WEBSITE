import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUpload from "../../components/ImageUpload.jsx";

const editProductSchema = z.object({
  productId: z.string().min(1, "Select a product."),
  price: z.coerce.number().int("Enter a whole number.").min(1, "Price must be greater than zero."),
  image: z.any(),
  size: z.enum(["Small", "Medium", "Large", "XL"], { error: "Select a size." }),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(1000, "Description must be at most 1000 characters."),
});

function EditProduct({ products = [] }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(editProductSchema) });
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

        <form data-form-type="edit-product" encType="multipart/form-data" noValidate onSubmit={onSubmit}>
          <h1>Edit Product</h1>

          <label htmlFor="edit-product-id">Product</label>
          <select id="edit-product-id" defaultValue="" required {...register("productId")}>
            <option value="" disabled>Select a product</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
          {errors.productId && <span className="form-field-error" role="alert">{errors.productId.message}</span>}

          <label htmlFor="edit-product-price">New Price</label>
          <input id="edit-product-price" type="number" min="1" step="1" placeholder="Enter new price" required {...register("price")} />
          {errors.price && <span className="form-field-error" role="alert">{errors.price.message}</span>}

          <ImageUpload label="Replace Product Image (optional)" registration={register("image")} />

          <label htmlFor="edit-product-size">New Size</label>
          <select id="edit-product-size" defaultValue="" required {...register("size")}>
            <option value="" disabled>Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>
          {errors.size && <span className="form-field-error" role="alert">{errors.size.message}</span>}

          <label htmlFor="edit-product-description">New Description</label>
          <textarea id="edit-product-description" minLength="10" maxLength="1000" title="Enter a description with at least 10 characters." placeholder="Update description" required {...register("description")}></textarea>
          {errors.description && <span className="form-field-error" role="alert">{errors.description.message}</span>}

          <button type="submit">Update Product</button>
        </form>

      </div>
    </div>
  );
}

export default EditProduct;