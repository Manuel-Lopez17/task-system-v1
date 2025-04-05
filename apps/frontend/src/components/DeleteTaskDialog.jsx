import { useRef } from 'react';
import { taskService } from '../services/taskService';

function DeleteTaskDialog({ task, onTaskDeleted }) {
  const dialogRef = useRef(null);

  const openDialog = () => {
    dialogRef.current.showModal();
  };

  const closeDialog = () => {
    dialogRef.current.close();
  };

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(task.id);
      onTaskDeleted(task.id);
    } catch (error) {
      console.error(error);
    } finally {
      closeDialog();
    }
  };

  return (
    <>
      <button onClick={openDialog} className="px-4 py-2 bg-red-500 text-white rounded">
        Eliminar Tarea
      </button>
      <dialog ref={dialogRef} className="p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Eliminar Tarea</h2>
        <p>¿Estás seguro de eliminar la tarea "{task.title}"?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={closeDialog} className="px-4 py-2 bg-gray-300 rounded">
            Cancelar
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
            Eliminar
          </button>
        </div>
      </dialog>
    </>
  );
}

export default DeleteTaskDialog;
