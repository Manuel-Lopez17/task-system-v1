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
        Delete Task{' '}
      </button>
      <dialog ref={dialogRef} className="dialog">
        <h2 className="dialog-title">Delete Task</h2>
        <p>Delete task "{task.title}"?</p>
        <div className="form-actions">
          <button onClick={closeDialog} className="dialog-btn secondary-btn">
            Cancel
          </button>
          <button onClick={handleDelete} className="dialog-btn danger-btn">
            Delete Task
          </button>
        </div>
      </dialog>
    </>
  );
}

export default DeleteTaskDialog;
