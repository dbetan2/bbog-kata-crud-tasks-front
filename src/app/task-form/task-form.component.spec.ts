import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ElementRef } from '@angular/core';
import { SpAtRadioButtonCustomEvent } from '@npm-bbta/bbog-dig-dt-sherpa-lib/loader';
import { Task } from '../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    
    component.taskName = {
      nativeElement: { value: '' }
    } as ElementRef;
    component.taskDescription = {
      nativeElement: { value: '' }
    } as ElementRef;
    component.taskDueDate = {
      nativeElement: { value: '' }
    } as ElementRef;
    
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('radioSelected', () => {
    it('should set priority to high when high option is checked', () => {
      const mockEvent = {
        detail: [{ isChecked: 'true' }]
      } as SpAtRadioButtonCustomEvent<any>;

      component.radioSelected(mockEvent);

      expect(component.priority).toBe('high');
    });

    it('should set priority to low when high option is not checked', () => {
      const mockEvent = {
        detail: [{ isChecked: 'false' }]
      } as SpAtRadioButtonCustomEvent<any>;

      component.radioSelected(mockEvent);

      expect(component.priority).toBe('low');
    });
  });

  describe('createTask', () => {
    it('should emit new task with provided values', () => {
      const mockTitle = 'Test Task';
      const mockDescription = 'Test Description';
      const mockDueDate = '2024-10-23';
      component.priority = 'high';
      component.taskName.nativeElement.value = mockTitle;
      component.taskDescription.nativeElement.value = mockDescription;
      component.taskDueDate.nativeElement.value = mockDueDate;

      const emitSpy = jest.spyOn(component.taskCreated, 'emit');

      component.createTask();

      expect(emitSpy).toHaveBeenCalledWith({
        title: mockTitle,
        description: mockDescription,
        dueDate: mockDueDate,
        priority: 'high'
      });
    });

    it('should clean form after creating task', () => {
      component.taskName.nativeElement.value = 'Test';
      component.taskDescription.nativeElement.value = 'Description';
      component.taskDueDate.nativeElement.value = '2024-10-23';

      component.createTask();

      expect(component.taskName.nativeElement.value).toBeNull();
      expect(component.taskDescription.nativeElement.value).toBeNull();
      expect(component.taskDueDate.nativeElement.value).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should emit updated task with provided values and existing id', () => {
      const existingId = '123';
      component.taskToUpdate = { id: existingId } as Task;
      
      const mockTitle = 'Updated Task';
      const mockDescription = 'Updated Description';
      const mockDueDate = '2024-10-24';
      component.priority = 'low';
      
      component.taskName.nativeElement.value = mockTitle;
      component.taskDescription.nativeElement.value = mockDescription;
      component.taskDueDate.nativeElement.value = mockDueDate;

      const emitSpy = jest.spyOn(component.taskUpdated, 'emit');

      component.updateTask();

      expect(emitSpy).toHaveBeenCalledWith({
        id: existingId,
        title: mockTitle,
        description: mockDescription,
        dueDate: mockDueDate,
        priority: 'low'
      });
    });

    it('should clean form after updating task', () => {
      component.taskToUpdate = { id: '123' } as Task;
      component.taskName.nativeElement.value = 'Test';
      component.taskDescription.nativeElement.value = 'Description';
      component.taskDueDate.nativeElement.value = '2024-10-23';

      component.updateTask();

      expect(component.taskName.nativeElement.value).toBeNull();
      expect(component.taskDescription.nativeElement.value).toBeNull();
      expect(component.taskDueDate.nativeElement.value).toBeNull();
    });
  });

  describe('setValues', () => {
    it('should return null for empty values', () => {
      component.taskName.nativeElement.value = '';
      component.taskDescription.nativeElement.value = '';
      component.taskDueDate.nativeElement.value = '';
      component.priority = '';

      const result = component['setValues']();

      expect(result.title).toBeNull();
      expect(result.description).toBeNull();
      expect(result.taskDueDate).toBeNull();
      expect(result.priority).toBe('');
    });

    it('should return actual values when provided', () => {
      const mockTitle = 'Test Task';
      const mockDescription = 'Test Description';
      const mockDueDate = '2024-10-23';
      const mockPriority = 'high';

      component.taskName.nativeElement.value = mockTitle;
      component.taskDescription.nativeElement.value = mockDescription;
      component.taskDueDate.nativeElement.value = mockDueDate;
      component.priority = mockPriority;

      const result = component['setValues']();

      expect(result.title).toBe(mockTitle);
      expect(result.description).toBe(mockDescription);
      expect(result.taskDueDate).toBe(mockDueDate);
      expect(result.priority).toBe(mockPriority);
    });
  });
});