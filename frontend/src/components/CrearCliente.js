import { useState } from "react";
import axios from "axios";

export default function CrearCliente() {
  const [name, setName] = useState("");
  const [rnc, setRnc] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Usuario no autorizado");

    try {
      await axios.post("http://127.0.0.1:8000/clients/", { name, rnc }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Cliente creado!");
      setName("");
      setRnc("");
    } catch (err) {
      console.error(err);
      alert("Error al crear cliente");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear Nuevo Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          placeholder="RNC / Cédula"
          value={rnc}
          onChange={e => setRnc(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Crear Cliente
        </button>
      </form>
    </div>
  );
}
