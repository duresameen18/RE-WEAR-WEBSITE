import ImageUpload from "../../components/ImageUpload.jsx";

function AddProduct() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form encType="multipart/form-data">
          <h1>Add Product</h1>

          <label>Product Name</label>
          <input type="text" placeholder="Enter product name" />

          <label>Category</label>
          <select>
            <option>Select Category</option>
            <option>Western</option>
            <option>Eastern</option>
            <option>Formal</option>
          </select>

          <label>Price</label>
          <input type="number" placeholder="Enter price" />

          <ImageUpload label="Product Image" required />

          <label>Size</label>
          <select>
            <option>Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>

          <label>Description</label>
          <textarea placeholder="Describe product"></textarea>

          <button type="submit">Add Product</button>
        </form>

      </div>
    </div>
  );
}

export default AddProduct;