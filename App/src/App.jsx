import { useEffect, useState } from "react";
import { createBrowserRouter, Link, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import {
  readProducts,
  readStored,
  STORAGE_KEYS,
  writeStored,
} from "./data/store.js";
import "./App.css";

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
  const [slideIndex, setSlideIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [products] = useState(readProducts);
  const [cart, setCart] = useState(() => readStored(STORAGE_KEYS.cart, []));
  const [cartOpen, setCartOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  // Persist cart changes so they are available after navigation or a page refresh.
  useEffect(() => {
    writeStored(STORAGE_KEYS.cart, cart);
  }, [cart]);

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
