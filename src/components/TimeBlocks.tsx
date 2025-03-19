import { useEffect, useState } from "react";
import { getTimeBlocks, addTimeBlock } from "../services/timeBlockService";
import { getUsers } from "../services/userService";

const TimeBlocks = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [newBlock, setNewBlock] = useState({ startTime: "", endTime: "", userId: "", color: "" });

  useEffect(() => {
    fetchTimeBlocks();
    fetchUsers();
  }, []);

  const fetchTimeBlocks = async () => {
    const data = await getTimeBlocks();
    setBlocks(data);
  };

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleAddTimeBlock = async () => {
    try {
      const user = users.find(u => u.id === newBlock.userId);
      if (!user) return alert("Selecciona un usuario válido");
      await addTimeBlock({ ...newBlock, color: user.color });
      fetchTimeBlocks();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <h1 className="text-2xl font-bold text-gray-800">Bloques de Tiempo</h1>
      <div className="flex gap-2 mt-4">
        <select className="border p-2 rounded-md w-full" onChange={(e) => setNewBlock({ ...newBlock, userId: e.target.value })}>
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <input type="datetime-local" className="border p-2 rounded-md w-full" onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })} />
        <input type="datetime-local" className="border p-2 rounded-md w-full" onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })} />
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={handleAddTimeBlock}>
          Agregar
        </button>
      </div>
      <ul className="mt-4">
        {blocks.map((block) => (
          <li key={block.id} className="flex justify-between items-center border p-2 rounded-md shadow-sm bg-gray-50">
            <span>{block.startTime} - {block.endTime}</span>
            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: block.color }}></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeBlocks;
