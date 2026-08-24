import { NavLink } from "react-router-dom";
import {jwtDecode} from "jwt-decode"
import "./Navbar.css";

export default function Navbar() {

    const token = localStorage.getItem("token");

    let user = null;

    if (token) {
        try{
            user = jwtDecode(token);
        } catch {
            console.log("token gada");
        }
    }

    const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">JajanDong</div>

      <div className="navbar-links">
        {!isAdmin && (
          <>
        <NavLink
          to="/menu"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Menu
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Riwayat Pesanan
        </NavLink>
        </>
      )}
        {isAdmin && (
          <>
            <NavLink
              to="/admin/menu"
              className={({ isActive }) =>
                isActive
                  ? "navbar-link active"
                  : "navbar-link"
              }
            >
              Edit Menu
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive
                  ? "navbar-link active"
                  : "navbar-link"
              }
            >
              Orders
            </NavLink>
          </>
        )}
      </div>



      <button className="navbar-logout" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}