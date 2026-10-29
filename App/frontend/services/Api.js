const API_URL = "http://localhost:5000";

export async function addProduct(product) {
  return sendProductRequest("/add_product", "POST", product);
}

export async function getProducts(sellerId) {
  const query = sellerId ? `?sellerId=${encodeURIComponent(sellerId)}` : "";
  return sendProductRequest(`/add_product${query}`, "GET");
}

export async function updateProduct(product) {
  return sendProductRequest(
    `/add_product/${encodeURIComponent(product.id)}`,
    "PUT",
    product,
  );
}

export async function deleteProduct(productId) {
  return sendProductRequest(
    `/add_product/${encodeURIComponent(productId)}`,
    "DELETE",
  );
}

export async function registerUser(user) {
  return sendRequest("/users", "POST", user);
}

export async function getUsers() {
  return sendRequest("/users", "GET");
}

export async function updateUser(userId, changes) {
  return sendRequest(`/users/${encodeURIComponent(userId)}`, "PUT", changes);
}

export async function deleteUser(userId) {
  return sendRequest(`/users/${encodeURIComponent(userId)}`, "DELETE");
}

export async function addOrder(order) {
  return sendRequest("/orders", "POST", order);
}

export async function getOrders(buyerId) {
  const query = buyerId ? `?buyerId=${encodeURIComponent(buyerId)}` : "";
  return sendRequest(`/orders${query}`, "GET");
}

export async function getSellerOrders(sellerId) {
  return sendRequest(`/orders?sellerId=${encodeURIComponent(sellerId)}`, "GET");
}

export async function updateOrder(orderId, changes) {
  return sendRequest(`/orders/${encodeURIComponent(orderId)}`, "PUT", changes);
}

export async function deleteOrder(orderId) {
  return sendRequest(`/orders/${encodeURIComponent(orderId)}`, "DELETE");
}

export async function addExchange(exchange) {
  return sendRequest("/exchanges", "POST", exchange);
}

export async function getExchanges(buyerId) {
  const query = buyerId ? `?buyerId=${encodeURIComponent(buyerId)}` : "";
  return sendRequest(`/exchanges${query}`, "GET");
}

export async function updateExchange(exchangeId, changes) {
  return sendRequest(`/exchanges/${encodeURIComponent(exchangeId)}`, "PUT", changes);
}

export async function deleteExchange(exchangeId) {
  return sendRequest(`/exchanges/${encodeURIComponent(exchangeId)}`, "DELETE");
}

export async function addComplaint(complaint) {
  return sendRequest("/complaints", "POST", complaint);
}

export async function getComplaints(userId) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return sendRequest(`/complaints${query}`, "GET");
}

export async function updateComplaint(complaintId, changes) {
  return sendRequest(`/complaints/${encodeURIComponent(complaintId)}`, "PUT", changes);
}

export async function deleteComplaint(complaintId) {
  return sendRequest(`/complaints/${encodeURIComponent(complaintId)}`, "DELETE");
}

export async function addCategory(category) {
  return sendRequest("/categories", "POST", category);
}

export async function getCategories() {
  return sendRequest("/categories", "GET");
}

export async function updateCategory(categoryId, changes) {
  return sendRequest(`/categories/${encodeURIComponent(categoryId)}`, "PUT", changes);
}

export async function deleteCategory(categoryId) {
  return sendRequest(`/categories/${encodeURIComponent(categoryId)}`, "DELETE");
}

async function sendProductRequest(path, method, product) {
  return sendRequest(path, method, product);
}

async function sendRequest(path, method, data) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    ...(data && {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  });
  const result = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "The request failed.");
  }

  return result;
}