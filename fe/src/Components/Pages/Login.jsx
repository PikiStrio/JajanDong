import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./login.css";

const API_URL = "http://localhost:3000/api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: data.message || "Terjadi kesalahan.",
        });

        return;
      }

      localStorage.setItem(
        "token",
        data.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.data.user)
      );

      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/menu");
      });

    } catch (error) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Tidak dapat terhubung ke server.",
      });
    }
  };


return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>JajanDong</h1>
          <p>Login untuk Berbelanja</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="register-text">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </div>
    </div>
  );
}