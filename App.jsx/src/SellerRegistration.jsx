jsx
import "./../styles/SellerRegistration.css";

function SellerRegistration() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Seller Registration submitted successfully!");
  };

  return (
    <div className="form-card seller-registration">
      <h3>Seller Registration</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Seller Name"
          required
        />

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

        <input
          type="tel"
          placeholder="Phone Number"
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default SellerRegistration;