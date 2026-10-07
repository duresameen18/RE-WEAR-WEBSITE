function ManageUser() {
  return (
    <div className="form-page">
      <div className="reware-form">

        <div className="reware-logo">RE-WEAR</div>

        <form>
          <h1>Manage User</h1>

          <label>Select User</label>
          <select>
            <option>Select User</option>
            <option>Buyer</option>
            <option>Seller</option>
          </select>

          <label>Action</label>
          <select>
            <option>Select Action</option>
            <option>Activate User</option>
            <option>Deactivate User</option>
            <option>Delete User</option>
          </select>

          <label>Reason</label>
          <textarea placeholder="Enter reason"></textarea>

          <button type="submit">Apply Action</button>
        </form>

      </div>
    </div>
  );
}

export default ManageUser;