jsx
import "./../styles/BuyerExchange.css";

function BuyerExchange() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Exchange / Swap request submitted successfully!");
  };

  return (
    <div className="form-card buyer-exchange">
      <h3>Exchange / Swap</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Item"
          required
        />

        <input
          type="text"
          placeholder="Item You Want"
          required
        />

        <input
          type="text"
          placeholder="Condition of Your Item"
          required
        />

        <textarea
          placeholder="Exchange Details"
          required
        ></textarea>

        <button type="submit">Submit Swap Request</button>
      </form>
    </div>
  );
}

export default BuyerExchange;
