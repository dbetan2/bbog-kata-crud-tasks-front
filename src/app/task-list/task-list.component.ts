import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass'],
})
export class TaskListComponent {
  constructor(private readonly taskService: TaskService) {}
  @Input() tasks: Task[] = [];
  @Input() jwt!: string;
  @Output() taskToUpdate = new EventEmitter();
  @ViewChild('successModal', { static: false }) successModal!: ElementRef;
  @ViewChild('deleteSuccessModal', { static: false })
  deleteSuccessModal!: ElementRef;
  @ViewChild('errorModal', { static: false }) errorModal!: ElementRef;

  async deleteTask(index: number, taskId: string | undefined) {
    this.tasks.splice(index, 1);
    if (taskId) {
      await this.taskService.deleteTask(taskId, this.jwt);
      this.deleteSuccessModal.nativeElement.openAlert();
    }
  }

  async updateTask(_index: number, task: Task) {
    console.log('The task to update from task list', task);
    this.taskToUpdate.emit(task);
  }
}
