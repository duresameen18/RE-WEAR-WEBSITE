function BuyerLogin() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form>
          <h1>Buyer Login</h1>

          <label>Email</label>
          <input type="email" placeholder="Enter email" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}

export default BuyerLogin;