import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';

import { Project } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'projects-component',
  templateUrl: 'projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectsComponent implements OnChanges {
  @Input() config: any;
  @Input() projects: Array<Project>;
  @Output() projectsNotify: EventEmitter<Object> = new EventEmitter<Object>();

  // TODO: FIX ME!
  public ngOnChanges(changes: any): void {
    if (!changes.config) return;

    changes.config.currentValue.form.items.map((formField: {name: string, value: any}) => {
      // Need to know which project we are operating on...
      // formField.value = this.project[formField.name];
    });
  }

  public projectsOtherThan(currentProject: Project) {
    return this.projects.filter(project => project.id !== currentProject.id);
  }

  public addProject(): void {
    this.projectsNotify.emit({ type: 'ADD_PROJECT' });
  }

  public remove(project: Project): void {
    this.projectsNotify.emit({ type: 'REMOVE_PROJECT', payload: project });
  }

  public edit(project: Project, formValue: any): void {
    Object.assign(project, formValue);
    this.projectsNotify.emit({ type: 'UPDATE_PROJECT', payload: project });
  }

  public delegate(message: any): void {
    this.projectsNotify.emit(message);
  }
}
