jsx
import "./../styles/SellerEditProduct.css";

function SellerEditProduct() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Product updated successfully!");
  };

  return (
    <div className="form-card seller-edit-product">
      <h3>Edit Product</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product ID"
          required
        />

        <input
          type="text"
          placeholder="New Product Name"
          required
        />

        <input
          type="number"
          placeholder="New Price"
          required
        />

        <input
          type="text"
          placeholder="New Condition"
          required
        />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default SellerEditProduct;