jsx
import "./../styles/BuyerLogin.css";

function BuyerLogin() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Buyer Login submitted successfully!");
  };

  return (
    <div className="form-card buyer-login">
      <h3>Buyer Login</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
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

export default BuyerLogin;