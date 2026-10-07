function SellerRegistration() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form>
          <h1>Seller Registration</h1>

          <label>Full Name</label>
          <input type="text" placeholder="Enter your name" />

          <label>Email</label>
          <input type="email" placeholder="Enter email" />

          <label>Phone</label>
          <input type="text" placeholder="Enter phone number" />

          <label>Shop Name</label>
          <input type="text" placeholder="Enter shop name" />

          <label>Password</label>
          <input type="password" placeholder="Create password" />

          <button type="submit">Register as Seller</button>
        </form>

      </div>
    </div>
  );
}

export default SellerRegistration;