import { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Enviando formulario de registro...");
    console.log("handleSubmit llamado", { email, password });
    try {
      await register(email, password);
      alert("Registro exitoso, redirigiendo a login");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Error al registrar";
      alert(msg);
      console.error("Error al registrar:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main">
      <div className="card w-full max-w-md">
        <h2 className="title-main">Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-accent border-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-pink-700 font-semibold"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border-accent border-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-pink-700 font-semibold"
            required
          />
          <button
            type="submit"
            className="btn-primary w-full mt-2"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-accent cursor-pointer hover:underline"
          >
            Iniciar sesión
          </span>
        </p>
      </div>
    </div>
  );
}
