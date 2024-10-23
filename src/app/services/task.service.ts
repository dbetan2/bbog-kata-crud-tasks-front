import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {}

  async createTask(task: Task, jwt: string) {
    const url = 'http://localhost:3000/tasks';
    const method = 'POST';
    const headers = {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    };
    const res = await fetch(url, {
      method,
      body: JSON.stringify(task),
      headers,
    });
    console.warn(
      'Creating task with url',
      url,
      'headers:',
      headers,
      'method',
      method
    );
    const bodyRes = await res.json();
    console.log('Status is', res.status, 'Body response is', bodyRes);
    return res.status;
  }

  async getTasks(jwt: string) {
    const url = 'http://localhost:3000/tasks';
    const method = 'GET';
    const headers = {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    };
    const res = await fetch(url, { method, headers });
    console.warn(
      'Obtaining tasks with url',
      url,
      'headers:',
      headers,
      'method',
      method
    );
    const bodyRes = await res.json();
    console.log('Status is', res.status, 'Body response is', bodyRes);
    return { status: res.status, tasks: bodyRes };
  }

  async deleteTask(taskId: string, jwt: string) {
    const url = `http://localhost:3000/tasks/${taskId}`;
    const method = 'DELETE';
    const headers = {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    };
    const res = await fetch(url, { method, headers });
    console.warn(
      'Obtaining tasks with url',
      url,
      'headers:',
      headers,
      'method',
      method
    );
    console.log('Status is', res.status);
  }

  async updateTask(task: Task, jwt: string) {
    console.log('task in service', task);
    const url = `http://localhost:3000/tasks/${task.id}`;
    const method = 'PUT';
    const headers = {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    };
    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(task),
    });
    console.warn(
      'Obtaining tasks with url',
      url,
      'headers:',
      headers,
      'method',
      method
    );
    const bodyRes = await res.json();
    console.log('Status is', res.status, 'Body response is', bodyRes);
    return res.status;
  }
}
