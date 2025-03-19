import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Obtener Usuarios
export const getUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, "users"));
  return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Agregar Usuario
export const addUser = async (user: { name: string; address: string; phone: string; email: string; color: string }) => {
  return await addDoc(collection(db, "users"), user);
};

// Eliminar Usuario
export const deleteUser = async (id: string) => {
  return await deleteDoc(doc(db, "users", id));
};
