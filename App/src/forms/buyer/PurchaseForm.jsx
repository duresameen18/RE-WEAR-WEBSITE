function PurchaseForm() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form>
          <h1>Purchase Item</h1>

          <label>Product Name</label>
          <input type="text" placeholder="Enter product name" />

          <label>Size</label>
          <select>
            <option>Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>

          <label>Quantity</label>
          <input type="number" placeholder="Enter quantity" />

          <label>Delivery Address</label>
          <textarea placeholder="Enter delivery address"></textarea>

          <label>Phone</label>
          <input type="text" placeholder="Enter phone number" />

          <button type="submit">Place Order</button>
        </form>

      </div>
    </div>
  );
}

export default PurchaseForm;