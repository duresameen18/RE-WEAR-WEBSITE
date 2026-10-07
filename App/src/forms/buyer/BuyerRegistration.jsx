function BuyerRegistration() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form>
          <h1>Buyer Registration</h1>

          <label>Full Name</label>
          <input type="text" placeholder="Enter your name" />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password</label>
          <input type="password" placeholder="Create password" />

          <label>Phone</label>
          <input type="text" placeholder="Enter phone number" />

          <button type="submit">Register</button>
        </form>

      </div>
    </div>
  );
}

export default BuyerRegistration;