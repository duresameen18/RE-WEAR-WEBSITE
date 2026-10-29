import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import {
  initialProducts,
  readProducts,
  readStored,
  STORAGE_KEYS,
  writeProducts,
  writeStored,
} from "../data/store.js";
import {
  addComplaint,
  addExchange,
  addOrder,
  addCategory,
  addProduct,
  deleteProduct,
  deleteUser,
  getCategories,
  getComplaints,
  getExchanges,
  getOrders,
  getProducts,
  getSellerOrders,
  getUsers,
  updateComplaint,
  updateOrder,
  updateProduct,
  updateUser,
} from "../../services/Api.js";
import "../App.css";

// Use consistent timestamps for local orders, exchanges, and complaints.
function timestamp() {
  return new Date().toISOString();
}

// Protect dashboards by requiring an active session with the matching role.
function ProtectedDashboard({ role, children }) {
  const { currentUser, ready } = useAuth();
  if (!ready) return <p className="route-loading">Loading account...</p>;
  if (!currentUser) return <Navigate to={role === "admin" ? "/admin/login" : "/auth"} replace />;
  if (currentUser.role !== role) return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  return children;
}

// Read and update a localStorage-backed collection while keeping React state in sync.
function useCollection(key, fallback = []) {
  const [items, setItems] = useState(() => readStored(key, fallback));

  const save = useCallback((nextItems) => {
    writeStored(key, nextItems);
    setItems(nextItems);
  }, [key]);

  return [items, save];
}

// Shared dashboard header and layout for the signed-in stakeholder.
function DashboardShell({ title, description, children }) {
  const { currentUser, logout } = useAuth();

  return (
    <main className="stakeholder-dashboard">
      <header className="dashboard-header">
        <Link className="logo" to="/">RE-WEAR</Link>
        <div className="dashboard-account">
          <span>{currentUser.name}</span>
          <button type="button" onClick={logout}>Log out</button>
        </div>
      </header>
      <section className="dashboard-content">
        <p className="small-title">{currentUser.role.toUpperCase()} DASHBOARD</p>
        <h1>{title}</h1>
        <p className="dashboard-description">{description}</p>
        {children}
      </section>
    </main>
  );
}

// Buyer tools for shopping, cart checkout, orders, exchanges, and support complaints.
function BuyerDashboard() {
  const { currentUser } = useAuth();
  const [products] = useState(readProducts);
  const [orders, saveOrders] = useCollection(STORAGE_KEYS.orders);
  const [exchanges, saveExchanges] = useCollection(STORAGE_KEYS.exchanges);
  const [complaints, saveComplaints] = useCollection(STORAGE_KEYS.complaints);
  const [cart, saveCart] = useCollection(STORAGE_KEYS.cart);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getOrders(currentUser.id),
      getExchanges(currentUser.id),
      getComplaints(currentUser.id),
    ])
      .then(([savedOrders, savedExchanges, savedComplaints]) => {
        if (cancelled) return;
        const nextOrders = [
          ...readStored(STORAGE_KEYS.orders, []).filter((item) => item.buyerId !== currentUser.id),
          ...savedOrders,
        ];
        const nextExchanges = [
          ...readStored(STORAGE_KEYS.exchanges, []).filter((item) => item.buyerId !== currentUser.id),
          ...savedExchanges,
        ];
        const nextComplaints = [
          ...readStored(STORAGE_KEYS.complaints, []).filter((item) => item.userId !== currentUser.id),
          ...savedComplaints,
        ];
        writeStored(STORAGE_KEYS.orders, nextOrders);
        writeStored(STORAGE_KEYS.exchanges, nextExchanges);
        writeStored(STORAGE_KEYS.complaints, nextComplaints);
        saveOrders(nextOrders);
        saveExchanges(nextExchanges);
        saveComplaints(nextComplaints);
      })
      .catch((error) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Buyer records could not be loaded.");
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser.id, saveComplaints, saveExchanges, saveOrders]);

  // Save a single product order for the current buyer.
  async function purchase(product) {
    const order = {
      id: crypto.randomUUID(),
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      productId: product.id,
      productName: product.name,
      sellerId: product.sellerId,
      price: Number(product.price),
      status: "pending",
      createdAt: timestamp(),
    };
    try {
      await addOrder(order);
      saveOrders([...orders, order]);
      setMessage(`${product.name} was added to your orders.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The order could not be placed.");
    }
  }

  // Convert every saved cart item into an order, then clear the cart.
  async function purchaseCart() {
    if (!cart.length) return;
    const newOrders = cart.map((product) => ({
      id: crypto.randomUUID(),
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      productId: product.id,
      productName: product.name,
      sellerId: product.sellerId,
      price: Number(product.price),
      status: "pending",
      createdAt: timestamp(),
    }));
    try {
      await Promise.all(newOrders.map(addOrder));
      saveOrders([...orders, ...newOrders]);
      saveCart([]);
      setMessage(`${newOrders.length} cart item(s) were added to your orders.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The cart orders could not be placed.");
    }
  }

  // Save a buyer's request to exchange one item for another.
  async function requestExchange(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const exchange = {
      id: crypto.randomUUID(),
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      offeredItem: form.get("offeredItem").trim(),
      requestedItem: form.get("requestedItem").trim(),
      status: "pending",
      createdAt: timestamp(),
    };
    try {
      await addExchange(exchange);
      saveExchanges([...exchanges, exchange]);
      formElement.reset();
      setMessage("Your exchange request was saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The exchange could not be saved.");
    }
  }

  // Send a support complaint for administrators to review.
  async function sendComplaint(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const complaint = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      subject: form.get("subject").trim(),
      details: form.get("details").trim(),
      status: "open",
      createdAt: timestamp(),
    };
    try {
      await addComplaint(complaint);
      saveComplaints([...complaints, complaint]);
      formElement.reset();
      setMessage("Your complaint was submitted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The complaint could not be submitted.");
    }
  }

  const myOrders = orders.filter((order) => order.buyerId === currentUser.id);
  const myExchanges = exchanges.filter((exchange) => exchange.buyerId === currentUser.id);
  const myComplaints = complaints.filter((complaint) => complaint.userId === currentUser.id);

  return (
    <DashboardShell title="Buyer Dashboard" description="Shop pre-loved clothing, track orders, request exchanges, and contact the RE-WEAR team.">
      {/* Buyer activity summary and available product cards. */}
      {message && <p className="success-message" role="status">{message}</p>}
      <div className="dashboard-stats">
        <Stat label="Orders" value={myOrders.length} />
        <Stat label="Exchanges" value={myExchanges.length} />
        <Stat label="Cart items" value={cart.length} />
      </div>
      <section className="dashboard-panel">
        <div className="panel-heading">
          <div><p className="small-title">AVAILABLE NOW</p><h2>Shop items</h2></div>
          <button className="secondary-button" type="button" onClick={purchaseCart} disabled={!cart.length}>
            Place cart orders ({cart.length})
          </button>
        </div>
        <div className="dashboard-product-grid">
          {products.filter((product) => product.status !== "hidden" && product.status !== "removed").map((product) => (
            <article className="dashboard-product" key={product.id}>
              <img src={product.image} alt={product.alt || product.name} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.category} · Rs. {Number(product.price).toLocaleString()}</p>
                <div className="inline-actions">
                  <button type="button" onClick={() => purchase(product)}>Purchase</button>
                  <button className="secondary-button" type="button" onClick={() => saveCart([...cart, product])}>Add to cart</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* Personal order/exchange history and the buyer's exchange/support forms. */}
      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <h2>My orders</h2>
          <RecordList items={myOrders} empty="You have not placed any orders yet." render={(order) => (
            <><strong>{order.productName}</strong><span>Rs. {Number(order.price).toLocaleString()} · {order.status}</span></>
          )} />
        </section>
        <section className="dashboard-panel">
          <h2>My exchange requests</h2>
          <RecordList items={myExchanges} empty="No exchange requests yet." render={(exchange) => (
            <><strong>{exchange.offeredItem} for {exchange.requestedItem}</strong><span>{exchange.status}</span></>
          )} />
        </section>
      </div>
      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <h2>Request an exchange</h2>
          <form className="dashboard-form" onSubmit={requestExchange}>
            <label>Your item<input name="offeredItem" required /></label>
            <label>Item you want<input name="requestedItem" required /></label>
            <button type="submit">Send exchange request</button>
          </form>
        </section>
        <section className="dashboard-panel">
          <h2>Contact support</h2>
          <form className="dashboard-form" onSubmit={sendComplaint}>
            <label>Subject<input name="subject" required /></label>
            <label>Details<textarea name="details" rows="3" required /></label>
            <button type="submit">Submit complaint</button>
          </form>
          <RecordList items={myComplaints} empty="No complaints submitted." render={(item) => (
            <><strong>{item.subject}</strong><span>{item.status}</span></>
          )} />
        </section>
      </div>
    </DashboardShell>
  );
}

// Seller tools for product listings and the status of sales and incoming orders.
function SellerDashboard() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState(readProducts);
  const [orders, saveOrders] = useCollection(STORAGE_KEYS.orders);
  const [categories] = useCollection(STORAGE_KEYS.categories, ["Western Formal", "Eastern Formal"]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const productFormRef = useRef(null);
  const ownProducts = products.filter((product) => product.sellerId === currentUser.id);
  const ownProductIds = new Set(ownProducts.map((product) => product.id));
  const sales = orders.filter((order) => ownProductIds.has(order.productId));
  const completedSales = sales.filter((order) => order.status === "completed");

  useEffect(() => {
    let cancelled = false;

    getProducts(currentUser.id)
      .then((savedProducts) => {
        if (cancelled) return;
        const nextProducts = [
          ...readProducts().filter((product) => product.sellerId !== currentUser.id),
          ...savedProducts,
        ];
        writeProducts(nextProducts);
        setProducts(nextProducts);
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage({
            type: "error",
            text: error instanceof Error ? error.message : "Products could not be loaded.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser.id]);

  useEffect(() => {
    if (editing) {
      productFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editing]);

  useEffect(() => {
    let cancelled = false;
    getSellerOrders(currentUser.id)
      .then((savedOrders) => {
        if (cancelled) return;
        const nextOrders = [
          ...readStored(STORAGE_KEYS.orders, []).filter((item) => item.sellerId !== currentUser.id),
          ...savedOrders,
        ];
        saveOrders(nextOrders);
      })
      .catch((error) => {
        if (!cancelled) setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Orders could not be loaded.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser.id, saveOrders]);

  async function changeOrderStatus(order, status) {
    try {
      await updateOrder(order.id, { status });
      saveOrders(orders.map((item) => item.id === order.id ? { ...item, status } : item));
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "The order could not be updated.",
      });
    }
  }

  // Add a seller-owned product or update the product currently being edited.
  async function submitProduct(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const values = {
      name: form.get("name").trim(),
      category: form.get("category"),
      price: Number(form.get("price")),
      style: form.get("category").toLowerCase().includes("eastern") ? "eastern" : "western",
      alt: form.get("name").trim(),
      image: form.get("image").trim() || editing?.image || initialProducts[0].image,
      sellerId: currentUser.id,
      status: "active",
    };
    const wasEditing = Boolean(editing);
    const product = wasEditing
      ? { ...editing, ...values }
      : { ...values, id: crypto.randomUUID() };

    try {
      if (wasEditing) {
        await updateProduct(product);
      } else {
        await addProduct(product);
      }
      const nextProducts = wasEditing
        ? products.map((item) => item.id === product.id ? product : item)
        : [...products, product];
      writeProducts(nextProducts);
      setProducts(nextProducts);
      setEditing(null);
      formElement.reset();
      setMessage({
        type: "success",
        text: wasEditing ? "Product updated." : "Product listed successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "The product could not be saved.",
      });
    }
  }

  // Delete one product owned by the current seller.
  async function removeProduct(productId) {
    try {
      await deleteProduct(productId);
      const nextProducts = products.filter((product) => product.id !== productId);
      writeProducts(nextProducts);
      setProducts(nextProducts);
      setMessage({ type: "success", text: "Product deleted successfully." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "The product could not be deleted.",
      });
    }
  }

  return (
    <DashboardShell title="Seller Dashboard" description="Create listings, update your products, and keep track of sales and incoming orders.">
      {/* Seller activity totals, product editor/list, and incoming order controls. */}
      {message && (
        <p className={`success-message${message.type === "error" ? " error" : ""}`} role={message.type === "error" ? "alert" : "status"}>
          {message.text}
        </p>
      )}
      <div className="dashboard-stats">
        <Stat label="My products" value={ownProducts.length} />
        <Stat label="Incoming orders" value={sales.length} />
        <Stat label="Completed sales" value={completedSales.length} />
      </div>
      <div className="dashboard-columns">
        <section ref={productFormRef} className="dashboard-panel">
          <h2>{editing ? "Edit product" : "Add a product"}</h2>
          <form className="dashboard-form" key={editing?.id || "new-product"} onSubmit={submitProduct}>
            <label>Product name<input name="name" defaultValue={editing?.name || ""} required /></label>
            <label>Category
              <select name="category" defaultValue={editing?.category || categories[0] || "Western Formal"}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label>Price (Rs.)<input name="price" type="number" min="1" defaultValue={editing?.price || ""} required /></label>
            <label>Image URL (optional)<input name="image" type="url" defaultValue={editing?.image || ""} placeholder="https://..." /></label>
            <div className="inline-actions">
              <button type="submit">{editing ? "Save changes" : "List product"}</button>
              {editing && <button className="secondary-button" type="button" onClick={() => setEditing(null)}>Cancel</button>}
            </div>
          </form>
        </section>
        <section className="dashboard-panel">
          <h2>My products</h2>
          <RecordList items={ownProducts} empty="You have not listed any products yet." render={(product) => (
            <div className="manage-row">
              <div><strong>{product.name}</strong><span>{product.category} · Rs. {Number(product.price).toLocaleString()} · {product.status}</span></div>
              <div className="inline-actions">
                <button className="secondary-button" type="button" onClick={() => setEditing(product)}>Edit product</button>
                <button className="danger-button" type="button" onClick={() => void removeProduct(product.id)}>Delete</button>
              </div>
            </div>
          )} />
        </section>
      </div>
      <section className="dashboard-panel">
        <h2>Sales and incoming orders</h2>
        <RecordList items={sales} empty="No customer orders for your products yet." render={(order) => (
          <div className="manage-row">
            <div><strong>{order.productName}</strong><span>Buyer: {order.buyerName} · Rs. {Number(order.price).toLocaleString()}</span></div>
            <select aria-label={`Update ${order.productName} order status`} value={order.status} onChange={(event) => void changeOrderStatus(order, event.target.value)}>
              <option value="pending">Pending</option><option value="processing">Processing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
          </div>
        )} />
      </section>
    </DashboardShell>
  );
}

// Admin tools for local accounts, listings, categories, orders, and complaints.
function AdminDashboard() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState(readProducts);
  const [orders, saveOrders] = useCollection(STORAGE_KEYS.orders);
  const [complaints, saveComplaints] = useCollection(STORAGE_KEYS.complaints);
  const [categories, saveCategories] = useCollection(STORAGE_KEYS.categories, ["Western Formal", "Eastern Formal"]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getUsers(),
      getProducts(),
      getOrders(),
      getComplaints(),
      getCategories(),
    ])
      .then(([savedUsers, savedProducts, savedOrders, savedComplaints, savedCategories]) => {
        if (cancelled) return;
      const localUsers = readStored(STORAGE_KEYS.users, []);
      const nextCategories = [...new Set([
        ...readStored(STORAGE_KEYS.categories, ["Western Formal", "Eastern Formal"]),
        ...savedCategories.map((category) => category.name),
      ])];
      const nextUsers = savedUsers.map((user) => ({
        ...localUsers.find((item) => item.id === user.id),
        ...user,
      }));
      setUsers(nextUsers);
      writeStored(STORAGE_KEYS.users, [
        ...localUsers.filter((item) => !savedUsers.some((user) => user.id === item.id)),
        ...nextUsers,
      ]);
        setProducts(savedProducts);
        saveOrders(savedOrders);
        saveComplaints(savedComplaints);
        saveCategories(nextCategories);
        writeProducts(savedProducts);
      })
      .catch((error) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "Admin records could not be loaded.");
      });

    return () => {
      cancelled = true;
    };
  }, [saveCategories, saveComplaints, saveOrders]);

  // Persist product moderation changes for the storefront and dashboards.
  async function updateProducts(nextProducts) {
    const changed = nextProducts.find((product) =>
      products.some((current) => current.id === product.id && current.status !== product.status),
    );
    const removed = products.find((product) =>
      !nextProducts.some((next) => next.id === product.id),
    );
    try {
      if (removed) await deleteProduct(removed.id);
      if (changed) await updateProduct(changed);
      writeProducts(nextProducts);
      setProducts(nextProducts);
      setMessage(removed ? "Product deleted." : "Product updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The product could not be updated.");
    }
  }

  async function updateUserRecord(user, changes) {
    try {
      await updateUser(user.id, changes);
      const nextUsers = users.map((item) => item.id === user.id ? { ...item, ...changes } : item);
      setUsers(nextUsers);
      const localUsers = readStored(STORAGE_KEYS.users, []);
      writeStored(STORAGE_KEYS.users, localUsers.map((item) =>
        item.id === user.id ? { ...item, ...changes } : item,
      ));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The user could not be updated.");
    }
  }

  async function updateOrderRecord(order, status) {
    try {
      await updateOrder(order.id, { status });
      saveOrders(orders.map((item) => item.id === order.id ? { ...item, status } : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The order could not be updated.");
    }
  }

  async function updateComplaintRecord(complaint, status) {
    try {
      await updateComplaint(complaint.id, { status });
      saveComplaints(complaints.map((item) => item.id === complaint.id ? { ...item, status } : item));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The complaint could not be updated.");
    }
  }

  // Add a category to the shared local category list after checking for duplicates.
  async function addCategoryRecord(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const categoryName = form.get("category").trim();
    const exists = categories.some((category) => category.toLowerCase() === categoryName.toLowerCase());
    if (exists) {
      setMessage("That category already has products.");
      return;
    }
    const category = {
      id: crypto.randomUUID(),
      name: categoryName,
      description: "",
    };
    try {
      await addCategory(category);
      saveCategories([...categories, categoryName]);
      event.currentTarget.reset();
      setMessage(`Category "${categoryName}" was added.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The category could not be added.");
    }
  }

  async function removeUser(user) {
    try {
      await deleteUser(user.id);
      setUsers(users.filter((item) => item.id !== user.id));
      const localUsers = readStored(STORAGE_KEYS.users, []);
      writeStored(STORAGE_KEYS.users, localUsers.filter((item) => item.id !== user.id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The user could not be deleted.");
    }
  }

  const managedUsers = users.filter((user) => user.role !== "admin" || user.id !== currentUser.id);

  return (
    <DashboardShell title="Admin Dashboard" description="Review users, products, orders, and customer complaints across RE-WEAR.">
      {/* Admin totals and account moderation actions. */}
      {message && <p className="success-message" role="status">{message}</p>}
      <div className="dashboard-stats">
        <Stat label="Users" value={managedUsers.length} />
        <Stat label="Products" value={products.length} />
        <Stat label="Orders" value={orders.length} />
        <Stat label="Open complaints" value={complaints.filter((item) => item.status === "open").length} />
      </div>
      <section className="dashboard-panel">
        <h2>Manage users</h2>
        <RecordList items={managedUsers} empty="No registered members yet." render={(user) => (
          <div className="manage-row">
            <div><strong>{user.name}</strong><span>{user.email} · {user.role} · {user.status}</span></div>
            <div className="inline-actions">
              <button className="secondary-button" type="button" onClick={() => void updateUserRecord(user, { status: user.status === "active" ? "suspended" : "active" })}>
                {user.status === "active" ? "Suspend" : "Reactivate"}
              </button>
              <button className="danger-button" type="button" onClick={() => void removeUser(user)}>Delete</button>
            </div>
          </div>
        )} />
      </section>
      {/* Product/category moderation, order status updates, and complaint review. */}
      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <h2>Manage products</h2>
          <RecordList items={products} empty="No products to review." render={(product) => (
            <div className="manage-row">
              <div><strong>{product.name}</strong><span>{product.category} · Rs. {Number(product.price).toLocaleString()} · {product.status}</span></div>
              <div className="inline-actions">
                <button className="secondary-button" type="button" onClick={() => void updateProducts(products.map((item) => item.id === product.id ? { ...item, status: item.status === "active" ? "hidden" : "active" } : item))}>
                  {product.status === "active" ? "Hide" : "Approve/show"}
                </button>
                <button className="danger-button" type="button" onClick={() => void updateProducts(products.filter((item) => item.id !== product.id))}>Delete</button>
              </div>
            </div>
          )} />
          <div className="category-management">
            <h3>Categories</h3>
            <ul>{categories.map((category) => <li key={category}>{category}</li>)}</ul>
            <form className="dashboard-form category-form" onSubmit={addCategoryRecord}>
              <label>Add category<input name="category" placeholder="Category name" required /></label>
              <button type="submit">Add category</button>
            </form>
          </div>
        </section>
        <section className="dashboard-panel">
          <h2>Manage orders</h2>
          <RecordList items={orders} empty="No orders have been placed." render={(order) => (
            <div className="manage-row">
              <div><strong>{order.productName}</strong><span>{order.buyerName} · Rs. {Number(order.price).toLocaleString()}</span></div>
              <select aria-label={`Update ${order.productName} order status`} value={order.status} onChange={(event) => void updateOrderRecord(order, event.target.value)}>
                <option value="pending">Pending</option><option value="processing">Processing</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
              </select>
            </div>
          )} />
        </section>
      </div>
      <section className="dashboard-panel">
        <h2>Manage complaints</h2>
        <RecordList items={complaints} empty="There are no customer complaints." render={(complaint) => (
          <div className="manage-row">
            <div><strong>{complaint.subject}</strong><span>{complaint.userName}: {complaint.details} · {complaint.status}</span></div>
            <select aria-label={`Update complaint ${complaint.subject}`} value={complaint.status} onChange={(event) => void updateComplaintRecord(complaint, event.target.value)}>
              <option value="open">Open</option><option value="investigating">Investigating</option><option value="resolved">Resolved</option>
            </select>
          </div>
        )} />
      </section>
    </DashboardShell>
  );
}

// Display one dashboard count in the shared statistics row.
function Stat({ label, value }) {
  return <article className="dashboard-stat"><span>{label}</span><strong>{value}</strong></article>;
}

// Render a collection consistently and show a helpful empty state when needed.
function RecordList({ items, empty, render }) {
  if (!items.length) return <p className="empty-state">{empty}</p>;
  return <div className="record-list">{items.map((item) => (
    <article className="record-item" key={item.id}>{render(item)}</article>
  ))}</div>;
}

// Select and protect the dashboard corresponding to the authenticated role.
export default function Dashboard({ role }) {
  const components = { buyer: <BuyerDashboard />, seller: <SellerDashboard />, admin: <AdminDashboard /> };
  return <ProtectedDashboard role={role}>{components[role]}</ProtectedDashboard>;
}
