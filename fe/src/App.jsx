import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Pages/Login";
import RegisterPage from "./Components/Pages/Register";
import Menu from "./Components/Pages/Menu";
import OrderHistory from "./Components/Pages/OrderHistory";
import Navbar from "./Components/Organisms/Navbar";
import AdminMenu from "./Components/Pages/AdminMenu";
import AdminOrders from "./Components/Pages/AdminOrder";
import { jwtDecode } from "jwt-decode";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let user = null;

  try {
    user = jwtDecode(token);
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let user = null;

  try {
    user = jwtDecode(token);
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/menu" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Menu />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AppLayout>
                <OrderHistory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <AdminRoute>
              <AppLayout>
                <AdminMenu />
              </AppLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AppLayout>
                <AdminOrders />
              </AppLayout>
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;