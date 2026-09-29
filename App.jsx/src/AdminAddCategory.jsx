jsx
import "./../styles/AdminAddCategory.css";

function AdminAddCategory() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Category added successfully!");
  };

  return (
    <div className="form-card admin-add-category">
      <h3>Add Category</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Name"
          required
        />

        <textarea
          placeholder="Category Description"
          required
        ></textarea>

        <button type="submit">Add Category</button>
      </form>
    </div>
  );
}

export default AdminAddCategory;