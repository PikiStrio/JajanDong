import { useEffect, useState } from "react";
import "./AdminMenu.css";

const API_URL = "http://localhost:3000/api";

const EMPTY_FORM = { name: "", description: "", price: "" };

export default function AdminMenu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMenus();
  }, []);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const getMenus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/menu`, {
        method: "GET",
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil menu");
      }

      setMenus(data.data);
    } catch (err) {
      console.error("GET MENUS ERROR:", err);
      setError(err.message || "Terjadi kesalahan saat mengambil menu");
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const startEdit = (menu) => {
    setEditingId(menu.id);
    setForm({
      name: menu.name,
      description: menu.description || "",
      price: String(menu.price),
    });
    setFormError(null);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError("Nama menu wajib diisi");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setFormError("Harga harus lebih dari 0");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
    };

    try {
      const url = editingId ? `${API_URL}/menu/${editingId}` : `${API_URL}/menu`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || (editingId ? "Gagal update menu" : "Gagal membuat menu")
        );
      }

      if (editingId) {
        setMenus((current) =>
          current.map((m) => (m.id === editingId ? data.data : m))
        );
      } else {
        setMenus((current) => [...current, data.data]);
      }

      startCreate(); // reset form ke mode tambah baru
    } catch (err) {
      console.error("SAVE MENU ERROR:", err);
      setFormError(err.message || "Terjadi kesalahan saat menyimpan menu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (menuId) => {
    if (!window.confirm("Yakin mau hapus menu ini?")) return;

    setDeletingId(menuId);

    try {
      const response = await fetch(`${API_URL}/menu/${menuId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus menu");
      }

      setMenus((current) => current.filter((m) => m.id !== menuId));

      if (editingId === menuId) {
        startCreate();
      }
    } catch (err) {
      console.error("DELETE MENU ERROR:", err);
      alert(err.message || "Gagal menghapus menu");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-menu-page">
      <h1>Kelola Menu</h1>

      <form className="menu-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Menu" : "Tambah Menu Baru"}</h2>

        <div className="form-field">
          <label>Nama Menu</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Nasi Goreng Spesial"
          />
        </div>

        <div className="form-field">
          <label>Deskripsi</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Nasi goreng dengan telur, ayam, dan kerupuk"
            rows={3}
          />
        </div>

        <div className="form-field">
          <label>Harga (Rp)</label>
          <input
            type="number"
            value={form.price}
            onChange={handleChange("price")}
            placeholder="15000"
            min="0"
          />
        </div>

        {formError && <p className="form-error">{formError}</p>}

        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Menu"}
          </button>

          {editingId && (
            <button type="button" className="cancel-btn" onClick={startCreate}>
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="menu-list-section">
        <h2>Daftar Menu</h2>

        {loading && <p>Memuat menu...</p>}

        {error && (
          <div className="admin-menu-error">
            <p>{error}</p>
            <button onClick={getMenus}>Coba lagi</button>
          </div>
        )}

        {!loading && !error && menus.length === 0 && (
          <p className="menu-list-empty">Belum ada menu. Tambahin dulu di atas.</p>
        )}

        {!loading && !error && menus.length > 0 && (
          <div className="admin-menu-list">
            {menus.map((menu) => (
              <div className="admin-menu-row" key={menu.id}>
                <div className="admin-menu-row-info">
                  <h3>{menu.name}</h3>
                  <p>{menu.description}</p>
                  <span className="admin-menu-price">
                    Rp {Number(menu.price).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="admin-menu-row-actions">
                  <button onClick={() => startEdit(menu)}>Edit</button>
                  <button
                    className="delete-btn"
                    disabled={deletingId === menu.id}
                    onClick={() => handleDelete(menu.id)}
                  >
                    {deletingId === menu.id ? "..." : "Hapus"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}