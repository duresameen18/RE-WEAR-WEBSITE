jsx
import "./../styles/AdminLogin.css";

function AdminLogin() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Admin Login submitted successfully!");
  };

  return (
    <div className="form-card admin-login">
      <h3>Admin Login</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          required
        />

        <input
          type="password"
          placeholder="Admin Password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;