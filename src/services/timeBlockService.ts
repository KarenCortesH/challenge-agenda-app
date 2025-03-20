import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// Validar si un bloque de tiempo se solapa con otro existente
export const checkTimeConflict = async (startTime: string, endTime: string) => {
  const blocksRef = collection(db, "timeBlocks");

  // Buscar bloques existentes en el mismo rango de tiempo
  const q = query(blocksRef, where("startTime", "<=", endTime), where("endTime", ">=", startTime));
  const querySnapshot = await getDocs(q);

  return !querySnapshot.empty; // Devuelve true si hay conflicto
};

// Agregar un bloque de tiempo si no hay conflicto
export const addTimeBlock = async (block: { startTime: string; endTime: string; userId: string; color: string }) => {
  const conflict = await checkTimeConflict(block.startTime, block.endTime);

  if (conflict) {
    throw new Error("El bloque de tiempo se solapa con otro existente.");
  }

  return await addDoc(collection(db, "timeBlocks"), block);
};

// Obtener todos los bloques de tiempo
export const getTimeBlocks = async () => {
  const blocksSnapshot = await getDocs(collection(db, "timeBlocks"));
  return blocksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Eliminar un bloque de tiempo
export const deleteTimeBlock = async (id: string) => {
  return await deleteDoc(doc(db, "timeBlocks", id));
};
