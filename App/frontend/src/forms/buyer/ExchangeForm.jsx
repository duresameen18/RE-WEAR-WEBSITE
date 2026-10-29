import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ImageUpload from "../../components/ImageUpload.jsx";

const exchangeSchema = z.object({
  offeredItem: z.string().trim().min(2, "Enter at least 2 characters.").max(100, "Item name must be at most 100 characters."),
  image: z.any().refine((files) => files && files.length > 0, "Choose a photo of your item."),
  requestedItem: z.string().trim().min(2, "Enter at least 2 characters.").max(100, "Item name must be at most 100 characters."),
  size: z.enum(["Small", "Medium", "Large", "XL"], { error: "Select a size." }),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(1000, "Description must be at most 1000 characters."),
});

function ExchangeForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(exchangeSchema) });
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

        <form data-form-type="exchange" encType="multipart/form-data" noValidate onSubmit={onSubmit}>
          <h1>Exchange / Swap</h1>

          <label htmlFor="exchange-offered-item">Your Item</label>
          <input id="exchange-offered-item" type="text" minLength="2" maxLength="100" pattern=".*\S.*" title="Enter an item name with at least 2 non-space characters." placeholder="Enter your item" required {...register("offeredItem")} />
          {errors.offeredItem && <span className="form-field-error" role="alert">{errors.offeredItem.message}</span>}

          <ImageUpload label="Photo of Your Item" required registration={register("image")} validationError={errors.image?.message} />

          <label htmlFor="exchange-requested-item">Item You Want</label>
          <input id="exchange-requested-item" type="text" minLength="2" maxLength="100" pattern=".*\S.*" title="Enter an item name with at least 2 non-space characters." placeholder="Enter desired item" required {...register("requestedItem")} />
          {errors.requestedItem && <span className="form-field-error" role="alert">{errors.requestedItem.message}</span>}

          <label htmlFor="exchange-size">Size</label>
          <select id="exchange-size" defaultValue="" required {...register("size")}>
            <option value="" disabled>Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>
          {errors.size && <span className="form-field-error" role="alert">{errors.size.message}</span>}

          <label htmlFor="exchange-description">Description</label>
          <textarea id="exchange-description" minLength="10" maxLength="1000" title="Enter a description with at least 10 characters." placeholder="Describe your item" required {...register("description")}></textarea>
          {errors.description && <span className="form-field-error" role="alert">{errors.description.message}</span>}

          <button type="submit">Submit Exchange</button>
        </form>

      </div>
    </div>
  );
}

export default ExchangeForm;