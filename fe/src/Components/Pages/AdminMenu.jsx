import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./AdminMenu.css";

const API_URL = "http://localhost:3000/api";
const BASE_URL = "http://localhost:3000";

const EMPTY_FORM = { name: "", description: "", price: "" };

const getImageUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `${BASE_URL}${value}`;
};

export default function AdminMenu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [editingImageUrl, setEditingImageUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMenus();
  }, []);

  // cleanup object URL when preview changes
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const authHeaders = () => ({
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
    setImageFile(null);
    setImagePreviewUrl(null);
    setEditingImageUrl(null);
    setFormError(null);
  };

  const startEdit = (menu) => {
    setEditingId(menu.id);
    setForm({
      name: menu.name,
      description: menu.description || "",
      price: String(menu.price),
    });
    setImageFile(null);
    setImagePreviewUrl(null);
    setEditingImageUrl(menu.image || null);
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

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("price", String(Number(form.price)));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const url = editingId ? `${API_URL}/menu/${editingId}` : `${API_URL}/menu`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders(),
        body: formData,
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

      await Swal.fire({
        icon: "success",
        title: editingId ? "Menu berhasil diperbarui" : "Menu berhasil ditambahkan",
        timer: 1400,
        showConfirmButton: false,
      });

      startCreate(); // reset form ke mode tambah baru
    } catch (err) {
      console.error("SAVE MENU ERROR:", err);
      setFormError(err.message || "Terjadi kesalahan saat menyimpan menu");
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan menu",
        text: err.message || "Terjadi kesalahan saat menyimpan menu",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setEditingImageUrl(null);

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleDelete = async (menuId) => {
    const result = await Swal.fire({
      title: "Yakin mau hapus menu ini?",
      text: "Menu yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setDeletingId(menuId);

    try {
      const response = await fetch(`${API_URL}/menu/${menuId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus menu");
      }

      setMenus((current) => current.filter((m) => m.id !== menuId));

      if (editingId === menuId) {
        startCreate();
      }

      await Swal.fire({
        icon: "success",
        title: "Menu berhasil dihapus",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("DELETE MENU ERROR:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal menghapus menu",
        text: err.message || "Gagal menghapus menu",
      });
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
          <label>Gambar</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {(imagePreviewUrl || editingImageUrl) && (
            <div className="image-preview">
              <img
                src={
                  imagePreviewUrl
                    ? imagePreviewUrl
                    : editingImageUrl
                    ? getImageUrl(editingImageUrl)
                    : undefined
                }
                alt="preview"
                style={{ maxWidth: 200, marginTop: 8 }}
              />
            </div>
          )}
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