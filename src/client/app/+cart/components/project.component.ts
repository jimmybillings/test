import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges } from '@angular/core';

import { Project } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'project-component',
  templateUrl: 'project.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectComponent implements OnChanges {
  @Input() project: Project;
  @Input() config: any;
  @Output() projectNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public ngOnChanges(changes: any): void {
    changes.config.currentValue.form.items.map((formField: {name: string, value: any}) => {
      formField.value = this.project[formField.name];
    });
  }

  public removeProject(): void {
    this.projectNotify.emit({ type: 'REMOVE_PROJECT', payload: this.project });
  }

  public editProject(formValue: any): void {
    Object.assign(this.project, formValue);
    this.projectNotify.emit({ type: 'UPDATE_PROJECT', payload: this.project });
  }
}
