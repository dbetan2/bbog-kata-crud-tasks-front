import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const mockJwt = 'mock-jwt-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a task', async () => {
    const mockTask: Task = {
      title: 'Test Task',
      description: 'Task description',
      dueDate: '2024-12-12',
      priority: 'high',
    };

    service.createTask(mockTask, mockJwt).then((status) => {
      expect(status).toBe(201);
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockJwt}`);
    req.flush({}, { status: 201, statusText: 'Created' });
  });

  it('should fetch tasks', async () => {
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', description: 'Description 1', dueDate: '2024-10-01', priority: 'low' },
      { id: '2', title: 'Task 2', description: 'Description 2', dueDate: '2024-11-01', priority: 'high' },
    ];

    service.getTasks(mockJwt).then(({ status, tasks }) => {
      expect(status).toBe(200);
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks, { status: 200, statusText: 'OK' });
  });

  it('should delete a task', async () => {
    const taskId = '1';

    service.deleteTask(taskId, mockJwt).then((status) => {
      expect(status).toBe(204);
    });

    const req = httpMock.expectOne(`http://localhost:3000/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}, { status: 204, statusText: 'No Content' });
  });

  it('should update a task', async () => {
    const mockTask: Task = {
      id: '1',
      title: 'Updated Task',
      description: 'Updated description',
      dueDate: '2024-12-12',
      priority: 'medium',
    };

    service.updateTask(mockTask, mockJwt).then((status) => {
      expect(status).toBe(200);
    });

    const req = httpMock.expectOne(`http://localhost:3000/tasks/${mockTask.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({}, { status: 200, statusText: 'OK' });
  });
});
