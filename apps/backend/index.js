import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import { object, string, optional, number, array, parse } from 'valibot';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const db = await JSONFilePreset('db.json', { tasks: [], nextId: 1 });

const TaskSchema = object({
  id: string(),
  title: string(),
  description: string(),
  priority: optional(string(['Low', 'Medium', 'High', 'Urgent'])),
  status: string(['Backlog', 'Unstarted', 'Started', 'Completed', 'Canceled']),
  estimate: optional(number({ min: 0 })),
  subtasks: optional(array(string())),
  dates: object({
    createdAt: string(),
    updatedAt: string(),
  }),
});

function hasCircularDependency(taskId, subtaskIds, visited = new Set()) {
  if (visited.has(taskId)) return true;
  visited.add(taskId);

  for (const subId of subtaskIds ?? []) {
    const subtask = db.data.tasks.find((t) => t.id === subId);
    if (subtask && hasCircularDependency(subId, subtask.subtasks ?? [], visited)) {
      return true;
    }
  }

  return false;
}

function resolveSubtasks(task, allTasks, depth = 0) {
  if (depth > 5) return [];
  return (task.subtasks || [])
    .map((id) => {
      const sub = allTasks.find((t) => t.id === id);
      if (!sub) return null;
      return {
        ...sub,
        subtasks: resolveSubtasks(sub, allTasks, depth + 1),
      };
    })
    .filter(Boolean);
}

function computeEstimates(subtasks) {
  let pending = 0,
    inProgress = 0,
    total = 0;
  for (const st of subtasks) {
    const nested = computeEstimates(st.subtasks || []);
    if (['Backlog', 'Unstarted'].includes(st.status)) pending += st.estimate || 0;
    if (st.status === 'Started') inProgress += st.estimate || 0;
    total += st.estimate || 0;

    pending += nested.pending;
    inProgress += nested.inProgress;
    total += nested.total;
  }
  return { pending, inProgress, total };
}

async function createTask(data) {
  const newTaskId = uuidv4();
  const subtaskIds = data.subtasks || [];

  if (hasCircularDependency(newTaskId, subtaskIds)) {
    throw new Error('Dependencia circular detectada.');
  }

  const newTask = {
    id: newTaskId,
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: data.status,
    estimate: data.estimate,
    subtasks: subtaskIds,
    dates: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  db.data.tasks.push(newTask);
  db.data.nextId++;
  await db.write();

  const resolvedSubtasks = resolveSubtasks(newTask, db.data.tasks);
  const estimates = computeEstimates(resolvedSubtasks);
  return { ...newTask, subtasks: resolvedSubtasks, estimates };
}

app.get('/tasks', async (req, res) => {
  await db.read();
  const enriched = db.data.tasks.map((task) => {
    const subtasks = resolveSubtasks(task, db.data.tasks);
    const estimates = computeEstimates(subtasks);
    return { ...task, subtasks, estimates };
  });
  res.json(enriched);
});

app.get('/tasks/:id', async (req, res) => {
  await db.read();
  const task = db.data.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
  const subtasks = resolveSubtasks(task, db.data.tasks);
  const estimates = computeEstimates(subtasks);
  res.json({ ...task, subtasks, estimates });
});

app.post('/tasks', async (req, res) => {
  await db.read();
  try {
    const now = new Date().toISOString();
    const validatedInput = parse(TaskSchema, {
      ...req.body,
      id: 'temp',
      dates: { createdAt: now, updatedAt: now },
    });
    const newTask = await createTask(validatedInput);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  await db.read();
  const task = db.data.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  try {
    const now = new Date().toISOString();
    let subtaskIds = req.body.subtasks || [];
    if (subtaskIds.length > 0 && typeof subtaskIds[0] === 'object') {
      subtaskIds = subtaskIds.map((st) => st.id);
    }
    const validatedInput = parse(TaskSchema, {
      ...req.body,
      id: task.id,
      subtasks: subtaskIds,
      dates: { createdAt: task.dates.createdAt, updatedAt: now },
    });

    if (hasCircularDependency(validatedInput.id, validatedInput.subtasks)) {
      return res.status(400).json({ error: 'Dependencia circular detectada.' });
    }

    const updatedTask = {
      ...validatedInput,
    };

    db.data.tasks = db.data.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    await db.write();

    const subtasks = resolveSubtasks(updatedTask, db.data.tasks);
    const estimates = computeEstimates(subtasks);
    res.json({ ...updatedTask, subtasks, estimates });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  await db.read();
  const index = db.data.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Tarea no encontrada' });

  if (db.data.tasks.some((t) => (t.subtasks || []).includes(req.params.id))) {
    return res.status(400).json({ error: 'No se puede eliminar: la tarea es subtask de otra.' });
  }

  const deleted = db.data.tasks.splice(index, 1);
  await db.write();
  res.json(deleted[0]);
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en el puerto ${port}`);
});
