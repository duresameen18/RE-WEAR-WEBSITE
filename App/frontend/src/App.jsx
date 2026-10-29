import { useEffect, useRef, useState } from "react";
import { createBrowserRouter, Link, Navigate, useParams } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import AdminLogin from "./forms/admin/AdminLogin.jsx";
import AddCategory from "./forms/admin/AddCategory.jsx";
import ManageProduct from "./forms/admin/ManageProduct.jsx";
import ManageUser from "./forms/admin/ManageUser.jsx";
import BuyerRegistration from "./forms/buyer/BuyerRegistration.jsx";
import BuyerLogin from "./forms/buyer/BuyerLogin.jsx";
import ExchangeForm from "./forms/buyer/ExchangeForm.jsx";
import PurchaseForm from "./forms/buyer/PurchaseForm.jsx";
import SellerRegistration from "./forms/seller/SellerRegistration.jsx";
import SellerLogin from "./forms/seller/SellerLogin.jsx";
import AddProduct from "./forms/seller/AddProduct.jsx";
import EditProduct from "./forms/seller/EditProduct.jsx";
import {
  readProducts,
  readStored,
  STORAGE_KEYS,
  writeProducts,
  writeStored,
} from "./data/store.js";
import {
  addCategory,
  addExchange,
  addOrder,
  addProduct,
  deleteProduct,
  deleteUser,
  getCategories,
  getProducts,
  getUsers,
  updateProduct,
  updateUser,
} from "../services/Api.js";
import "./App.css";

const FORM_UPLOAD_LIMIT = 1024 * 1024;

function readImageDataUrl(file) {
  if (!file?.size) return Promise.reject(new Error("Choose an image file."));
  if (file.size > FORM_UPLOAD_LIMIT) {
    return Promise.reject(new Error("Choose an image smaller than 1 MB."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.readAsDataURL(file);
  });
}

// Carousel slides supply the hero banner text, image, and destination for each call to action.
const slides = [
  {
    eyebrow: "WELCOME TO RE-WEAR",
    title: <>Give Clothes<br />A Second Life.</>,
    description: "Buy, sell and exchange beautiful pre-loved fashion.",
    button: "SHOP NOW",
    action: "shop",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "SELL YOUR STYLE",
    title: <>Your Closet.<br />Someone's New Favorite.</>,
    description: "Sell clothes you no longer wear and give them a new home.",
    button: "SELL NOW",
    action: "sell",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "SWAP & SAVE",
    title: <>Exchange.<br />Refresh. Repeat.</>,
    description: "Exchange your clothes for something new to you.",
    button: "EXPLORE EXCHANGE",
    action: "exchange",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
  },
];

// Landing-page categories provide the content and imagery for the style cards.
const categories = [
  {
    id: "eastern",
    title: "Eastern Formal",
    description: "Elegant traditional dresses for every occasion.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "western",
    title: "Western Formal",
    description: "Modern dresses, blazers and elegant outfits.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80",
  },
];

// The landing page manages the storefront, search, cart, and links into role-based accounts.
function LandingPage() {
  const { formId } = useParams();
  const [slideIndex, setSlideIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [products, setProducts] = useState(readProducts);
  const [productCategories, setProductCategories] = useState(() =>
    readStored(STORAGE_KEYS.categories, ["Western Formal", "Eastern Formal"]),
  );
  const [users, setUsers] = useState(() => readStored(STORAGE_KEYS.users, []));
  const [cart, setCart] = useState(() => readStored(STORAGE_KEYS.cart, []));
  const [cartOpen, setCartOpen] = useState(false);
  const [formNotice, setFormNotice] = useState(null);
  const validatedFormContainerRef = useRef(null);
  const { currentUser, logout, login, signUp, ready } = useAuth();
  const selectedForm = formId ? {
    "buyer-registration": <BuyerRegistration />,
    "buyer-login": <BuyerLogin />,
    purchase: <PurchaseForm products={products} />,
    exchange: <ExchangeForm />,
    "seller-registration": <SellerRegistration />,
    "seller-login": <SellerLogin />,
    "add-product": <AddProduct categories={productCategories} />,
    "edit-product": (
      <EditProduct
        products={products.filter((product) => product.sellerId === currentUser?.id)}
      />
    ),
    "admin-login": <AdminLogin />,
    "add-category": <AddCategory />,
    "manage-product": <ManageProduct products={currentUser?.role === "admin" ? products : []} />,
    "manage-user": <ManageUser users={currentUser?.role === "admin" ? users : []} />,
  }[formId] : null;

  // Persist cart changes so they are available after navigation or a page refresh.
  useEffect(() => {
    writeStored(STORAGE_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    if (formId !== "edit-product" || currentUser?.role !== "seller") return undefined;

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
          setFormNotice({
            type: "error",
            text: error instanceof Error ? error.message : "Products could not be loaded.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [formId, currentUser?.id, currentUser?.role]);

  useEffect(() => {
    if (formId !== "manage-user" || currentUser?.role !== "admin") return undefined;

    let cancelled = false;
    getUsers()
      .then((savedUsers) => {
        if (cancelled) return;
        const localUsers = readStored(STORAGE_KEYS.users, []);
        const nextUsers = savedUsers.map((user) => ({
          ...localUsers.find((item) => item.id === user.id),
          ...user,
        }));
        setUsers(nextUsers);
      })
      .catch((error) => {
        if (!cancelled) {
          setFormNotice({
            type: "error",
            text: error instanceof Error ? error.message : "Users could not be loaded.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formId, currentUser?.role]);

  useEffect(() => {
    const shouldLoadProducts =
      (formId === "manage-product" && currentUser?.role === "admin") ||
      (formId === "purchase" && currentUser?.role === "buyer");
    if (!shouldLoadProducts) return undefined;

    let cancelled = false;
    getProducts()
      .then((savedProducts) => {
        if (cancelled) return;
        const savedIds = new Set(savedProducts.map((product) => product.id));
        const nextProducts = [
          ...readProducts().filter((product) => !savedIds.has(product.id)),
          ...savedProducts,
        ];
        writeProducts(nextProducts);
        setProducts(nextProducts);
      })
      .catch((error) => {
        if (!cancelled) {
          setFormNotice({
            type: "error",
            text: error instanceof Error ? error.message : "Products could not be loaded.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formId, currentUser?.role]);

  useEffect(() => {
    const shouldLoadCategories =
      (formId === "add-category" && currentUser?.role === "admin") ||
      (formId === "add-product" && currentUser?.role === "seller");
    if (!shouldLoadCategories) return undefined;

    let cancelled = false;
    getCategories()
      .then((savedCategories) => {
        if (cancelled) return;
        const nextCategories = [...new Set([
          ...readStored(STORAGE_KEYS.categories, ["Western Formal", "Eastern Formal"]),
          ...savedCategories.map((category) => category.name),
        ])];
        writeStored(STORAGE_KEYS.categories, nextCategories);
        setProductCategories(nextCategories);
      })
      .catch((error) => {
        if (!cancelled) {
          setFormNotice({
            type: "error",
            text: error instanceof Error ? error.message : "Categories could not be loaded.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formId, currentUser?.role]);

  // Automatically rotate the hero carousel and clean up its timer on unmount.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSlideIndex((index) => (index + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  // Allow shoppers to close the cart dialog with the Escape key.
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") setCartOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (formNotice) {
      document.getElementById("landing-form-notice")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [formNotice]);

  // Apply the selected style and search term, excluding products hidden from buyers.
  const filteredProducts = products.filter((product) => {
    const matchesStyle =
      selectedStyle === "all" || product.style === selectedStyle;
    const matchesSearch = product.name.toLowerCase().includes(search.trim().toLowerCase());
    const isAvailable = product.status !== "hidden" && product.status !== "removed" && product.status !== "draft";
    return matchesStyle && matchesSearch && isAvailable;
  });

  // Select a product style and scroll the storefront to the product list.
  function scrollToShop(style = "all") {
    setSelectedStyle(style);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  }

  // Add the chosen product to the saved cart.
  function addToCart(product) {
    setCart((items) => [...items, product]);
    window.alert(`${product.name} added to your cart!`);
  }

  function requireRole(role) {
    if (!currentUser) {
      throw new Error(`Please sign in as a ${role} to use this form.`);
    }
    if (currentUser.role !== role) {
      throw new Error(`Sign in with a ${role} account to use this form.`);
    }
  }

  function saveProducts(nextProducts) {
    writeProducts(nextProducts);
    setProducts(nextProducts);
  }

  // Handle all twelve legacy form components from one landing-page submit boundary.
  async function handleLandingFormSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.dataset.formType) return;
    event.preventDefault();
    setFormNotice(null);
    const blankRequiredField = Array.from(
      form.querySelectorAll("input[required]:not([type=password]), textarea[required]"),
    ).find((field) => !field.value.trim());
    if (blankRequiredField) {
      blankRequiredField.setCustomValidity("Enter a value that is not only spaces.");
      blankRequiredField.reportValidity();
      return;
    }
    const values = new FormData(form);
    const value = (name) => String(values.get(name) || "").trim();
    const password = String(values.get("password") || "");
    const createdAt = new Date().toISOString();

    try {
      if (
        !ready &&
        ["admin-login", "buyer-login", "seller-login", "buyer-registration", "seller-registration"]
          .includes(form.dataset.formType)
      ) {
        throw new Error("Account data is still loading. Please try again in a moment.");
      }
      switch (form.dataset.formType) {
        case "admin-login":
          await login({ email: value("email"), password, role: "admin" });
          setUsers(readStored(STORAGE_KEYS.users, []));
          setFormNotice({ type: "success", text: "Admin signed in successfully." });
          break;
        case "buyer-login":
          await login({ email: value("email"), password, role: "buyer" });
          setUsers(readStored(STORAGE_KEYS.users, []));
          setFormNotice({ type: "success", text: "Buyer signed in successfully." });
          break;
        case "seller-login":
          await login({ email: value("email"), password, role: "seller" });
          setUsers(readStored(STORAGE_KEYS.users, []));
          setFormNotice({ type: "success", text: "Seller signed in successfully." });
          break;
        case "buyer-registration":
          await signUp({
            name: value("name"),
            email: value("email"),
            password,
            phone: value("phone"),
            role: "buyer",
          });
          setUsers(readStored(STORAGE_KEYS.users, []));
          form.reset();
          setFormNotice({ type: "success", text: "Buyer account created and signed in." });
          break;
        case "seller-registration":
          await signUp({
            name: value("name"),
            email: value("email"),
            password,
            phone: value("phone"),
            shopName: value("shopName"),
            role: "seller",
          });
          setUsers(readStored(STORAGE_KEYS.users, []));
          form.reset();
          setFormNotice({ type: "success", text: "Seller account created and signed in." });
          break;
        case "purchase": {
          requireRole("buyer");
          const product = products.find((item) => item.id === value("productId"));
          if (!product || ["hidden", "removed", "draft"].includes(product.status)) {
            throw new Error("Choose an available product.");
          }
          const quantity = Number(value("quantity"));
          if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error("Quantity must be at least one.");
          }
          const order = {
            id: crypto.randomUUID(),
            buyerId: currentUser.id,
            buyerName: currentUser.name,
            productId: product.id,
            productName: product.name,
            sellerId: product.sellerId,
            price: Number(product.price) * quantity,
            quantity,
            size: value("size"),
            address: value("address"),
            phone: value("phone"),
            status: "pending",
            createdAt,
          };
          await addOrder(order);
          const orders = readStored(STORAGE_KEYS.orders, []);
          writeStored(STORAGE_KEYS.orders, [...orders, order]);
          form.reset();
          setFormNotice({ type: "success", text: "Your order was placed successfully." });
          break;
        }
        case "exchange": {
          requireRole("buyer");
          const image = await readImageDataUrl(values.get("image"));
          const exchange = {
            id: crypto.randomUUID(),
            buyerId: currentUser.id,
            buyerName: currentUser.name,
            offeredItem: value("offeredItem"),
            requestedItem: value("requestedItem"),
            offeredImage: image,
            size: value("size"),
            description: value("description"),
            status: "pending",
            createdAt,
          };
          await addExchange(exchange);
          const exchanges = readStored(STORAGE_KEYS.exchanges, []);
          writeStored(STORAGE_KEYS.exchanges, [...exchanges, exchange]);
          form.reset();
          setFormNotice({ type: "success", text: "Your exchange request was submitted." });
          break;
        }
        case "add-product": {
          requireRole("seller");
          const image = await readImageDataUrl(values.get("image"));
          const name = value("name");
          const category = value("category");
          const price = Number(value("price"));
          if (!name || !Number.isFinite(price) || price <= 0) {
            throw new Error("Enter a product name and a price greater than zero.");
          }
          const product = {
            id: crypto.randomUUID(),
            name,
            category,
            style: category.toLowerCase().includes("eastern") ? "eastern" : "western",
            price,
            image,
            alt: name,
            size: value("size"),
            description: value("description"),
            sellerId: currentUser.id,
            status: "active",
          };
          await addProduct(product);
          saveProducts([...products, product]);
          form.reset();
          setFormNotice({ type: "success", text: "Your product is now listed." });
          break;
        }
        case "edit-product": {
          requireRole("seller");
          const product = products.find((item) =>
            item.id === value("productId") && item.sellerId === currentUser.id,
          );
          if (!product) throw new Error("Choose one of your own products to edit.");
          const price = Number(value("price"));
          if (!Number.isFinite(price) || price <= 0) {
            throw new Error("Enter a price greater than zero.");
          }
          const selectedImage = values.get("image");
          const image = selectedImage?.size
            ? await readImageDataUrl(selectedImage)
            : product.image;
          const updatedProduct = {
            ...product,
            price,
            image,
            size: value("size"),
            description: value("description"),
          };
          await updateProduct(updatedProduct);
          saveProducts(products.map((item) => item.id === product.id ? updatedProduct : item));
          form.reset();
          setFormNotice({ type: "success", text: "Your product was updated." });
          break;
        }
        case "add-category": {
          requireRole("admin");
          const name = value("category");
          if (!name) throw new Error("Enter a category name.");
          if (productCategories.some((category) => category.toLowerCase() === name.toLowerCase())) {
            throw new Error("That category already exists.");
          }
          const category = {
            id: crypto.randomUUID(),
            name,
            description: value("description"),
          };
          await addCategory(category);
          const descriptions = readStored(STORAGE_KEYS.categoryDescriptions, {});
          writeStored(STORAGE_KEYS.categoryDescriptions, { ...descriptions, [name]: category.description });
          const nextCategories = [...productCategories, name];
          writeStored(STORAGE_KEYS.categories, nextCategories);
          setProductCategories(nextCategories);
          form.reset();
          setFormNotice({ type: "success", text: `Category "${name}" was added.` });
          break;
        }
        case "manage-product": {
          requireRole("admin");
          const product = products.find((item) => item.id === value("productId"));
          if (!product) throw new Error("Choose a product to manage.");
          const action = value("action");
          if (!["approve", "hide", "delete"].includes(action)) {
            throw new Error("Choose a valid product action.");
          }
          if (action === "delete") {
            await deleteProduct(product.id);
            saveProducts(products.filter((item) => item.id !== product.id));
          } else {
            const status = action === "hide" ? "hidden" : "active";
            const updatedProduct = { ...product, status, moderationReason: value("reason") };
            await updateProduct(updatedProduct);
            saveProducts(products.map((item) => item.id === product.id ? updatedProduct : item));
          }
          form.reset();
          const actionLabel = { approve: "approved", hide: "hidden", delete: "deleted" }[action];
          setFormNotice({ type: "success", text: `Product "${product.name}" was ${actionLabel}.` });
          break;
        }
        case "manage-user": {
          requireRole("admin");
          const user = users.find((item) => item.id === value("userId") && item.role !== "admin");
          if (!user) throw new Error("Choose a user to manage.");
          const action = value("action");
          if (!["activate", "deactivate", "delete"].includes(action)) {
            throw new Error("Choose a valid user action.");
          }
          const nextUsers = action === "delete"
            ? users.filter((item) => item.id !== user.id)
            : users.map((item) => item.id === user.id ? {
              ...item,
              status: action === "activate" ? "active" : "inactive",
              moderationReason: value("reason"),
            } : item);
          if (action === "delete") {
            await deleteUser(user.id);
          } else {
            await updateUser(user.id, {
              status: action === "activate" ? "active" : "inactive",
              moderationReason: value("reason"),
            });
          }
          const localUsers = readStored(STORAGE_KEYS.users, []);
          const nextLocalUsers = action === "delete"
            ? localUsers.filter((item) => item.id !== user.id)
            : localUsers.map((item) => item.id === user.id
              ? { ...item, status: action === "activate" ? "active" : "inactive", moderationReason: value("reason") }
              : item);
          writeStored(STORAGE_KEYS.users, nextLocalUsers);
          setUsers(nextUsers);
          form.reset();
          const actionLabel = { activate: "activated", deactivate: "deactivated", delete: "deleted" }[action];
          setFormNotice({ type: "success", text: `User "${user.name}" was ${actionLabel}.` });
          break;
        }
        default:
          throw new Error("This form is not supported.");
      }
    } catch (submitError) {
      setFormNotice({
        type: "error",
        text: submitError instanceof Error ? submitError.message : "The form could not be submitted.",
      });
    }
  }

  useEffect(() => {
    const container = validatedFormContainerRef.current;
    if (!container) return undefined;

    container.addEventListener("validatedsubmit", handleLandingFormSubmit);
    return () => container.removeEventListener("validatedsubmit", handleLandingFormSubmit);
  });

  if (formId) {
    return (
      <main className="landing-form-page">
        <header className="form-page-header">
          <Link className="logo" to="/">RE-WEAR</Link>
          <Link className="form-home-link" to="/#forms">Back to all forms</Link>
        </header>
        <section className="selected-form-content">
          {formNotice && (
            <p id="landing-form-notice" className={`landing-form-notice ${formNotice.type}`} role={formNotice.type === "error" ? "alert" : "status"}>
              {formNotice.text}
            </p>
          )}
          {selectedForm ? (
            <div
              ref={validatedFormContainerRef}
              className="selected-landing-form"
              onInput={(event) => {
                if (
                  event.target instanceof HTMLInputElement ||
                  event.target instanceof HTMLTextAreaElement ||
                  event.target instanceof HTMLSelectElement
                ) {
                  event.target.setCustomValidity("");
                }
              }}
            >
              {selectedForm}
            </div>
          ) : (
            <div className="invalid-form-page">
              <h1>Form not found</h1>
              <p>Choose one of the available forms from the landing page.</p>
              <Link className="portal-button" to="/#forms">Browse forms</Link>
            </div>
          )}
        </section>
      </main>
    );
  }

  const activeSlide = slides[slideIndex];

  return (
    <main>
      {/* Main navigation, storefront search, cart access, and current account controls. */}
      <nav className="navbar" aria-label="Main navigation">
        <Link className="logo" to="/#home">RE-WEAR</Link>

        <ul className="nav-links">
          <li><Link to="/#home">Home</Link></li>
          <li><Link to="/#shop" onClick={() => setSelectedStyle("all")}>Shop</Link></li>
          <li><Link to="/#western" onClick={() => scrollToShop("western")}>Western</Link></li>
          <li><Link to="/#eastern" onClick={() => scrollToShop("eastern")}>Eastern</Link></li>
          <li><Link to="/seller/dashboard">Sell</Link></li>
          <li><Link to="/buyer/dashboard">Exchange</Link></li>
        </ul>

        <div className="nav-right">
          <input
            className="search-box"
            type="search"
            aria-label="Search products"
            placeholder="Search items..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button className="cart-button" onClick={() => setCartOpen(true)}>
            Cart ({cart.length})
          </button>
          {currentUser ? (
            <>
              <Link className="nav-account-link" to={`/${currentUser.role}/dashboard`}>Dashboard</Link>
              <button className="nav-account-link" onClick={logout}>Log out</button>
            </>
          ) : (
            <Link className="nav-account-link" to="/auth">Log in / Sign up</Link>
          )}
        </div>
      </nav>

      {/* Rotating hero banner with shop, seller, and exchange actions. */}
      <section
        className="hero"
        id="home"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.92), rgba(255,255,255,0.15)), url("${activeSlide.image}")`,
        }}
        aria-label="Featured RE-WEAR offers"
      >
        <div className="slide-content" key={slideIndex}>
          <p className="small-title">{activeSlide.eyebrow}</p>
          <h1>{activeSlide.title}</h1>
          <p>{activeSlide.description}</p>
          {activeSlide.action === "shop" ? (
            <button className="main-button" onClick={() => scrollToShop()}>
              {activeSlide.button}
            </button>
          ) : (
            <Link
              className="main-button"
              to={activeSlide.action === "sell" ? "/seller/dashboard" : "/buyer/dashboard"}
            >
              {activeSlide.button}
            </Link>
          )}
        </div>
        <button
          className="carousel-control prev"
          aria-label="Previous slide"
          onClick={() => setSlideIndex((slideIndex - 1 + slides.length) % slides.length)}
        >
          ‹
        </button>
        <button
          className="carousel-control next"
          aria-label="Next slide"
          onClick={() => setSlideIndex((slideIndex + 1) % slides.length)}
        >
          ›
        </button>
      </section>

      {/* Store introduction and browse-by-style category cards. */}
      <section className="intro">
        <p className="small-title">PRE-LOVED FASHION</p>
        <h2>Fashion That Keeps Moving</h2>
        <p>
          RE-WEAR is a clothing marketplace where users can buy, sell and
          exchange pre-loved clothes. Discover both Eastern and Western fashion
          and give your wardrobe a second life.
        </p>
      </section>

      <section className="categories">
        <h2 className="section-title">Shop By Style</h2>
        <div className="category-container">
          {categories.map((category) => (
            <article
              className="category"
              id={category.id}
              key={category.id}
              style={{ backgroundImage: `url("${category.image}")` }}
            >
              <div className="category-content">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <button
                  className="white-button"
                  onClick={() => scrollToShop(category.id)}
                >
                  SHOP {category.id.toUpperCase()}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Searchable product cards with cart and exchange actions. */}
      <section className="products" id="shop">
        <p className="small-title centered">NEW ARRIVALS</p>
        <h2 className="section-title">Discover Pre-Loved Styles</h2>
        <div className="product-container">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.name}>
              <img src={product.image} alt={product.alt} />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category-name">{product.category}</p>
                <p className="price">Rs. {product.price.toLocaleString()}</p>
                <div className="product-buttons">
                  <button className="buy-button" onClick={() => addToCart(product)}>
                    ADD TO CART
                  </button>
                  <Link className="exchange-button" to="/buyer/exchange">
                    EXCHANGE
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {filteredProducts.length === 0 && (
            <p className="no-results">No items match your search.</p>
          )}
        </div>
      </section>

      {/* Seller promotion and overview of the RE-WEAR process. */}
      <section className="sell-section" id="sell">
        <div>
          <p className="small-title">SELL YOUR STYLE</p>
          <h2>Have Clothes You Don&apos;t Wear?</h2>
          <p>
            Turn your unused clothes into something valuable. Upload your
            clothes and let someone else give them a second life.
          </p>
        </div>
        <Link className="sell-button" to="/seller/dashboard">
          SELL YOUR CLOTHES
        </Link>
      </section>

      <section className="how" id="exchange">
        <p className="small-title">SIMPLE PROCESS</p>
        <h2 className="section-title">How RE-WEAR Works</h2>
        <div className="steps">
          {[
            ["Find Your Style", "Search for your favorite Eastern or Western pre-loved clothes."],
            ["Buy or Exchange", "Buy an item or exchange your clothes with another user."],
            ["Sell Your Clothes", "Upload clothes you no longer use and give them a new life."],
          ].map(([title, description], index) => (
            <article className="step" key={title}>
              <div className="number">{index + 1}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* All twelve account, marketplace, and administration forms are available below the landing content. */}
      <section className="landing-form-gallery" id="forms" aria-labelledby="landing-forms-title">
        <p className="small-title centered">RE-WEAR PORTALS</p>
        <h2 className="section-title" id="landing-forms-title">Choose a Form</h2>
        <p className="landing-form-description">
          Choose a stakeholder and select a form to open it.
        </p>
        {formNotice && (
          <p id="landing-form-notice" className={`landing-form-notice ${formNotice.type}`} role={formNotice.type === "error" ? "alert" : "status"}>
            {formNotice.text}
          </p>
        )}
        <div className="stakeholder-form-groups">
          <section className="stakeholder-form-group" aria-labelledby="buyer-forms-heading">
            <h3 id="buyer-forms-heading">Buyer Forms</h3>
            <div className="form-option-list">
              {[
                ["buyer-registration", "Buyer Registration"],
                ["buyer-login", "Buyer Login"],
                ["purchase", "Purchase Item"],
                ["exchange", "Exchange / Swap"],
              ].map(([id, label]) => (
                <Link
                  className={`form-option${formId === id ? " active" : ""}`}
                  to={`/forms/${id}`}
                  onClick={() => setFormNotice(null)}
                  key={id}
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
          <section className="stakeholder-form-group" aria-labelledby="seller-forms-heading">
            <h3 id="seller-forms-heading">Seller Forms</h3>
            <div className="form-option-list">
              {[
                ["seller-registration", "Seller Registration"],
                ["seller-login", "Seller Login"],
                ["add-product", "Add Product"],
                ["edit-product", "Edit Product"],
              ].map(([id, label]) => (
                <Link
                  className={`form-option${formId === id ? " active" : ""}`}
                  to={`/forms/${id}`}
                  onClick={() => setFormNotice(null)}
                  key={id}
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
          <section className="stakeholder-form-group" aria-labelledby="admin-forms-heading">
            <h3 id="admin-forms-heading">Admin Forms</h3>
            <div className="form-option-list">
              {[
                ["admin-login", "Admin Login"],
                ["add-category", "Add Category"],
                ["manage-product", "Manage Product"],
                ["manage-user", "Manage User"],
              ].map(([id, label]) => (
                <Link
                  className={`form-option${formId === id ? " active" : ""}`}
                  to={`/forms/${id}`}
                  onClick={() => setFormNotice(null)}
                  key={id}
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Footer navigation and storefront links. */}
      <footer>
        <div className="footer-container">
          <div>
            <h3>RE-WEAR</h3>
            <p>Buy. Sell. Exchange.<br />Fashion with a second life.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/#home">Home</Link></li>
              <li><Link to="/#shop" onClick={() => setSelectedStyle("all")}>Shop</Link></li>
              <li><Link to="/seller/dashboard">Sell</Link></li>
              <li><Link to="/buyer/dashboard">Exchange</Link></li>
            </ul>
          </div>
          <div>
            <h3>Categories</h3>
            <ul>
              <li><Link to="/#western" onClick={() => scrollToShop("western")}>Western Formal</Link></li>
              <li><Link to="/#eastern" onClick={() => scrollToShop("eastern")}>Eastern Formal</Link></li>
              <li><Link to="/#shop" onClick={() => scrollToShop()}>Pre-Loved Fashion</Link></li>
            </ul>
          </div>
        </div>
        <p className="copyright">© 2026 RE-WEAR | Buy · Sell · Exchange</p>
      </footer>

      {/* Cart dialog shows saved items and sends buyers to their account dashboard. */}
      {cartOpen && (
        <div
          className="modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCartOpen(false);
          }}
        >
          <section
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              className="close"
              aria-label="Close dialog"
              onClick={() => setCartOpen(false)}
            >
              ×
            </button>

            <h2 id="modal-title">Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <div>
                  {cart.map((item, index) => (
                    <div className="cart-item" key={`${item.name}-${index}`}>
                      <span>{item.name}</span>
                      <strong>Rs. {item.price.toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
                <Link
                  className="form-button cart-checkout"
                  to="/buyer/dashboard"
                  onClick={() => setCartOpen(false)}
                >
                  CONTINUE TO PURCHASE
                </Link>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

// Send signed-in users to their role dashboard; otherwise show the relevant login form.
function AccountEntry({ admin = false }) {
  const { currentUser, ready } = useAuth();
  if (!ready) return <p className="route-loading">Loading account...</p>;
  if (currentUser) return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  return <AuthPage admin={admin} />;
}

// Render the dashboard selected for the route's stakeholder role.
function DashboardEntry({ role }) {
  return <Dashboard role={role} />;
}

// Central route table for storefront, shared member auth, admin auth, and role dashboards.
const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/forms/:formId", element: <LandingPage /> },
  { path: "/auth", element: <AccountEntry /> },
  { path: "/admin/login", element: <AccountEntry admin /> },
  { path: "/buyer/dashboard", element: <DashboardEntry role="buyer" /> },
  { path: "/seller/dashboard", element: <DashboardEntry role="seller" /> },
  { path: "/admin/dashboard", element: <DashboardEntry role="admin" /> },
  { path: "/buyer/register", element: <Navigate to="/auth?mode=signup" replace /> },
  { path: "/buyer/login", element: <Navigate to="/auth" replace /> },
  { path: "/seller/register", element: <Navigate to="/auth?mode=signup" replace /> },
  { path: "/seller/login", element: <Navigate to="/auth" replace /> },
  { path: "/buyer/purchase", element: <Navigate to="/buyer/dashboard" replace /> },
  { path: "/buyer/exchange", element: <Navigate to="/buyer/dashboard" replace /> },
  { path: "/seller/products/add", element: <Navigate to="/seller/dashboard" replace /> },
  { path: "/seller/products/edit", element: <Navigate to="/seller/dashboard" replace /> },
  { path: "/admin/categories/add", element: <Navigate to="/admin/dashboard" replace /> },
  { path: "/admin/products", element: <Navigate to="/admin/dashboard" replace /> },
  { path: "/admin/users", element: <Navigate to="/admin/dashboard" replace /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;
