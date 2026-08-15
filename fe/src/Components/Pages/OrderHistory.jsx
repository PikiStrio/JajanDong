import { useEffect, useState } from "react";
import "./OrderHistory.css";

const API_URL = "http://localhost:3000/api";

const STATUS_LABEL = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login.");
      }

      const response = await fetch(`${API_URL}/order`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil riwayat order");
      }

      setOrders(data.data);
    } catch (err) {
      console.error("GET ORDERS ERROR:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="order-history-loading">Memuat riwayat order...</div>;
  }

  if (error) {
    return (
      <div className="order-history-error">
        <p>{error}</p>
        <button onClick={getOrders}>Coba lagi</button>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <h1>Riwayat Pesanan</h1>

      {orders.length === 0 ? (
        <div className="order-history-empty">
          <div className="empty-icon">📦</div>
          <h3>Belum ada pesanan</h3>
          <p>Pesanan kamu bakal muncul di sini</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>

              <div className="order-card-items">
                {order.items.map((item) => (
                  <div className="order-item-row" key={item.id}>
                    <span>
                      {item.menu.name} x{item.quantity}
                    </span>
                    <span>
                      Rp{" "}
                      {(Number(item.price) * item.quantity).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span>Total</span>
                <strong>Rp {Number(order.total).toLocaleString("id-ID")}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}