import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Task } from './models/task.model';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskService } from './services/task.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [TaskListComponent, TaskFormComponent, RouterModule],
})
export class AppComponent {
  constructor(private readonly taskService: TaskService) {}
  _isUserLogged!: boolean;
  _isTaskToBeUpdated!: boolean;
  jwt = '';
  @ViewChild('user', { static: false }) user!: ElementRef;
  @ViewChild('password', { static: false }) password!: ElementRef;
  @ViewChild('successModal', { static: false }) successModal!: ElementRef;
  @ViewChild('errorModal', { static: false }) errorModal!: ElementRef;
  @ViewChild('notValidLoggingModal', { static: false }) notValidLoggingModal!: ElementRef;
  taskToUpdate!: Task;
  tasks: Task[] = [];

  @Input() set isUserLogged(_isUserLogged: boolean) {
    this._isUserLogged = _isUserLogged;
    this.getTasks();
  }

  @Input() set isTaskToBeUpdated(_isTaskToBeUpdated: boolean) {
    this._isTaskToBeUpdated = _isTaskToBeUpdated;
    this._isUserLogged = false;
  }

  async loggingUser() {
    const username = this.user.nativeElement.value;
    const password = this.password.nativeElement.value;
    const body = { username, password };
    const url = 'http://localhost:3000/auth/login';
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
      const jsonedResp = await res.json();
      this.jwt = jsonedResp.token;
      this.isUserLogged = true;
    } else {
      this.notValidLoggingModal.nativeElement.openAlert();
    }
  }

  async handleTaskCreated(task: Task) {
    console.log('The task created from the form is', task);
    const statusResult = await this.taskService.createTask(task, this.jwt);
    if (statusResult === 201) {
      this.successModal.nativeElement.openAlert();
      this.getTasks();
    } else {
      this.errorModal.nativeElement.openAlert();
    }
  }

  async handleTaskUpdated(task: Task) {
    const statusResult = await this.taskService.updateTask(task, this.jwt);
    if (statusResult === 200) {
      this.successModal.nativeElement.openAlert();
      this.isTaskToBeUpdated = false;
      this._isUserLogged = true;
      this.getTasks();
    } else {
      this.errorModal.nativeElement.openAlert();
    }
  }

  async handleTaskToUpdate(task: Task) {
    this.taskToUpdate = task;
    this.isTaskToBeUpdated = true;
  }

  async getTasks() {
    const { status, tasks } = await this.taskService.getTasks(this.jwt);
    console.warn('Get tasks result is', tasks);
    if (status === 200) {
      this.tasks = tasks;
    } else {
      this.errorModal.nativeElement.openAlert();
    }
  }
}
