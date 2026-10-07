import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, readStored, writeStored } from "../data/store.js";

// Shared context lets pages read the current local demo account and perform account actions.
const AuthContext = createContext(null);
const ADMIN_EMAIL = "admin@rewear.local";
const ADMIN_PASSWORD = "RewearAdmin!2026";

// Hash passwords with a random salt before storing them in browser storage.
async function createPasswordRecord(password, salt = window.crypto.getRandomValues(new Uint8Array(16))) {
  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const digest = await window.crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
    key,
    256,
  );
  return {
    passwordSalt: Array.from(salt, (byte) => byte.toString(16).padStart(2, "0")).join(""),
    passwordHash: Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
    ).join(""),
  };
}

// Recreate the password hash with the saved salt when checking a login attempt.
async function verifyPassword(password, saltHex) {
  const salt = Uint8Array.from(
    saltHex.match(/.{2}/g) || [],
    (byte) => Number.parseInt(byte, 16),
  );
  return createPasswordRecord(password, salt);
}

// Provide demo account setup, signup/login, session restoration, and logout behavior.
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() =>
    readStored(STORAGE_KEYS.session, null),
  );
  const [ready, setReady] = useState(false);

  // Ensure a local demo admin exists and restore only sessions with active accounts.
  useEffect(() => {
    let cancelled = false;

    async function initializeDemoAdmin() {
      const users = readStored(STORAGE_KEYS.users, []);
      const demoAdmin = users.find((user) => user.role === "admin");
      if (!demoAdmin) {
        const credential = await createPasswordRecord(ADMIN_PASSWORD);
        users.push({
          id: "rewear-demo-admin",
          name: "RE-WEAR Admin",
          email: ADMIN_EMAIL,
          ...credential,
          role: "admin",
          status: "active",
        });
        writeStored(STORAGE_KEYS.users, users);
      } else if (!demoAdmin.passwordSalt) {
        const credential = await createPasswordRecord(ADMIN_PASSWORD);
        writeStored(
          STORAGE_KEYS.users,
          users.map((user) => user.id === demoAdmin.id ? { ...user, ...credential } : user),
        );
      }
      const session = readStored(STORAGE_KEYS.session, null);
      if (session) {
        const account = users.find((user) => user.id === session.id);
        if (!account || account.status !== "active") {
          window.localStorage.removeItem(STORAGE_KEYS.session);
          if (!cancelled) setCurrentUser(null);
        } else if (!cancelled) {
          setCurrentUser({
            id: account.id,
            name: account.name,
            email: account.email,
            role: account.role,
          });
        }
      }
      if (!cancelled) setReady(true);
    }

    initializeDemoAdmin().catch((error) => {
      console.error("Could not initialize local RE-WEAR accounts.", error);
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Create a buyer or seller account and establish its local session.
  async function signUp({ name, email, password, role }) {
    if (!["buyer", "seller"].includes(role)) {
      throw new Error("Choose either a buyer or seller account.");
    }
    const normalizedEmail = email.trim().toLowerCase();
    const users = readStored(STORAGE_KEYS.users, []);
    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }
    const credential = await createPasswordRecord(password);
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      ...credential,
      role,
      status: "active",
    };
    writeStored(STORAGE_KEYS.users, [...users, user]);
    const session = { id: user.id, name: user.name, email: user.email, role };
    writeStored(STORAGE_KEYS.session, session);
    setCurrentUser(session);
    return session;
  }

  // Verify account credentials and enforce the requested account role when provided.
  async function login({ email, password, role }) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readStored(STORAGE_KEYS.users, []);
    const user = users.find((account) => account.email === normalizedEmail);
    const credential = user?.passwordSalt
      ? await verifyPassword(password, user.passwordSalt)
      : null;
    if (!user || user.passwordHash !== credential?.passwordHash) {
      throw new Error("Email or password is incorrect.");
    }
    if (role && user.role !== role) {
      throw new Error(`This account is not registered as an ${role}.`);
    }
    if (user.status !== "active") {
      throw new Error("This account is not active. Contact the administrator.");
    }
    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    writeStored(STORAGE_KEYS.session, session);
    setCurrentUser(session);
    return session;
  }

  // Clear the saved session and update the app's current account.
  function logout() {
    window.localStorage.removeItem(STORAGE_KEYS.session);
    setCurrentUser(null);
  }

  const value = useMemo(
    () => ({ currentUser, ready, signUp, login, logout }),
    [currentUser, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Expose authentication context and report accidental use outside its provider.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
