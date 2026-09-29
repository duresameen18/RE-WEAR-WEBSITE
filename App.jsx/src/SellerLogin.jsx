jsx
import "./../styles/SellerLogin.css";

function SellerLogin() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Seller Login submitted successfully!");
  };

  return (
    <div className="form-card seller-login">
      <h3>Seller Login</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Seller Email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default SellerLogin;