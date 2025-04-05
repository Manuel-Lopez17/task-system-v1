import { useRef } from 'react';
import { taskService } from '../services/taskService';
import '../styles/Dialog.css';

function DeleteTaskDialog({ task, onTaskDeleted }) {
  const dialogRef = useRef(null);

  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

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
      <button onClick={openDialog} className="dialog-btn danger-btn">
        Eliminar Tarea
      </button>
      <dialog ref={dialogRef} className="dialog">
        <h2 className="dialog-title">Eliminar Tarea</h2>
        <p>¿Estás seguro de eliminar la tarea "{task.title}"?</p>
        <div className="form-actions">
          <button onClick={closeDialog} className="dialog-btn secondary-btn">
            Cancelar
          </button>
          <button onClick={handleDelete} className="dialog-btn danger-btn">
            Eliminar
          </button>
        </div>
      </dialog>
    </>
  );
}

export default DeleteTaskDialog;
