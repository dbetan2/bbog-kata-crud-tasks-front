import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let mockFetch: jest.Mock;
  const mockJwt = 'mock-jwt-token';
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: "12/09/2022",
    priority: "low"
  };

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    service = new TaskService();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const expectedStatus = 201;
      mockFetch.mockResolvedValueOnce({
        status: expectedStatus,
        json: () => Promise.resolve({ id: '1' })
      });

      const result = await service.createTask(mockTask, mockJwt);

      expect(result).toBe(expectedStatus);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/tasks',
        {
          method: 'POST',
          body: JSON.stringify(mockTask),
          headers: {
            Authorization: `Bearer ${mockJwt}`,
            'Content-Type': 'application/json'
          }
        }
      );
    });

    it('should handle creation failure', async () => {
      const expectedStatus = 400;
      mockFetch.mockResolvedValueOnce({
        status: expectedStatus,
        json: () => Promise.resolve({ error: 'Bad Request' })
      });

      const result = await service.createTask(mockTask, mockJwt);

      expect(result).toBe(expectedStatus);
    });
  });

  describe('getTasks', () => {
    it('should get tasks successfully', async () => {
      const mockTasks = [mockTask];
      const expectedStatus = 200;
      mockFetch.mockResolvedValueOnce({
        status: expectedStatus,
        json: () => Promise.resolve(mockTasks)
      });

      const result = await service.getTasks(mockJwt);

      expect(result).toEqual({
        status: expectedStatus,
        tasks: mockTasks
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/tasks',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${mockJwt}`,
            'Content-Type': 'application/json'
          }
        }
      );
    });

    it('should handle get tasks failure', async () => {
      const expectedStatus = 401;
      mockFetch.mockResolvedValueOnce({
        status: expectedStatus,
        json: () => Promise.resolve({ error: 'Unauthorized' })
      });

      const result = await service.getTasks(mockJwt);

      expect(result.status).toBe(expectedStatus);
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const expectedStatus = 204;
      mockFetch.mockResolvedValueOnce({
        status: expectedStatus,
        json: () => Promise.resolve({})
      });

      await service.deleteTask(String(mockTask.id), mockJwt);

      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:3000/tasks/${mockTask.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockJwt}`,
            'Content-Type': 'application/json'
          }
        }
      );
    });

    it('should handle delete task failure', async () => {
      const expectedStatus = 404;
      mockFetch.mockResolvedValueOnce({
        status: expectedStatus,
        json: () => Promise.resolve({ error: 'Not Found' })
      });

      await service.deleteTask('non-existent-id', mockJwt);

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const expectedStatus = 200;
      mockFetch.mockResolvedValueOnce({
        status: expectedStatus,
        json: () => Promise.resolve(mockTask)
      });

      const result = await service.updateTask(mockTask, mockJwt);

      expect(result).toBe(expectedStatus);
      expect(mockFetch).toHaveBeenCalledWith(
        `http://localhost:3000/tasks/${mockTask.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${mockJwt}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(mockTask)
        }
      );
    });

    it('should handle update task failure', async () => {
      const expectedStatus = 400;
      mockFetch.mockResolvedValueOnce({
        status: expectedStatus,
        json: () => Promise.resolve({ error: 'Bad Request' })
      });

      const result = await service.updateTask(mockTask, mockJwt);

      expect(result).toBe(expectedStatus);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});