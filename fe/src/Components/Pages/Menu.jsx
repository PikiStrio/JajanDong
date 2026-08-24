import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Menu.css";

const API_URL = "http://localhost:3000/api";
const BASE_URL = "http://localhost:3000";

const getImageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${BASE_URL}${value}`;
};

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login.");
      }

      const response = await fetch(`${API_URL}/menu`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil menu");
      }

      setMenus(data.data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil menu");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menu) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === menu.id);

    console.log(...currentCart);

      if (existing) {
        return currentCart.map((item) =>
          item.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }


      return [...currentCart, { ...menu, quantity: 1 }];
    });
  };

  const increaseQuantity = (menuId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === menuId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (menuId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
          item.id === menuId ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (menuId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== menuId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setCheckingOut(true);
    setCheckoutError(null);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        items: cart.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(`${API_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat order");
      }

      setLastOrder(data.data);
      setCart([]);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      const message = err.message || "Terjadi kesalahan saat checkout";
      setCheckoutError(message);
      Swal.fire({
        icon: "error",
        title: "Checkout gagal",
        text: message,
      });
    } finally {
      setCheckingOut(false);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return <div className="menu-loading">Loading menu...</div>;
  }

  if (error) {
    return (
      <div className="order-history-error">
        <p>{error}</p>
        <button onClick={getMenus}>Coba lagi</button>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div>
          <h1>JajanDong</h1>
          <p>Pilih makanan/minuman favorit kamu </p>
        </div>

        <div className="cart-summary">🛒 {totalItems} Item</div>
      </div>

      <div className="menu-layout">
        <div className="menu-section">
          <div className="menu-grid">
            {menus.map((menu) => (
              <div className="menu-card" key={menu.id}>
                  <div className="menu-image">
                    {menu.image ? (
                      <img src={getImageUrl(menu.image)} alt={menu.name} />
                    ) : (
                      <div className="menu-placeholder">🌯🍱🍜🍲</div>
                    )}
                  </div>

                <div className="menu-content">
                  <h2>{menu.name}</h2>

                  <p className="menu-description">{menu.description}</p>

                  <div className="menu-bottom">
                    <span className="menu-price">
                      Rp {Number(menu.price).toLocaleString("id-ID")}
                    </span>

                    <button
                      className="add-button"
                      onClick={() => addToCart(menu)}
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="cart">
          <div className="cart-header">
            <div>
              <h2>Keranjang</h2>
              <span>{totalItems} item</span>
            </div>

            <div className="cart-icon">🛒</div>
          </div>

          {lastOrder && cart.length === 0 && (
            <div className="order-success">
              <h3>Pesanan berhasil dibuat </h3>
              <p>Order #{lastOrder.id}</p>
              <p>
                Total: Rp {Number(lastOrder.total).toLocaleString("id-ID")}
              </p>
              <p>Status: {lastOrder.status}</p>
              <button onClick={() => setLastOrder(null)}>
                Pesan lagi
              </button>
            </div>
          )}

          {cart.length === 0 && !lastOrder ? (
            <div className="cart-empty">
              <div className="empty-icon">🛒</div>
              <h3>Keranjang masih kosong</h3>
              <p>Yuk pilih makanan favorit kamu!</p>
            </div>
          ) : cart.length === 0 ? null : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-image">🍜</div>

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>

                      <p>
                        Rp {Number(item.price).toLocaleString("id-ID")}
                      </p>

                      <div className="quantity">
                        <button onClick={() => decreaseQuantity(item.id)}>
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() => increaseQuantity(item.id)}>
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-right">
                      <div className="cart-item-total">
                        Rp{" "}
                        {(Number(item.price) * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </div>

                      <button
                        className="remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total</span>
                  <strong>Rp {total.toLocaleString("id-ID")}</strong>
                </div>

                {checkoutError && (
                  <p className="checkout-error">{checkoutError}</p>
                )}

                <button
                  className="checkout-button"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? "Memproses..." : "Checkout"}
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}