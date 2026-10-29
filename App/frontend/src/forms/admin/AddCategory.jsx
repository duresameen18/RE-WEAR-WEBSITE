import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categorySchema = z.object({
  category: z.string().trim().min(2, "Enter at least 2 characters.").max(80, "Category name must be at most 80 characters."),
  description: z.string().max(500, "Description must be at most 500 characters."),
});

function AddCategory() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(categorySchema) });
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

        <form data-form-type="add-category" noValidate onSubmit={onSubmit}>
          <h1>Add Category</h1>

          <label htmlFor="category-name">Category Name</label>
          <input id="category-name" type="text" minLength="2" maxLength="80" pattern=".*\S.*" title="Enter a category name with at least 2 non-space characters." placeholder="Enter category name" required {...register("category")} />
          {errors.category && <span className="form-field-error" role="alert">{errors.category.message}</span>}

          <label htmlFor="category-description">Description</label>
          <textarea id="category-description" maxLength="500" placeholder="Enter category description" {...register("description")}></textarea>
          {errors.description && <span className="form-field-error" role="alert">{errors.description.message}</span>}

          <button type="submit">Add Category</button>
        </form>

      </div>
    </div>
  );
}

export default AddCategory;