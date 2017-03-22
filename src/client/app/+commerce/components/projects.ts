import { Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Project } from '../../shared/interfaces/cart.interface';
import { Capabilities } from '../../shared/services/capabilities.service';

export class Projects {
  @Input() config: any;
  @Input() projects: Array<Project>;
  @Input() userCan: Capabilities;
  @Output() projectsNotify: EventEmitter<Object> = new EventEmitter<Object>();
  private selectedProject: Project;

  public projectsOtherThan(currentProject: Project) {
    return this.projects.filter(project => project.id !== currentProject.id);
  }

  public lineItemCountFor(project: any): number {
    return (project.lineItems || []).length;
  }

  public addProject(): void {
    this.projectsNotify.emit({ type: 'ADD_PROJECT' });
  }

  public onRemove(project: Project): void {
    this.projectsNotify.emit({ type: 'REMOVE_PROJECT', payload: project });
  }

  public onEdit(project: Project): void {
    this.selectProject(project);
    this.projectsNotify.emit({
      type: 'UPDATE_PROJECT',
      payload: Object.assign({ project: project, items: this.config.form.items })
    });
  }

  public delegate(message: any): void {
    this.projectsNotify.emit(message);
  }

  public selectProject(project: Project) {
    this.selectedProject = project;
    this.config.form.items = this.config.form.items.map((item: any) => {
      item.value = this.selectedProject[item.name];
      return item;
    });
  }
}
