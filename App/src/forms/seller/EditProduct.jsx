import ImageUpload from "../../components/ImageUpload.jsx";

function EditProduct() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form encType="multipart/form-data">
          <h1>Edit Product</h1>

          <label>Product Name</label>
          <input type="text" placeholder="Enter product name" />

          <label>New Price</label>
          <input type="number" placeholder="Enter new price" />

          <ImageUpload label="Replace Product Image (optional)" />

          <label>New Size</label>
          <select>
            <option>Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>

          <label>New Description</label>
          <textarea placeholder="Update description"></textarea>

          <button type="submit">Update Product</button>
        </form>

      </div>
    </div>
  );
}

export default EditProduct;