import { useEffect, useState } from "react";
import { getUsers, addUser, deleteUser } from "../services/userService"; // Asegúrate de la ruta correcta

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleAddUser = async () => {
    if (!name) return;
    await addUser({ name, address: "NA", phone: "NA", email: "NA", color });
    fetchUsers();
    setName("");
  };

  const handleDeleteUser = async (id: string) => {
    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <input
        className="border p-2 my-2"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="color"
        className="ml-2"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 mx-2" onClick={handleAddUser}>
        Agregar Usuario
      </button>
      <ul className="mt-4">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between border p-2 my-2">
            {user.name} <span style={{ backgroundColor: user.color, padding: "2px 8px", borderRadius: "4px" }}>{user.color}</span>
            <button className="bg-red-500 text-white p-1" onClick={() => handleDeleteUser(user.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
