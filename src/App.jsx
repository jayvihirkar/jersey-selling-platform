import { useEffect, useMemo, useState } from "react";
import "./App.css";

const ADMIN_EMAIL = "jayvihirkar7@gmail.com";
const ADMIN_PASSWORD = "Admin@123";

const initialProducts = [
  {
    id: "vp-01",
    name: "Manchester United Third 25/26",
    club: "Manchester United",
    price: 10,
    rating: 4.8,
    tag: "New",
    fit: "Slim Fit",
    number: "8",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyYXROSk3hl22KqYkTmcK0Am7h3ao5K7Krmw&s",
  },
  {
    id: "vp-02",
    name: "Manchester City Away 25/26",
    club: "Manchester City",
    price: 10,
    rating: 4.9,
    tag: "New",
    fit: "Slim Fit",
    number: "9",
    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/780350/02/fnd/IND/fmt/png/Manchester-City-25/26-Away-Men%E2%80%99s-Replica-Jersey",
  },
  {
    id: "vp-03",
    name: "Liverpool FC Home 25/26",
    club: "Liverpool FC",
    price: 1000,
    rating: 4.7,
    tag: "New",
    fit: "Regular Fit",
    number: "8",
    image: "https://store.liverpoolfc.com/media/catalog/product/cache/a8585741965541bd35c89e2a8929f2a6/j/v/jv6423_1_apparel_photography_front_center_view_white.jpg",
  },
  {
    id: "vp-04",
    name: "Arsenal FC Home 25/26",
    club: "Arsenal FC",
    price: 1000,
    rating: 4.6,
    tag: "New",
    fit: "Relaxed Fit",
    number: "8",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjydZReqdAaQH6CIMPZOh_g88ZljT-cILPUk3KVZS3mP_xw1B5JbRpsUUDxhjRQrjk8bnwoYnIAmP6uKDYQI3TApOT18cyy6fdtSWB96tB7FVb9HqnfbywnUI7D33kA9uHpvB4AUkoZKNJHKjnitkl42w9V8w5rskhaJvasdejrUcEcI-v8le2yN4mJhqa-/s1600/arsenal-25-26-home-kit%20%2814%29.jpg",
  },
  {
    id: "vp-05",
    name: "Arsenal FC Third 25/26",
    club: "Arsenal FC",
    price: 1000,
    rating: 4.8,
    tag: "Best Seller",
    fit: "Regular Fit",
    number: "25",
    image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a4626c160bcf4315b3f3bc3240b7a9f0_9366/Arsenal_25-26_Third_Jersey_White_JI9556_01_laydown.jpg",
  },
  {
    id: "vp-06",
    name: "Manchester United Home 25/26",
    club: "Manchester United",
    price: 1000,
    rating: 4.9,
    tag: "Best Seller",
    fit: "Regular Fit",
    number: "22",
    image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/9ae59d2a8c6249c9a3b1fefc31a9d595_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_21_model.jpg",
  },
];

const perkHighlights = [
  { title: "Authentic stitching", desc: "Pro-grade fabric and embossed crests." },
  { title: "Fast fulfillment", desc: "Ships in 24 hours with live tracking." },
  { title: "Easy returns", desc: "30-day returns and instant exchanges." },
];

const paymentOptions = [
  { id: "card", label: "Card" },
  { id: "upi", label: "UPI" },
  { id: "razorpay", label: "Razorpay" },
  { id: "cod", label: "Cash on delivery" },
];

const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function App() {
  const [catalog, setCatalog] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [upiMode, setUpiMode] = useState("qr");
  const [upiId, setUpiId] = useState("");
  const [upiNotice, setUpiNotice] = useState({ type: "", message: "" });
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [razorpayNotice, setRazorpayNotice] = useState({
    type: "",
    message: "",
  });
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [route, setRoute] = useState(window.location.pathname);
  const [theme, setTheme] = useState("light");
  const [showProfile, setShowProfile] = useState(false);

  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminNotice, setAdminNotice] = useState({ type: "", message: "" });
  const [imageUrlMessage, setImageUrlMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    club: "",
    price: "",
    rating: "",
    tag: "",
    fit: "",
    number: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!imageUrlMessage) {
      return;
    }
    const timer = setTimeout(() => setImageUrlMessage(""), 2200);
    return () => clearTimeout(timer);
  }, [imageUrlMessage]);

  useEffect(() => {
    const handlePop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const productMap = useMemo(
    () => Object.fromEntries(catalog.map((product) => [product.id, product])),
    [catalog]
  );

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = productMap[item.id];
          if (!product) {
            return null;
          }
          return { ...product, qty: item.qty };
        })
        .filter(Boolean),
    [cart, productMap]
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 12 : 0;
  const tax = subtotal * 0.08;
  const promoNormalized = promoCode.trim().toUpperCase();
  const discountRate = promoNormalized === "KICKOFF10" ? 0.1 : 0;
  const discount = subtotal * discountRate;
  const total = Math.max(subtotal + shipping + tax - discount, 0);
  const isPromoValid = promoNormalized === "KICKOFF10";
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || "";
  const hasRazorpayKey = Boolean(razorpayKey);
  const formattedTotal = formatCurrency(total);
  const paymentActionLabel = (() => {
    if (paymentMethod === "razorpay") {
      if (razorpayLoading) {
        return "Loading Razorpay...";
      }
      if (!hasRazorpayKey) {
        return "Add Razorpay key to continue";
      }
      return `Continue to Razorpay (${formattedTotal})`;
    }
    if (paymentMethod === "upi") {
      return upiMode === "id"
        ? `Confirm payment (${formattedTotal})`
        : `I've paid ${formattedTotal}`;
    }
    if (paymentMethod === "cod") {
      return "Place order";
    }
    return `Pay ${formattedTotal}`;
  })();
  const isPaymentActionDisabled =
    cartItems.length === 0 ||
    (paymentMethod === "upi" &&
      upiMode === "id" &&
      (!upiId.trim() || upiNotice.type !== "success")) ||
    (paymentMethod === "razorpay" && (!hasRazorpayKey || razorpayLoading));
  const featuredProduct = catalog[0];
  const isAdminRoute = route === "/admin" || route === "/admin/";

  const addToCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(item.qty + delta, 0) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const applyPromo = () => {
    setPromoCode(promoInput.trim().toUpperCase());
  };

  const handlePaymentMethodChange = (event) => {
    const next = event.target.value;
    setPaymentMethod(next);
    if (next !== "upi") {
      setUpiNotice({ type: "", message: "" });
    }
    if (next !== "razorpay") {
      setRazorpayNotice({ type: "", message: "" });
      setRazorpayLoading(false);
    }
  };

  const handleUpiModeChange = (mode) => {
    setUpiMode(mode);
    setUpiNotice({ type: "", message: "" });
  };

  const handleUpiIdChange = (event) => {
    setUpiId(event.target.value);
    if (upiNotice.message) {
      setUpiNotice({ type: "", message: "" });
    }
  };

  const handleSendUpiRequest = () => {
    const trimmed = upiId.trim();
    if (!trimmed) {
      setUpiNotice({ type: "error", message: "Enter a valid UPI ID." });
      return;
    }
    setUpiNotice({
      type: "success",
      message: `Payment request sent to ${trimmed}.`,
    });
  };

  const handleCustomerChange = (field) => (event) => {
    const value = event.target.value;
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-checkout")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-checkout";
      script.src = RAZORPAY_CHECKOUT_URL;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRazorpayPayment = async () => {
    setRazorpayNotice({ type: "", message: "" });
    if (!hasRazorpayKey) {
      setRazorpayNotice({
        type: "error",
        message: "Add VITE_RAZORPAY_KEY in .env to enable Razorpay checkout.",
      });
      return;
    }

    setRazorpayLoading(true);
    const scriptReady = await loadRazorpayScript();
    if (!scriptReady || !window.Razorpay) {
      setRazorpayLoading(false);
      setRazorpayNotice({
        type: "error",
        message: "Razorpay failed to load. Please try again.",
      });
      return;
    }

    const amountInPaise = Math.round(total * 100);
    if (amountInPaise <= 0) {
      setRazorpayLoading(false);
      setRazorpayNotice({
        type: "error",
        message: "Cart total must be greater than zero.",
      });
      return;
    }

    try {
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `tfhd_${Date.now()}`,
          notes: {
            items: cartItems.map((item) => `${item.name} x${item.qty}`),
            customer: customer.name || "Guest",
          },
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Unable to create Razorpay order.");
      }

      const orderData = await orderResponse.json();
      setRazorpayLoading(false);

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "TFHD Jersey Store",
        description: "Jersey order",
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        notes: {
          address: customer.address || "Not provided",
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyResponse.json().catch(() => ({}));
            if (!verifyResponse.ok || !verifyData.valid) {
              throw new Error(
                verifyData.error || "Payment verification failed."
              );
            }
            setRazorpayNotice({
              type: "success",
              message: `Payment verified. Payment ID: ${response.razorpay_payment_id}`,
            });
          } catch (error) {
            setRazorpayNotice({
              type: "error",
              message:
                error?.message ||
                "Payment verification failed. Please contact support.",
            });
          }
        },
        modal: {
          ondismiss: () => {
            setRazorpayNotice({
              type: "error",
              message: "Razorpay checkout closed before completion.",
            });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        const errorMessage =
          response.error?.description || "Payment failed. Please try again.";
        setRazorpayNotice({ type: "error", message: errorMessage });
      });
      paymentObject.open();
    } catch (error) {
      setRazorpayLoading(false);
      setRazorpayNotice({
        type: "error",
        message: error?.message || "Unable to start Razorpay checkout.",
      });
    }
  };

  const handlePaymentAction = () => {
    if (paymentMethod === "razorpay") {
      handleRazorpayPayment();
    }
  };

  const handleAdminLogin = (event) => {
    event.preventDefault();
    if (adminEmail.trim() === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
      setAdminAuthed(true);
      setAdminNotice({ type: "", message: "" });
    } else {
      setAdminNotice({
        type: "error",
        message: "Incorrect email or password.",
      });
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthed(false);
    setAdminEmail("");
    setAdminPassword("");
    setAdminNotice({ type: "", message: "" });
    setEditingId(null);
    setNewProduct({
      name: "",
      club: "",
      price: "",
      rating: "",
      tag: "",
      fit: "",
      number: "",
      imageUrl: "",
    });
    setImagePreview("");
    setImageUrlMessage("");
  };

  const handleNewProductChange = (field) => (event) => {
    const value = event.target.value;
    setNewProduct((prev) => ({ ...prev, [field]: value }));
    if (field === "imageUrl") {
      setImagePreview("");
    }
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImagePreview("");
      return;
    }
    setNewProduct((prev) => ({ ...prev, imageUrl: "" }));
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result ? String(reader.result) : "");
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlPaste = (event) => {
    const text = event.clipboardData?.getData("text");
    if (!text) {
      return;
    }
    event.preventDefault();
    setImagePreview("");
    setNewProduct((prev) => ({ ...prev, imageUrl: text.trim() }));
    setImageUrlMessage("Pasted from clipboard.");
  };

  const handlePasteImageUrlClick = async () => {
    if (!navigator.clipboard?.readText) {
      setImageUrlMessage("Clipboard access not supported. Use Ctrl+V.");
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        setImageUrlMessage("Clipboard is empty.");
        return;
      }
      setImagePreview("");
      setNewProduct((prev) => ({ ...prev, imageUrl: text.trim() }));
      setImageUrlMessage("Pasted from clipboard.");
    } catch (error) {
      setImageUrlMessage("Clipboard permission denied.");
    }
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    setAdminNotice({ type: "", message: "" });

    const name = newProduct.name.trim();
    const priceValue = Number.parseFloat(newProduct.price);

    if (!name || !Number.isFinite(priceValue)) {
      setAdminNotice({
        type: "error",
        message: "Please provide at least a product name and valid price.",
      });
      return;
    }

    const ratingValue = Number.parseFloat(newProduct.rating);
    const imageValue = imagePreview || newProduct.imageUrl.trim();

    if (editingId) {
      setCatalog((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name,
                club: newProduct.club.trim() || "Custom Club",
                price: priceValue,
                rating: Number.isFinite(ratingValue) ? ratingValue : 4.6,
                tag: newProduct.tag.trim() || "New",
                fit: newProduct.fit.trim() || "Regular Fit",
                number: newProduct.number.trim() || "00",
                image: imageValue,
              }
            : item
        )
      );
      setEditingId(null);
      setAdminNotice({
        type: "success",
        message: "Product updated.",
      });
    } else {
      const newEntry = {
        id: `vp-${Date.now()}`,
        name,
        club: newProduct.club.trim() || "Custom Club",
        price: priceValue,
        rating: Number.isFinite(ratingValue) ? ratingValue : 4.6,
        tag: newProduct.tag.trim() || "New",
        fit: newProduct.fit.trim() || "Regular Fit",
        number: newProduct.number.trim() || "00",
        image: imageValue,
      };
      setCatalog((prev) => [newEntry, ...prev]);
      setAdminNotice({
        type: "success",
        message: "Product added to the catalog.",
      });
    }

    setNewProduct({
      name: "",
      club: "",
      price: "",
      rating: "",
      tag: "",
      fit: "",
      number: "",
      imageUrl: "",
    });
    setImagePreview("");
  };

  const handleEditStart = (product) => {
    setEditingId(product.id);
    setAdminNotice({ type: "", message: "" });
    setImageUrlMessage("");
    setNewProduct({
      name: product.name,
      club: product.club,
      price: String(product.price),
      rating: String(product.rating),
      tag: product.tag,
      fit: product.fit,
      number: product.number,
      imageUrl: product.image && !product.image.startsWith("data:")
        ? product.image
        : "",
    });
    setImagePreview(
      product.image && product.image.startsWith("data:") ? product.image : ""
    );
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setNewProduct({
      name: "",
      club: "",
      price: "",
      rating: "",
      tag: "",
      fit: "",
      number: "",
      imageUrl: "",
    });
    setImagePreview("");
    setAdminNotice({ type: "", message: "" });
    setImageUrlMessage("");
  };

  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">
          <div className="logo-mark">TFHD</div>
          <div>
            <p className="brand-title">TFHD Jersey Store</p>
            <p className="brand-sub">Premium Jerseys at cheap rates</p>
          </div>
        </div>

        {!isAdminRoute ? (
          <nav className="nav-links">
            <a href="#drops">New drops</a>
            <a href="#catalog">Club shop</a>
            <a href="#checkout">Checkout</a>
            <a href="#support">Support</a>
          </nav>
        ) : (
          <div className="admin-path">Admin / Catalog</div>
        )}

        <div className="header-actions">
          {!isAdminRoute ? (
            <>
              <button className="btn ghost" onClick={() => setShowProfile(true)}>
                Profile
              </button>
              <button className="btn ghost" onClick={() => navigate("/admin")}>
                Admin
              </button>
              <button className="btn cart-pill">
                Cart
                <span className="pill-count">{itemCount}</span>
              </button>
            </>
          ) : (
            <>
              <button className="btn secondary" onClick={() => navigate("/")}>
                Back to store
              </button>
              {adminAuthed ? (
                <button className="btn ghost" onClick={handleAdminLogout}>
                  Log out
                </button>
              ) : null}
              <button className="btn ghost" onClick={() => setShowProfile(true)}>
                Profile
              </button>
            </>
          )}
        </div>
      </header>

      {showProfile ? (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowProfile(false)}
        >
          <div className="profile-panel" onClick={(event) => event.stopPropagation()}>
            <div className="panel-head">
              <div>
                <h3>Profile</h3>
                <p>Manage your preferences and appearance.</p>
              </div>
              <button className="btn icon" onClick={() => setShowProfile(false)}>
                x
              </button>
            </div>

            <div className="profile-section">
              <h4>Appearance</h4>
              <div className="appearance-options">
                {[
                  { id: "light", label: "Light" },
                  { id: "dark", label: "Dark" },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`appearance-option ${
                      theme === option.id ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={option.id}
                      checked={theme === option.id}
                      onChange={() => setTheme(option.id)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="btn primary full" onClick={() => setShowProfile(false)}>
              Done
            </button>
          </div>
        </div>
      ) : null}

      {isAdminRoute ? (
        <main className="admin-shell">
          <section className="admin-header">
            <div>
              <p className="eyebrow">Admin</p>
              <h1>Catalog management</h1>
              <p className="muted">
                Log in to add new jerseys, upload images, and update product
                details.
              </p>
            </div>
          </section>

          {!adminAuthed ? (
            <section className="panel admin-login">
              <h3>Admin sign in</h3>
              <p className="muted">
                Access is locked to your admin email and password.
              </p>
              <form className="form-stack" onSubmit={handleAdminLogin}>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="jayvihirkar7@gmail.com"
                    value={adminEmail}
                    onChange={(event) => setAdminEmail(event.target.value)}
                  />
                </div>
                <div>
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Admin@123"
                    value={adminPassword}
                    onChange={(event) => setAdminPassword(event.target.value)}
                  />
                </div>
                <button className="btn primary" type="submit">
                  Sign in
                </button>
              </form>
              {adminNotice.message ? (
                <p className={`form-message ${adminNotice.type}`}>
                  {adminNotice.message}
                </p>
              ) : null}
            </section>
          ) : (
            <>
              <section className="panel admin-form">
                <h3>{editingId ? "Edit product" : "Add a product"}</h3>
                <p className="muted">
                  Upload an image or paste a URL, then fill the jersey details.
                </p>
                <form className="form-grid" onSubmit={handleAddProduct}>
                  <div>
                    <label>Product name</label>
                    <input
                      type="text"
                      placeholder="Matchday Classic 27"
                      value={newProduct.name}
                      onChange={handleNewProductChange("name")}
                    />
                  </div>
                  <div>
                    <label>Club</label>
                    <input
                      type="text"
                      placeholder="TFHD Jersey Store"
                      value={newProduct.club}
                      onChange={handleNewProductChange("club")}
                    />
                  </div>
                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="120"
                      value={newProduct.price}
                      onChange={handleNewProductChange("price")}
                    />
                  </div>
                  <div>
                    <label>Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="4.8"
                      value={newProduct.rating}
                      onChange={handleNewProductChange("rating")}
                    />
                  </div>
                  <div>
                    <label>Tag</label>
                    <input
                      type="text"
                      placeholder="Limited"
                      value={newProduct.tag}
                      onChange={handleNewProductChange("tag")}
                    />
                  </div>
                  <div>
                    <label>Fit</label>
                    <input
                      type="text"
                      placeholder="Regular Fit"
                      value={newProduct.fit}
                      onChange={handleNewProductChange("fit")}
                    />
                  </div>
                  <div>
                    <label>Jersey number</label>
                    <input
                      type="text"
                      placeholder="10"
                      value={newProduct.number}
                      onChange={handleNewProductChange("number")}
                    />
                  </div>
                  <div>
                    <label>Image URL</label>
                    <div className="input-inline">
                      <input
                        type="url"
                        inputMode="url"
                        placeholder="https://..."
                        value={newProduct.imageUrl}
                        onChange={handleNewProductChange("imageUrl")}
                        onPaste={handleImageUrlPaste}
                      />
                      <button
                        type="button"
                        className="btn secondary small"
                        onClick={handlePasteImageUrlClick}
                      >
                        Paste
                      </button>
                    </div>
                    <p className="helper-text">
                      Paste a direct image link (ends with .jpg or .png).
                    </p>
                    {imageUrlMessage ? (
                      <p className="helper-text">{imageUrlMessage}</p>
                    ) : null}
                  </div>
                  <div className="span-two">
                    <label>Upload image</label>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} />
                    <p className="helper-text">Upload accepts local image files only.</p>
                  </div>
                  <div className="span-two admin-actions">
                    <button className="btn primary" type="submit">
                      {editingId ? "Save changes" : "Add to catalog"}
                    </button>
                    {editingId ? (
                      <button
                        className="btn secondary"
                        type="button"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    ) : null}
                    {adminNotice.message ? (
                      <p className={`form-message ${adminNotice.type}`}>
                        {adminNotice.message}
                      </p>
                    ) : null}
                  </div>
                </form>

                {imagePreview || newProduct.imageUrl ? (
                  <div className="admin-image-preview">
                    <img
                      src={imagePreview || newProduct.imageUrl}
                      alt="Preview of uploaded jersey"
                    />
                  </div>
                ) : null}
              </section>

              <section className="panel admin-list">
                <div className="panel-head">
                  <div>
                    <h3>Catalog preview</h3>
                    <p>{catalog.length} items</p>
                  </div>
                </div>
                <div className="admin-grid">
                  {catalog.map((product) => (
                    <div className="admin-preview-card" key={product.id}>
                      <div className="admin-thumb">
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <span>{product.number}</span>
                        )}
                      </div>
                      <div>
                        <p className="admin-name">{product.name}</p>
                        <p className="muted">{product.club}</p>
                      </div>
                      <p className="admin-price">{formatCurrency(product.price)}</p>
                      <button
                        className="btn ghost small"
                        type="button"
                        onClick={() => handleEditStart(product)}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      ) : (
        <main>
          <section className="hero" id="drops">
            <div className="hero-copy">
              <p className="eyebrow">2026 street kits now live</p>
              <h1>Jerseys built for matchday and every day.</h1>
              <p className="hero-sub">
                Curated club drops, stitched crests, and limited colorways.
                Build your matchday look with premium fabric and custom
                personalization.
              </p>
              <div className="hero-actions">
                <button className="btn primary">Shop new drops</button>
                <button className="btn secondary">Customize a kit</button>
              </div>
              <div className="hero-stats">
                <div>
                  <p className="stat-number">24h</p>
                  <p className="stat-label">Express shipping</p>
                </div>
                <div>
                  <p className="stat-number">4.9</p>
                  <p className="stat-label">Average rating</p>
                </div>
                <div>
                  <p className="stat-number">120+</p>
                  <p className="stat-label">Limited drops</p>
                </div>
              </div>
            </div>

            <div className="hero-card">
              {featuredProduct ? (
                <>
                  <div className="hero-visual">
                    {featuredProduct.image ? (
                      <img
                        src={featuredProduct.image}
                        alt={`${featuredProduct.name} jersey`}
                      />
                    ) : (
                      <div className="hero-placeholder">
                        <p className="hero-number">{featuredProduct.number}</p>
                        <p className="hero-club">{featuredProduct.club}</p>
                      </div>
                    )}
                  </div>
                  <div className="hero-card-body">
                    <div>
                      <p className="card-title">{featuredProduct.name}</p>
                      <p className="card-sub">{featuredProduct.fit}</p>
                    </div>
                    <div className="card-price">
                      {formatCurrency(featuredProduct.price)}
                    </div>
                  </div>
                  <button
                    className="btn primary full"
                    onClick={() => addToCart(featuredProduct.id)}
                  >
                    Add to cart
                  </button>
                </>
              ) : (
                <div className="empty-state">
                  <p>No products yet. Add one from the admin panel.</p>
                </div>
              )}
            </div>
          </section>

          <section className="perk-row">
            {perkHighlights.map((perk) => (
              <div className="perk-card" key={perk.title}>
                <h3>{perk.title}</h3>
                <p>{perk.desc}</p>
              </div>
            ))}
          </section>

          <section className="catalog" id="catalog">
            <div className="section-head">
              <div>
                <p className="eyebrow">Curated for collectors</p>
                <h2>Top sellers this week</h2>
              </div>
              <div className="filter-row">
                <button className="btn chip active">All drops</button>
                <button className="btn chip">Classic</button>
                <button className="btn chip">Street</button>
                <button className="btn chip">Limited</button>
              </div>
            </div>

            <div className="product-grid">
              {catalog.map((product, index) => {
                const inCart = cart.find((item) => item.id === product.id);
                return (
                  <article
                    className="product-card"
                    key={product.id}
                    style={{ "--delay": `${index * 0.08}s` }}
                  >
                    <div className="product-visual">
                      {product.image ? (
                        <img src={product.image} alt={`${product.name} jersey`} />
                      ) : (
                        <div className="product-placeholder">
                          <p className="product-number">{product.number}</p>
                          <p className="product-club">{product.club}</p>
                        </div>
                      )}
                      <span className="badge">{product.tag}</span>
                    </div>
                    <div className="product-info">
                      <div>
                        <h3>{product.name}</h3>
                        <p className="product-meta">
                          {product.fit} | Rating {product.rating}
                        </p>
                      </div>
                      <div className="product-footer">
                        <p className="price">{formatCurrency(product.price)}</p>
                        <button
                          className="btn primary small"
                          onClick={() => addToCart(product.id)}
                        >
                          {inCart ? "Add another" : "Add to cart"}
                        </button>
                      </div>
                      {inCart ? (
                        <p className="cart-note">
                          In cart: {inCart.qty} jersey{inCart.qty > 1 ? "s" : ""}
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="checkout" id="checkout">
            <div className="panel cart-panel">
              <div className="panel-head">
                <div>
                  <h3>Your cart</h3>
                  <p>{itemCount} items</p>
                </div>
                <button className="btn ghost small" onClick={() => setCart([])}>
                  Clear cart
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="empty-state">
                  <p>Your cart is empty.</p>
                  <p>Pick a jersey and it will show up here instantly.</p>
                </div>
              ) : (
                <div className="cart-list">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-thumb">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span>{item.number}</span>
                        )}
                      </div>
                      <div className="cart-info">
                        <h4>{item.name}</h4>
                        <p>
                          {item.club} | Size M | {item.fit}
                        </p>
                        <div className="qty-controls">
                          <button
                            className="btn qty"
                            onClick={() => updateQty(item.id, -1)}
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            -
                          </button>
                          <span>{item.qty}</span>
                          <button
                            className="btn qty"
                            onClick={() => updateQty(item.id, 1)}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="cart-price">
                        {formatCurrency(item.price * item.qty)}
                      </div>
                      <button
                        className="btn icon"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="panel-summary">
                <div>
                  <p>Subtotal</p>
                  <p>{formatCurrency(subtotal)}</p>
                </div>
                <div>
                  <p>Shipping</p>
                  <p>{formatCurrency(shipping)}</p>
                </div>
                <div>
                  <p>Tax</p>
                  <p>{formatCurrency(tax)}</p>
                </div>
                <div className="summary-total">
                  <p>Total</p>
                  <p>{formatCurrency(total)}</p>
                </div>
              </div>
            </div>

            <div className="panel payment-panel">
              <div className="panel-head">
                <div>
                  <h3>Payment options</h3>
                  <p>Secure checkout with multiple payment choices.</p>
                </div>
                <span className="secure-pill">Secure</span>
              </div>

              <div className="payment-options">
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`payment-option ${
                      paymentMethod === option.id ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.id}
                      checked={paymentMethod === option.id}
                      onChange={handlePaymentMethodChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="form-grid">
                <div>
                  <label>Full name</label>
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    value={customer.name}
                    onChange={handleCustomerChange("name")}
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="alex@email.com"
                    value={customer.email}
                    onChange={handleCustomerChange("email")}
                  />
                </div>
                <div>
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={customer.phone}
                    onChange={handleCustomerChange("phone")}
                  />
                </div>
                <div className="span-two">
                  <label>Shipping address</label>
                  <input
                    type="text"
                    placeholder="110 Matchday Ave, New York"
                    value={customer.address}
                    onChange={handleCustomerChange("address")}
                  />
                </div>
                {paymentMethod === "card" ? (
                  <>
                    <div className="span-two">
                      <label>Card number</label>
                      <input type="text" placeholder="4242 4242 4242 4242" />
                    </div>
                    <div>
                      <label>Expiry</label>
                      <input type="text" placeholder="08 / 28" />
                    </div>
                    <div>
                      <label>CVC</label>
                      <input type="text" placeholder="123" />
                    </div>
                  </>
                ) : null}
              </div>

              {paymentMethod === "upi" ? (
                <div className="payment-method-panel upi-panel">
                  <div className="upi-toggle">
                    <label
                      className={`upi-option ${upiMode === "qr" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="upiMode"
                        value="qr"
                        checked={upiMode === "qr"}
                        onChange={() => handleUpiModeChange("qr")}
                      />
                      <span>Scan QR</span>
                    </label>
                    <label
                      className={`upi-option ${upiMode === "id" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="upiMode"
                        value="id"
                        checked={upiMode === "id"}
                        onChange={() => handleUpiModeChange("id")}
                      />
                      <span>UPI ID</span>
                    </label>
                  </div>

                  {upiMode === "qr" ? (
                    <div className="upi-qr">
                      <div className="qr-box">
                        <span>TFHD UPI</span>
                      </div>
                      <div>
                        <p className="muted">
                          Scan the QR with any UPI app to pay {formattedTotal}.
                        </p>
                        <p className="helper-text">UPI handle: tfhd@razorpay</p>
                      </div>
                    </div>
                  ) : (
                    <div className="upi-id">
                      <label>UPI ID</label>
                      <div className="input-inline">
                        <input
                          type="text"
                          placeholder="name@bank"
                          value={upiId}
                          onChange={handleUpiIdChange}
                        />
                        <button
                          type="button"
                          className="btn secondary small"
                          onClick={handleSendUpiRequest}
                        >
                          Send request
                        </button>
                      </div>
                      {upiNotice.message ? (
                        <p className={`form-message ${upiNotice.type}`}>
                          {upiNotice.message}
                        </p>
                      ) : (
                        <p className="helper-text">
                          We'll send a collect request to your UPI app.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : null}

              {paymentMethod === "razorpay" ? (
                <div className="payment-method-panel razorpay-panel">
                  <div className="gateway-row">
                    <div>
                      <p className="gateway-title">Razorpay Checkout</p>
                      <p className="muted">
                        Pay securely via UPI, cards, netbanking, or wallets.
                      </p>
                    </div>
                    <span className="gateway-pill">Verified</span>
                  </div>
                  <div className="gateway-details">
                    <div>
                      <p className="gateway-label">Amount</p>
                      <p className="gateway-value">{formattedTotal}</p>
                    </div>
                    <div>
                      <p className="gateway-label">Merchant</p>
                      <p className="gateway-value">TFHD Jersey Store</p>
                    </div>
                  </div>
                  {!hasRazorpayKey ? (
                    <p className="form-message error">
                      Add `VITE_RAZORPAY_KEY` in `.env` to enable Razorpay checkout.
                    </p>
                  ) : null}
                  {razorpayNotice.message ? (
                    <p className={`form-message ${razorpayNotice.type}`}>
                      {razorpayNotice.message}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {paymentMethod === "cod" ? (
                <div className="payment-method-panel cod-panel">
                  <p className="muted">
                    Pay with cash when the jersey arrives. Keep exact change
                    handy.
                  </p>
                </div>
              ) : null}

              <div className="promo-row">
                <div>
                  <label>Promo code</label>
                  <input
                    type="text"
                    placeholder="KICKOFF10"
                    value={promoInput}
                    onChange={(event) => setPromoInput(event.target.value)}
                  />
                </div>
                <button className="btn secondary" onClick={applyPromo}>
                  Apply
                </button>
              </div>

              {promoCode ? (
                <p className={`promo-message ${isPromoValid ? "success" : "error"}`}>
                  {isPromoValid
                    ? "Promo applied. You saved 10%."
                    : "Promo code not recognized."}
                </p>
              ) : null}

              <div className="summary-box">
                <div>
                  <p>Subtotal</p>
                  <p>{formatCurrency(subtotal)}</p>
                </div>
                <div>
                  <p>Discount</p>
                  <p>-{formatCurrency(discount)}</p>
                </div>
                <div>
                  <p>Total due</p>
                  <p>{formatCurrency(total)}</p>
                </div>
              </div>

              <button
                className="btn primary full"
                disabled={isPaymentActionDisabled}
                onClick={handlePaymentAction}
              >
                {paymentActionLabel}
              </button>
            </div>
          </section>
        </main>
      )}

      {!isAdminRoute ? (
        <footer className="site-footer" id="support">
          <div>
            <p className="brand-title">TFHD Jersey Store</p>
            <p className="brand-sub">Premium jerseys for fans and collectors.</p>
          </div>
          <div className="footer-links">
            <a href="#catalog">Size guide</a>
            <a href="#checkout">Shipping</a>
            <a href="#support">Support</a>
          </div>
          <p className="footer-note">Crafted in 2026 for the global game.</p>
        </footer>
      ) : null}
    </div>
  );
}

export default App;
