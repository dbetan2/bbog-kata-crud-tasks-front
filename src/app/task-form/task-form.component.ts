import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Task } from '../models/task.model';
import { SpAtRadioButtonCustomEvent } from '@npm-bbta/bbog-dig-dt-sherpa-lib/loader';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [],
  styleUrls: ['./task-form.component.sass'],
})
export class TaskFormComponent {
  @Input() taskToUpdate: Task | undefined;
  @Input() IsTaskUpdating: boolean | undefined;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @ViewChild('taskName', { static: false }) taskName!: ElementRef;
  @ViewChild('taskDescription', { static: false }) taskDescription!: ElementRef;
  @ViewChild('taskDueDate', { static: false }) taskDueDate!: ElementRef;
  priority = '';

  radioSelected(event: SpAtRadioButtonCustomEvent<any>) {
    const isHighOptionChecked = event.detail[0].isChecked;
    console.log('isHighOptionChecked', isHighOptionChecked);
    this.priority = isHighOptionChecked === 'true' ? 'high' : 'low';
  }

  createTask() {
    const { description, priority, taskDueDate, title } = this.setValues();
    const newTask: Task = {
      title: String(title), // we cast just to check if api gives 400 when it is undefined
      description: String(description),
      dueDate: String(taskDueDate),
      priority,
    };
    this.taskCreated.emit(newTask);
    this.cleanForm();
  }

  private setValues() {
    const getValue = (elementRef: ElementRef): string | undefined => {
      const value = elementRef?.nativeElement.value;
      return value && value !== '' ? value : null;
    };

    return {
      title: getValue(this.taskName),
      description: getValue(this.taskDescription),
      taskDueDate: getValue(this.taskDueDate),
      priority: this.priority,
    };
  }

  updateTask() {
    console.warn('Task to update in form:', this.taskToUpdate);
    const { description, priority, taskDueDate, title } = this.setValues();
    const updateTask: Task = {
      id: this.taskToUpdate?.id,
      title: String(title), // we cast just to check if api gives 400 when it is undefined
      description: String(description),
      dueDate: String(taskDueDate),
      priority,
    };
    this.taskUpdated.emit(updateTask);
    console.log('emitting event update task', updateTask);
    this.cleanForm();
  }

  private cleanForm() {
    this.taskName.nativeElement.value = null;
    this.taskDescription.nativeElement.value = null;
    this.taskDueDate.nativeElement.value = null;
  }
}
