jsx
import "./../styles/BuyerRegistration.css";

function BuyerRegistration() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Buyer Registration submitted successfully!");
  };

  return (
    <div className="form-card buyer-registration">
      <h3>Buyer Registration</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
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

export default BuyerRegistration;