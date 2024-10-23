import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { ElementRef } from '@angular/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jest.Mocked<TaskService>;
  
  const mockJwt = 'mock-jwt-token';
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      priority: 'high',
      dueDate: '2024-10-23'
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      priority: 'low',
      dueDate: '2024-10-24'
    }
  ];

  beforeEach(async () => {
    taskService = {
      deleteTask: jest.fn().mockResolvedValue(undefined)
    } as any;

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    
    component.jwt = mockJwt;
    component.tasks = [...mockTasks];

    component.successModal = {
      nativeElement: { openAlert: jest.fn() }
    } as any as ElementRef;
    component.deleteSuccessModal = {
      nativeElement: { openAlert: jest.fn() }
    } as any as ElementRef;
    component.errorModal = {
      nativeElement: { openAlert: jest.fn() }
    } as any as ElementRef;

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteTask', () => {
    it('should remove task from tasks array', async () => {
      const initialLength = component.tasks.length;
      const indexToDelete = 0;
      const taskIdToDelete = mockTasks[0].id;

      await component.deleteTask(indexToDelete, taskIdToDelete);

      expect(component.tasks.length).toBe(initialLength - 1);
    });

    it('should call taskService.deleteTask with correct parameters', async () => {
      const indexToDelete = 0;
      const taskIdToDelete = mockTasks[0].id;

      await component.deleteTask(indexToDelete, taskIdToDelete);

      expect(taskService.deleteTask).toHaveBeenCalledWith(String(taskIdToDelete), mockJwt);
    });

    it('should open delete success modal after successful deletion', async () => {
      const indexToDelete = 0;
      const taskIdToDelete = mockTasks[0].id;
      const openAlertSpy = jest.spyOn(component.deleteSuccessModal.nativeElement, 'openAlert');

      await component.deleteTask(indexToDelete, taskIdToDelete);

      expect(openAlertSpy).toHaveBeenCalled();
    });

    it('should not call taskService.deleteTask if taskId is undefined', async () => {
      const indexToDelete = 0;
      const taskIdToDelete = undefined;

      await component.deleteTask(indexToDelete, taskIdToDelete);

      expect(taskService.deleteTask).not.toHaveBeenCalled();
    });

    it('should still remove task from array even if taskId is undefined', async () => {
      const initialLength = component.tasks.length;
      const indexToDelete = 0;
      const taskIdToDelete = undefined;

      await component.deleteTask(indexToDelete, taskIdToDelete);

      expect(component.tasks.length).toBe(initialLength - 1);
    });
  });

  describe('updateTask', () => {
    it('should emit task to update', async () => {
      const indexToUpdate = 0;
      const taskToUpdate = mockTasks[0];
      const emitSpy = jest.spyOn(component.taskToUpdate, 'emit');

      await component.updateTask(indexToUpdate, taskToUpdate);

      expect(emitSpy).toHaveBeenCalledWith(taskToUpdate);
    });

    it('should log task to update', async () => {
      const indexToUpdate = 0;
      const taskToUpdate = mockTasks[0];
      const consoleSpy = jest.spyOn(console, 'log');

      await component.updateTask(indexToUpdate, taskToUpdate);

      expect(consoleSpy).toHaveBeenCalledWith('The task to update from task list', taskToUpdate);
    });

    it('should handle undefined task', async () => {
      const indexToUpdate = 0;
      const undefinedTask = undefined as unknown as Task;
      const emitSpy = jest.spyOn(component.taskToUpdate, 'emit');

      await component.updateTask(indexToUpdate, undefinedTask);

      expect(emitSpy).toHaveBeenCalledWith(undefinedTask);
    });
  });

  describe('Input properties', () => {
    it('should initialize with empty tasks array by default', () => {
      const newComponent = new TaskListComponent(taskService);

      expect(newComponent.tasks).toEqual([]);
    });

    it('should accept tasks input', () => {
      component.tasks = mockTasks;

      expect(component.tasks).toEqual(mockTasks);
    });

    it('should require jwt input', () => {
      expect(component.jwt).toBe(mockJwt);
    });
  });
});