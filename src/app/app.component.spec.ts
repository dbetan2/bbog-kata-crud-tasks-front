import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';
import { Task } from './models/task.model';
import { ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let taskService: jest.Mocked<TaskService>;
  let mockFetch: jest.Mock;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    dueDate: '2024-10-23'
  };

  beforeEach(async () => {
    // Mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Mock TaskService
    taskService = {
      createTask: jest.fn(),
      updateTask: jest.fn(),
      getTasks: jest.fn().mockResolvedValue({ status: 200, tasks: [] }),
      deleteTask: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule],
      providers: [
        { provide: TaskService, useValue: taskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Mock ViewChild elements
    component.user = {
      nativeElement: { value: '' }
    } as ElementRef;
    component.password = {
      nativeElement: { value: '' }
    } as ElementRef;
    component.successModal = {
      nativeElement: { openAlert: jest.fn() }
    } as any as ElementRef;
    component.errorModal = {
      nativeElement: { openAlert: jest.fn() }
    } as any as ElementRef;
    component.notValidLoggingModal = {
      nativeElement: { openAlert: jest.fn() }
    } as any as ElementRef;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loggingUser', () => {
    it('should set jwt and isUserLogged on successful login', async () => {
      // Arrange
      const mockToken = 'mock-jwt-token';
      mockFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve({ token: mockToken })
      });
      
      component.user.nativeElement.value = 'testuser';
      component.password.nativeElement.value = 'testpass';

      // Act
      await component.loggingUser();

      // Assert
      expect(component.jwt).toBe(mockToken);
      expect(component._isUserLogged).toBe(true);
    });

    it('should show error modal on failed login', async () => {
      // Arrange
      mockFetch.mockResolvedValueOnce({
        status: 401,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      });
      
      const openAlertSpy = jest.spyOn(component.notValidLoggingModal.nativeElement, 'openAlert');

      // Act
      await component.loggingUser();

      // Assert
      expect(openAlertSpy).toHaveBeenCalled();
      expect(component._isUserLogged).toBeFalsy();
    });
  });

  describe('handleTaskCreated', () => {
    it('should show success modal and refresh tasks on successful creation', async () => {
      // Arrange
      taskService.createTask.mockResolvedValueOnce(201);
      const successModalSpy = jest.spyOn(component.successModal.nativeElement, 'openAlert');
      const getTasksSpy = jest.spyOn(component, 'getTasks');

      // Act
      await component.handleTaskCreated(mockTask);

      // Assert
      expect(successModalSpy).toHaveBeenCalled();
      expect(getTasksSpy).toHaveBeenCalled();
    });

    it('should show error modal on failed creation', async () => {
      // Arrange
      taskService.createTask.mockResolvedValueOnce(400);
      const errorModalSpy = jest.spyOn(component.errorModal.nativeElement, 'openAlert');

      // Act
      await component.handleTaskCreated(mockTask);

      // Assert
      expect(errorModalSpy).toHaveBeenCalled();
    });
  });

  describe('handleTaskUpdated', () => {
    it('should show success modal and refresh tasks on successful update', async () => {
      // Arrange
      taskService.updateTask.mockResolvedValueOnce(200);
      const successModalSpy = jest.spyOn(component.successModal.nativeElement, 'openAlert');
      const getTasksSpy = jest.spyOn(component, 'getTasks');

      // Act
      await component.handleTaskUpdated(mockTask);

      // Assert
      expect(successModalSpy).toHaveBeenCalled();
      expect(getTasksSpy).toHaveBeenCalled();
      expect(component._isTaskToBeUpdated).toBe(false);
      expect(component._isUserLogged).toBe(true);
    });

    it('should show error modal on failed update', async () => {
      // Arrange
      taskService.updateTask.mockResolvedValueOnce(400);
      const errorModalSpy = jest.spyOn(component.errorModal.nativeElement, 'openAlert');

      // Act
      await component.handleTaskUpdated(mockTask);

      // Assert
      expect(errorModalSpy).toHaveBeenCalled();
    });
  });

  describe('handleTaskToUpdate', () => {
    it('should set task to update and update flags', async () => {
      // Act
      await component.handleTaskToUpdate(mockTask);

      // Assert
      expect(component.taskToUpdate).toBe(mockTask);
      expect(component._isTaskToBeUpdated).toBe(true);
    });
  });

  describe('getTasks', () => {
    it('should update tasks array on successful fetch', async () => {
      // Arrange
      const mockTasks = [mockTask];
      taskService.getTasks.mockResolvedValueOnce({
        status: 200,
        tasks: mockTasks
      });

      // Act
      await component.getTasks();

      // Assert
      expect(component.tasks).toEqual(mockTasks);
    });

    it('should show error modal on failed fetch', async () => {
      // Arrange
      taskService.getTasks.mockResolvedValueOnce({
        status: 401,
        tasks: []
      });
      const errorModalSpy = jest.spyOn(component.errorModal.nativeElement, 'openAlert');

      // Act
      await component.getTasks();

      // Assert
      expect(errorModalSpy).toHaveBeenCalled();
    });
  });

  describe('Input setters', () => {
    it('should call getTasks when isUserLogged is set to true', () => {
      // Arrange
      const getTasksSpy = jest.spyOn(component, 'getTasks');

      // Act
      component.isUserLogged = true;

      // Assert
      expect(getTasksSpy).toHaveBeenCalled();
    });

    it('should update flags when isTaskToBeUpdated is set', () => {
      // Act
      component.isTaskToBeUpdated = true;

      // Assert
      expect(component._isTaskToBeUpdated).toBe(true);
      expect(component._isUserLogged).toBe(false);
    });
  });
});