function ManageProduct() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form>
          <h1>Manage Product</h1>

          <label>Select Product</label>
          <select>
            <option>Select Product</option>
            <option>Black Formal Blazer</option>
            <option>Evening Dress</option>
            <option>White Shirt</option>
          </select>

          <label>Action</label>
          <select>
            <option>Select Action</option>
            <option>Approve Product</option>
            <option>Hide Product</option>
            <option>Delete Product</option>
          </select>

          <label>Reason</label>
          <textarea placeholder="Enter reason"></textarea>

          <button type="submit">Apply Action</button>
        </form>

      </div>
    </div>
  );
}

export default ManageProduct;