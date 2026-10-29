import blazerImage from "../../blazer.jpg";
import eveningImage from "../../eveningg.jpg";
import whiteShirtImage from "../../white.jpg";
import trouserImage from "../../trouser.jpg";
import lawnImage from "../../lawn.jpg";
import shalwarImage from "../../shalwar.jpg";
import embroideredDressImage from "../../formalembroided.jfif";
import kurtaImage from "../../festivekurta.jfif";

// Central localStorage keys keep user accounts and marketplace records consistent.
export const STORAGE_KEYS = {
  users: "rewear.users",
  session: "rewear.session",
  products: "rewear.products",
  categories: "rewear.categories",
  categoryDescriptions: "rewear.categoryDescriptions",
  cart: "rewear.cart",
  orders: "rewear.orders",
  exchanges: "rewear.exchanges",
  complaints: "rewear.complaints",
};

// Default storefront inventory seeds the marketplace when no saved product list exists.
export const initialProducts = [
  { name: "Black Formal Blazer", category: "Western Formal", style: "western", price: 4500, image: blazerImage, alt: "Black formal blazer" },
  { name: "Elegant Evening Dress", category: "Western Formal", style: "western", price: 5200, image: eveningImage, alt: "Elegant evening dress" },
  { name: "Classic White Shirt", category: "Western Formal", style: "western", price: 2200, image: whiteShirtImage, alt: "Classic white shirt" },
  { name: "Classic Formal Trousers", category: "Western Formal", style: "western", price: 2800, image: trouserImage, alt: "Classic formal trousers" },
  { name: "Embroidered Lawn Suit", category: "Eastern Formal", style: "eastern", price: 3800, image: lawnImage, alt: "Embroidered lawn suit" },
  { name: "Elegant Shalwar Kameez", category: "Eastern Formal", style: "eastern", price: 4200, image: shalwarImage, alt: "Elegant shalwar kameez" },
  { name: "Embroidered Formal Dress", category: "Eastern Formal", style: "eastern", price: 5000, image: embroideredDressImage, alt: "Embroidered formal dress" },
  { name: "Premium Festive Kurta", category: "Eastern Formal", style: "eastern", price: 3500, image: kurtaImage, alt: "Premium festive kurta" },
].map((product, index) => ({
  ...product,
  id: `seed-${index + 1}`,
  sellerId: "rewear-demo-seller",
  status: "active",
}));

// Read a saved value, return its supplied default when missing, and report invalid JSON.
export function readStored(key, fallback) {
  const value = window.localStorage.getItem(key);
  if (value === null) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Could not read saved RE-WEAR data for "${key}".`, { cause: error });
  }
}

// Save structured app data as JSON in the browser's localStorage.
export function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new Error(`Could not save RE-WEAR data for "${key}".`, { cause: error });
  }
}

// Load or save the marketplace product list through the shared storage helpers.
export function readProducts() {
  return readStored(STORAGE_KEYS.products, initialProducts);
}

export function writeProducts(products) {
  writeStored(STORAGE_KEYS.products, products);
}
