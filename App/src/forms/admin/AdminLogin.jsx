function AdminLogin() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form>
          <h1>Admin Login</h1>

          <label>Username</label>
          <input type="text" placeholder="Enter username" />

          <label>Password</label>
          <input type="password" placeholder="Enter password" />

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}

export default AdminLogin;