import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useAuth } from "./auth/AuthContext";
import type { JSX } from "react";
import "./App.css"
import Students from "./pages/Students";
import Classes from "./pages/Classes";
import StudentForm from "./pages/StudentForm";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/students"
          element={
            <PrivateRoute>
              <Layout>
                <Students />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students/add"
          element={
            <PrivateRoute>
              <Layout>
                <StudentForm />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students/edit/:id"
          element={
            <PrivateRoute>
              <Layout>
                <StudentForm />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/classes"
          element={
            <PrivateRoute>
              <Layout>
                <Classes />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
