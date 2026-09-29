jsx
import { useState } from "react";
import "./App.css";

import BuyerRegistration from "./forms/BuyerRegistration";
import BuyerLogin from "./forms/BuyerLogin";
import BuyerPurchase from "./forms/BuyerPurchase";
import BuyerExchange from "./forms/BuyerExchange";

import SellerRegistration from "./forms/SellerRegistration";
import SellerLogin from "./forms/SellerLogin";
import SellerAddProduct from "./forms/SellerAddProduct";
import SellerEditProduct from "./forms/SellerEditProduct";

import AdminLogin from "./forms/AdminLogin";
import AdminAddCategory from "./forms/AdminAddCategory";
import AdminManageUser from "./forms/AdminManageUser";
import AdminManageProduct from "./forms/AdminManageProduct";

function App() {
  const [selectedStakeholder, setSelectedStakeholder] = useState("Buyer");
  const [selectedForm, setSelectedForm] = useState("Registration");

  const forms = {
    Buyer: [
      "Registration",
      "Login",
      "Purchase",
      "Exchange / Swap",
    ],

    Seller: [
      "Registration",
      "Login",
      "Add Product",
      "Edit Product",
    ],

    Admin: [
      "Login",
      "Add Category",
      "Manage User",
      "Manage Product",
    ],
  };

  const handleStakeholderChange = (stakeholder) => {
    setSelectedStakeholder(stakeholder);

    if (stakeholder === "Buyer") {
      setSelectedForm("Registration");
    }

    if (stakeholder === "Seller") {
      setSelectedForm("Registration");
    }

    if (stakeholder === "Admin") {
      setSelectedForm("Login");
    }
  };

  const renderSelectedForm = () => {
    if (selectedStakeholder === "Buyer") {
      if (selectedForm === "Registration") {
        return <BuyerRegistration />;
      }

      if (selectedForm === "Login") {
        return <BuyerLogin />;
      }

      if (selectedForm === "Purchase") {
        return <BuyerPurchase />;
      }

      if (selectedForm === "Exchange / Swap") {
        return <BuyerExchange />;
      }
    }

    if (selectedStakeholder === "Seller") {
      if (selectedForm === "Registration") {
        return <SellerRegistration />;
      }

      if (selectedForm === "Login") {
        return <SellerLogin />;
      }

      if (selectedForm === "Add Product") {
        return <SellerAddProduct />;
      }

      if (selectedForm === "Edit Product") {
        return <SellerEditProduct />;
      }
    }

    if (selectedStakeholder === "Admin") {
      if (selectedForm === "Login") {
        return <AdminLogin />;
      }

      if (selectedForm === "Add Category") {
        return <AdminAddCategory />;
      }

      if (selectedForm === "Manage User") {
        return <AdminManageUser />;
      }

      if (selectedForm === "Manage Product") {
        return <AdminManageProduct />;
      }
    }

    return null;
  };

  return (
    <div className="app">

      <header className="header">
        <h1>RE-WARE</h1>
        <p>Buy • Sell • Swap Clothes</p>
      </header>


      {/* STAKEHOLDER BUTTONS */}

      <div className="stakeholder-buttons">

        <button
          className={
            selectedStakeholder === "Buyer"
              ? "active"
              : ""
          }
          onClick={() =>
            handleStakeholderChange("Buyer")
          }
        >
          👤 Buyer / Customer
        </button>


        <button
          className={
            selectedStakeholder === "Seller"
              ? "active"
              : ""
          }
          onClick={() =>
            handleStakeholderChange("Seller")
          }
        >
          🏪 Seller
        </button>


        <button
          className={
            selectedStakeholder === "Admin"
              ? "active"
              : ""
          }
          onClick={() =>
            handleStakeholderChange("Admin")
          }
        >
          🛠️ Admin
        </button>

      </div>


      {/* FORM BUTTONS */}

      <div className="form-navigation">

        {forms[selectedStakeholder].map((formName) => (

          <button
            key={formName}
            className={
              selectedForm === formName
                ? "form-active"
                : ""
            }
            onClick={() =>
              setSelectedForm(formName)
            }
          >
            {formName}
          </button>

        ))}

      </div>


      {/* TITLE */}

      <div className="section-title">

        <h2>
          {selectedStakeholder} - {selectedForm}
        </h2>

        <p>
          Fill out the {selectedForm.toLowerCase()} form.
        </p>

      </div>


      {/* ONLY ONE FORM SHOWS */}

      <div className="forms-container">
        {renderSelectedForm()}
      </div>

    </div>
  );
}

export default App;