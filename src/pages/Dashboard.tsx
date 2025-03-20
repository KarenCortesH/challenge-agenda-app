import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", phone: "", email: "", address: "", color: "#000000" });
  const [editingUser, setEditingUser] = useState(null);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [newBlock, setNewBlock] = useState({ startTime: "", endTime: "", userId: "" });

  useEffect(() => {
    fetchUsers();
    fetchTimeBlocks();
  }, []);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.phone || !newUser.email || !newUser.address || !newUser.color) return;
    if (editingUser) {
      await updateDoc(doc(db, "users", editingUser.id), newUser);
      setEditingUser(null);
    } else {
      await addDoc(collection(db, "users"), { ...newUser });
    }
    fetchUsers();
    setNewUser({ name: "", phone: "", email: "", address: "", color: "#000000" });
  };

  const editUser = (user) => {
    setNewUser(user);
    setEditingUser(user);
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter(user => user.id !== id)); // Actualiza la lista de usuarios sin recargar
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  const fetchTimeBlocks = async () => {
    const querySnapshot = await getDocs(collection(db, "timeBlocks"));
    setTimeBlocks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addTimeBlock = async () => {
    if (!newBlock.startTime || !newBlock.endTime || !newBlock.userId) return;
    await addDoc(collection(db, "timeBlocks"), newBlock);
    fetchTimeBlocks();
    setNewBlock({ startTime: "", endTime: "", userId: "" });
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen flex flex-col gap-4">
      <div className="bg-blue-200 p-4 rounded-t-md shadow-md font-bold text-xl">Reservas</div>
      <div className="grid grid-cols-4 gap-4">
        {/* Línea de tiempos estilo calendario con scroll */}
        <div className="bg-white p-4 rounded-md flex flex-col relative border border-gray-300 w-64 overflow-y-auto max-h-[600px]">
          <h2 className="text-md font-semibold mb-2">Linea de tiempos</h2>
          <div className="relative w-full border-l border-gray-400 h-[1440px]">
            {[...Array(24)].map((_, index) => (
              <div key={index} className="relative h-[60px] border-t border-gray-300 text-xs pl-2">
                {index}:00
              </div>
            ))}
            {timeBlocks.map((block, index) => {
              const start = new Date(block.startTime);
              const end = new Date(block.endTime);
              const startHour = start.getHours();
              const startMinutes = start.getMinutes();
              const endHour = end.getHours();
              const endMinutes = end.getMinutes();

              const top = ((startHour * 60 + startMinutes) / 1440) * 100;
              const height = (((endHour * 60 + endMinutes) - (startHour * 60 + startMinutes)) / 1440) * 100;
              const userColor = users.find(user => user.id === block.userId)?.color || "#ccc";

              return (
                <div
                  key={index}
                  className="absolute left-8 right-2 text-white text-xs text-center p-2 rounded-md shadow-md overflow-hidden flex items-center justify-center"
                  style={{ top: `${top}%`, height: `${height}%`, backgroundColor: userColor }}
                >
                  <span className="font-bold">{users.find(user => user.id === block.userId)?.name}</span>
                  <br />
                  <span>{start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Lista de usuarios como tabla con iconos */}
        <div className="bg-white shadow-md p-4 rounded-md col-span-2">
          <h2 className="text-lg font-semibold mb-2">Lista de usuarios</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              {/* Encabezado */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Color</th>
                  <th className="border border-gray-300 px-4 py-2">Nombre</th>
                  <th className="border border-gray-300 px-4 py-2">Telefono</th>
                  <th className="border border-gray-300 px-4 py-2">Correo</th>
                  <th className="border border-gray-300 px-4 py-2">Direccion</th>
                  <th className="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
              </thead>
              {/* Cuerpo de la tabla */}
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className="w-4 h-4 rounded-full inline-block" style={{ background: user.color }}></span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.address}</td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-center gap-2">
                      <button onClick={() => editUser(user)} className="text-yellow-500 hover:text-yellow-700">
                        <i className="fas fa-edit text-lg"></i>
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="text-red-500 hover:text-red-700">
                        <i className="fas fa-trash-alt text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formularios */}
        <div className="flex flex-col gap-4">
          <div className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Nuevo Usuario</h2>
            <input type="text" placeholder="Nombre" className="w-full p-2 mb-2 border rounded-md" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <input type="text" placeholder="Telefono" className="w-full p-2 mb-2 border rounded-md" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
            <input type="email" placeholder="Correo" className="w-full p-2 mb-2 border rounded-md" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <input type="text" placeholder="Direccion" className="w-full p-2 mb-2 border rounded-md" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} />
            <input type="color" className="w-full p-2 mb-2 border rounded-md" value={newUser.color} onChange={(e) => setNewUser({ ...newUser, color: e.target.value })} />
            <button className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600" onClick={addUser}>Guardar</button>
          </div>
          <div className="bg-white shadow-md p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Crear Bloque de Tiempo</h2>
            <select className="w-full p-2 mb-2 border rounded-md" onChange={(e) => setNewBlock({ ...newBlock, userId: e.target.value })}>
              <option value="">Selecciona un usuario</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <input type="datetime-local" className="w-full p-2 mb-2 border rounded-md" onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })} />
            <input type="datetime-local" className="w-full p-2 mb-2 border rounded-md" onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })} />
            <button className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600" onClick={addTimeBlock}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
