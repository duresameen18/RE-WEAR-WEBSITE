jsx
import "./../styles/BuyerPurchase.css";

function BuyerPurchase() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Purchase form submitted successfully!");
  };

  return (
    <div className="form-card buyer-purchase">
      <h3>Purchase</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          required
        />

        <input
          type="text"
          placeholder="Delivery Address"
          required
        />

        <select required>
          <option value="">Select Payment Method</option>
          <option>Cash on Delivery</option>
          <option>Bank Transfer</option>
          <option>Online Payment</option>
        </select>

        <button type="submit">Purchase</button>
      </form>
    </div>
  );
}

export default BuyerPurchase;