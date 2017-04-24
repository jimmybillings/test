import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Project, PurchaseType } from '../../../shared/interfaces/commerce.interface';
import { Capabilities } from '../../../shared/services/capabilities.service';

@Component({
  moduleId: module.id,
  selector: 'projects-component',
  templateUrl: 'projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {
  @Input() readOnly: boolean = false;
  @Input() config: any;
  @Input() projects: Array<Project>;
  @Input() userCan: Capabilities;
  @Input() quoteType: PurchaseType;
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

  public addBulkOrderId() {
    this.projectsNotify.emit({ type: 'ADD_BULK_ORDER_ID' });
  }

  public editDiscount() {
    this.projectsNotify.emit({ type: 'EDIT_DISCOUNT' });
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
