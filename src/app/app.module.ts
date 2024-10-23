import { NgModule } from '@angular/core';
import { BrowserModule, platformBrowser } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TaskFormComponent,
    TaskListComponent,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppModule],
})
export class AppModule {}
platformBrowser().bootstrapModule(AppModule);
