import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Project } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'projects-component',
  styles: [`
    button {
      margin-top: 10px;
    }
  `],
  template: `
    <project-component *ngFor="let project of projects" [project]="project" (projectNotify)="delegate($event)"></project-component>
    <div flex="95" layout="row" layout-align="end center">
      <button md-raised-button="" (click)="addProject()">ADD PROJECT</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectsComponent {
  @Input() projects: Array<Project>;
  @Output() projectsNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public addProject(): void {
    this.projectsNotify.emit({ type: 'ADD_PROJECT' });
  }

  public delegate(message: any): void {
    this.projectsNotify.emit(message);
  }
}