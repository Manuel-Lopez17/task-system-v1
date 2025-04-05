import { useState, useRef } from 'react';
import SubtaskSelector from './SubtaskSelector';
import { taskService } from '../services/taskService';

function CreateTaskDialog({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Unstarted',
    estimate: 0,
    subtasks: [],
  });
  const dialogRef = useRef(null);

  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTask = await taskService.createTask(formData);
      onTaskCreated(newTask);
      closeDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={openDialog} className="px-4 py-2 bg-blue-500 text-white rounded">
        Crear Tarea
      </button>
      <dialog ref={dialogRef} className="p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Crear Nueva Tarea</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block mb-1">Título</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Prioridad</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="border p-2 w-full"
            >
              <option value="Low">Baja</option>
              <option value="Medium">Media</option>
              <option value="High">Alta</option>
              <option value="Urgent">Urgente</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Estado</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="border p-2 w-full"
            >
              <option value="Backlog">Backlog</option>
              <option value="Unstarted">Sin iniciar</option>
              <option value="Started">En progreso</option>
              <option value="Completed">Completada</option>
              <option value="Canceled">Cancelada</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Estimate</label>
            <input
              type="number"
              min="0"
              value={formData.estimate}
              onChange={(e) => setFormData({ ...formData, estimate: parseInt(e.target.value) })}
              className="border p-2 w-full"
            />
          </div>
          <SubtaskSelector
            selectedIds={formData.subtasks || []}
            onChange={(subtasks) => setFormData({ ...formData, subtasks })}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={closeDialog} className="px-4 py-2 bg-gray-300 rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Crear
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default CreateTaskDialog;
