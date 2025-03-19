import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", phone: "", email: "", address: "" });
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
    if (!newUser.name || !newUser.phone || !newUser.email || !newUser.address) return;
    const docRef = await addDoc(collection(db, "users"), { ...newUser, color: `#${Math.random().toString(16).slice(-6)}` });
    setUsers([...users, { id: docRef.id, ...newUser }]);
    setNewUser({ name: "", phone: "", email: "", address: "" });
  };

  const fetchTimeBlocks = async () => {
    const querySnapshot = await getDocs(collection(db, "timeBlocks"));
    setTimeBlocks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addTimeBlock = async () => {
    if (!newBlock.startTime || !newBlock.endTime || !newBlock.userId) return;
  
    // Obtener todos los bloques de tiempo existentes
    const querySnapshot = await getDocs(collection(db, "timeBlocks"));
    const existingBlocks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    // Validar solapamientos en el frontend
    const conflict = existingBlocks.some(block =>
      block.userId === newBlock.userId &&
      ((newBlock.startTime >= block.startTime && newBlock.startTime < block.endTime) ||
       (newBlock.endTime > block.startTime && newBlock.endTime <= block.endTime))
    );
  
    if (conflict) {
      alert("El bloque de tiempo se solapa con otro existente.");
      return;
    }
  
    // Guardar en Firestore
    const user = users.find(user => user.id === newBlock.userId);
    if (!user) return;
  
    const docRef = await addDoc(collection(db, "timeBlocks"), { ...newBlock, color: user.color });
    setTimeBlocks([...timeBlocks, { id: docRef.id, ...newBlock, color: user.color }]);
    setNewBlock({ startTime: "", endTime: "", userId: "" });
  };
   

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center text-gray-800">Reservas</h1>
      <div className="grid grid-cols-3 gap-4">
        {/* Lista de usuarios */}
        <div className="bg-white shadow-md p-4 rounded-md col-span-2">
          <h2 className="text-lg font-semibold mb-2">Lista de usuarios</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id} className="flex justify-between items-center p-2 border-b">
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full inline-block" style={{ background: user.color }}></span>
                  {user.name} - {user.phone} - {user.email} - {user.address}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Formulario de Bloques de Tiempo */}
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

      {/* Visualización de Bloques de Tiempo */}
      <div className="bg-white shadow-md p-4 rounded-md mt-4">
        <h2 className="text-lg font-semibold mb-2">Agenda</h2>
        <div className="flex flex-col gap-2">
          {timeBlocks.map(block => (
            <div key={block.id} className="p-2 rounded-md text-white text-center" style={{ background: block.color }}>
              {block.startTime} - {block.endTime} ({users.find(user => user.id === block.userId)?.name})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
