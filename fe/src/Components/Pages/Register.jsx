import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Register.css";

const API_URL = "http://localhost:3000/api/auth"

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      Swal.fire(
        "Error",
        "Password dan confirm password tidak sama.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      console.log("REGISTER RESPONSE:", data);

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Register Gagal",
          text: data.message || "Terjadi kesalahan.",
        });

        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Register Berhasil",
        text: "Silakan login dengan akun baru.",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");

    } catch (error) {
      console.error("REGISTER ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Tidak dapat terhubung ke server.",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>
        <p>Daftar untuk membuat akun baru</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Masukkan nama"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-link">
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}