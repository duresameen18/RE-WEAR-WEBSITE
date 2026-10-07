import ImageUpload from "../../components/ImageUpload.jsx";

function ExchangeForm() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form encType="multipart/form-data">
          <h1>Exchange / Swap</h1>

          <label>Your Item</label>
          <input type="text" placeholder="Enter your item" />

          <ImageUpload label="Photo of Your Item" required />

          <label>Item You Want</label>
          <input type="text" placeholder="Enter desired item" />

          <label>Size</label>
          <select>
            <option>Select Size</option>
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
            <option>XL</option>
          </select>

          <label>Description</label>
          <textarea placeholder="Describe your item"></textarea>

          <button type="submit">Submit Exchange</button>
        </form>

      </div>
    </div>
  );
}

export default ExchangeForm;