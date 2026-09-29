jsx
import "./../styles/AdminManageUser.css";

function AdminManageUser() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("User management action submitted successfully!");
  };

  return (
    <div className="form-card admin-manage-user">
      <h3>Manage User</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          required
        />

        <input
          type="text"
          placeholder="User Name"
          required
        />

        <select required>
          <option value="">Select Action</option>
          <option>View User</option>
          <option>Update User</option>
          <option>Block User</option>
          <option>Delete User</option>
        </select>

        <button type="submit">Manage User</button>
      </form>
    </div>
  );
}

export default AdminManageUser;