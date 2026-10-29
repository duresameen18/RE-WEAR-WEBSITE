import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUpload from "../../components/ImageUpload.jsx";

const addProductSchema = z.object({
  name: z.string().trim().min(2, "Enter at least 2 characters.").max(100, "Product name must be at most 100 characters."),
  category: z.string().min(1, "Select a category."),
  price: z.coerce.number().int("Enter a whole number.").min(1, "Price must be greater than zero."),
  image: z.any().refine((files) => files && files.length > 0, "Choose a product image."),
  size: z.enum(["Small", "Medium", "Large", "XL"], { error: "Select a size." }),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(1000, "Description must be at most 1000 characters."),
});

function AddProduct({ categories = ["Western Formal", "Eastern Formal"] }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addProductSchema) });
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

        <form data-form-type="add-product" encType="multipart/form-data" noValidate onSubmit={onSubmit}>
          <h1>Add Product</h1>

          <label htmlFor="new-product-name">Product Name</label>
          <input id="new-product-name" type="text" minLength="2" maxLength="100" pattern=".*\S.*" title="Enter a product name with at least 2 non-space characters." placeholder="Enter product name" required {...register("name")} />
          {errors.name && <span className="form-field-error" role="alert">{errors.name.message}</span>}

          <label htmlFor="new-product-category">Category</label>
          <select id="new-product-category" defaultValue="" required {...register("category")}>
            <option value="" disabled>Select Category</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          {errors.category && <span className="form-field-error" role="alert">{errors.category.message}</span>}

          <label htmlFor="new-product-price">Price</label>
          <input id="new-product-price" type="number" min="1" step="1" placeholder="Enter price" required {...register("price")} />
          {errors.price && <span className="form-field-error" role="alert">{errors.price.message}</span>}

          <ImageUpload label="Product Image" required registration={register("image")} validationError={errors.image?.message} />

          <label htmlFor="new-product-size">Size</label>
          <select id="new-product-size" defaultValue="" required {...register("size")}>
            <option value="" disabled>Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>
          {errors.size && <span className="form-field-error" role="alert">{errors.size.message}</span>}

          <label htmlFor="new-product-description">Description</label>
          <textarea id="new-product-description" minLength="10" maxLength="1000" title="Enter a description with at least 10 characters." placeholder="Describe product" required {...register("description")}></textarea>
          {errors.description && <span className="form-field-error" role="alert">{errors.description.message}</span>}

          <button type="submit">Add Product</button>
        </form>

      </div>
    </div>
  );
}

export default AddProduct;