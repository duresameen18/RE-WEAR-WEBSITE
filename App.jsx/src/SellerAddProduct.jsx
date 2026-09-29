jsx
import "./../styles/SellerAddProduct.css";

function SellerAddProduct() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Product added successfully!");
  };

  return (
    <div className="form-card seller-add-product">
      <h3>Add Product</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          required
        />

        <input
          type="number"
          placeholder="Price"
          required
        />

        <input
          type="text"
          placeholder="Category"
          required
        />

        <input
          type="text"
          placeholder="Product Condition"
          required
        />

        <textarea
          placeholder="Product Description"
          required
        ></textarea>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default SellerAddProduct;