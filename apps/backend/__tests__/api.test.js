// tests/task.test.js
import request from 'supertest';
import { describe, it, expect, beforeEach } from '@jest/globals';
import app from '../index.js';

let createdTaskId;

const exampleTask = {
  title: 'Test Task',
  description: 'This is a test task',
  status: 'Backlog',
  priority: 'Low',
  estimate: 3,
};

describe('Tasks API', () => {
  beforeEach(async () => {
    await request(app).get('/tasks');
  });

  it('should create a new task', async () => {
    const res = await request(app).post('/tasks').send(exampleTask);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(exampleTask.title);
    createdTaskId = res.body.id;
  });

  it('should return all tasks with pagination', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return a task by id', async () => {
    const res = await request(app).get(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdTaskId);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/tasks/${createdTaskId}`)
      .send({
        ...exampleTask,
        title: 'Updated title',
        status: 'Started',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated title');
    expect(res.body.status).toBe('Started');
  });

  it('should not create a circular dependency', async () => {
    const taskRes = await request(app)
      .post('/tasks')
      .send({
        ...exampleTask,
        title: 'Parent Task',
      });

    const taskId = taskRes.body.id;

    const circularRes = await request(app)
      .put(`/tasks/${taskId}`)
      .send({
        ...exampleTask,
        subtasks: [taskId],
      });

    expect(circularRes.statusCode).toBe(400);
    expect(circularRes.body).toHaveProperty('error', 'Dependencia circular detectada.');
  });

  it('should delete a task', async () => {
    const res = await request(app).delete(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdTaskId);
  });

  it('should not delete a task if it is a subtask of another', async () => {
    const sub = await request(app)
      .post('/tasks')
      .send({
        ...exampleTask,
        title: 'Subtask A',
      });
    const subId = sub.body.id;

    await request(app)
      .post('/tasks')
      .send({
        ...exampleTask,
        title: 'Main Task',
        subtasks: [subId],
      });

    const res = await request(app).delete(`/tasks/${subId}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
