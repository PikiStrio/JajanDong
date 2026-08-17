import { useEffect, useState } from "react";
import "./AdminOrder.css";

const API_URL = "http://localhost:3000/api";

const STATUS_LABEL = {
  CONFIRMED: "Dikonfirmasi",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const NEXT_STATUS = {
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/order/admin/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil order");
      }

      setOrders(data.data);
    } catch (err) {
      console.error("GET ALL ORDERS ERROR:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil order");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      console.log(data)

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah status order");
      }

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data.data : order))
      );
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);
      alert(err.message || "Gagal mengubah status order");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="admin-orders-loading">Memuat order...</div>;
  }

  if (error) {
    return (
      <div className="admin-orders-error">
        <p>{error}</p>
        <button onClick={getOrders}>Coba lagi</button>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <h1>Kelola Pesanan</h1>

      {orders.length === 0 ? (
        <div className="admin-orders-empty">
          <p>Belum ada order masuk</p>
        </div>
      ) : (
        <div className="admin-order-list">
          {orders.map((order) => (
            <div className="admin-order-card" key={order.id}>
              <div className="admin-order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="admin-order-user">
                    {order.user?.name} ({order.user?.email})
                  </p>
                  <p className="admin-order-date">
                    {new Date(order.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <span
                  className={`order-status status-${order.status.toLowerCase()}`}
                >
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>

              <div className="admin-order-items">
                {order.items.map((item) => (
                  <div className="admin-order-item-row" key={item.id}>
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

              <div className="admin-order-footer">
                <strong>
                  Total: Rp {Number(order.total).toLocaleString("id-ID")}
                </strong>

                <div className="admin-order-actions">
                  {NEXT_STATUS[order.status]?.length === 0 ? (
                    <span className="no-action">Tidak ada aksi</span>
                  ) : (
                    NEXT_STATUS[order.status]?.map((nextStatus) => (
                      <button
                        key={nextStatus}
                        className={`status-btn status-btn-${nextStatus.toLowerCase()}`}
                        disabled={updatingId === order.id}
                        onClick={() => updateStatus(order.id, nextStatus)}
                      >
                        {updatingId === order.id
                          ? "..."
                          : STATUS_LABEL[nextStatus]}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}