import { useState, useEffect, useRef } from 'react';
import SubtaskSelector from './SubtaskSelector';
import { taskService } from '../services/taskService';
import '../styles/Dialog.css';

function UpdateTaskDialog({ task, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    ...task,
    subtasks: task.subtasks?.map((st) => st.id) || [],
  });
  const dialogRef = useRef(null);

  useEffect(() => {
    setFormData({ ...task, subtasks: task.subtasks?.map((st) => st.id) || [] });
  }, [task]);

  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = await taskService.updateTask(task.id, formData);
      onTaskUpdated(updatedTask);
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={openDialog} className="dialog-btn primary-btn">
        Actualizar Tarea
      </button>
      <dialog ref={dialogRef} className="dialog">
        <h2 className="dialog-title">Actualizar Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Prioridad</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="form-select"
            >
              <option value="Low">Baja</option>
              <option value="Medium">Media</option>
              <option value="High">Alta</option>
              <option value="Urgent">Urgente</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-select"
            >
              <option value="Backlog">Backlog</option>
              <option value="Unstarted">Sin iniciar</option>
              <option value="Started">En progreso</option>
              <option value="Completed">Completada</option>
              <option value="Canceled">Cancelada</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Estimate</label>
            <input
              type="number"
              min="0"
              value={formData.estimate}
              onChange={(e) => setFormData({ ...formData, estimate: parseInt(e.target.value) })}
              className="form-input"
            />
          </div>
          <SubtaskSelector
            selectedIds={formData.subtasks || []}
            onChange={(subtasks) => setFormData({ ...formData, subtasks })}
            disabledIds={[task.id]}
          />
          <div className="form-actions">
            <button type="button" onClick={closeDialog} className="dialog-btn secondary-btn">
              Cancelar
            </button>
            <button type="submit" className="dialog-btn primary-btn">
              Actualizar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default UpdateTaskDialog;
