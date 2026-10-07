function AddCategory() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form>
          <h1>Add Category</h1>

          <label>Category Name</label>
          <input type="text" placeholder="Enter category name" />

          <label>Description</label>
          <textarea placeholder="Enter category description"></textarea>

          <button type="submit">Add Category</button>
        </form>

      </div>
    </div>
  );
}

export default AddCategory;