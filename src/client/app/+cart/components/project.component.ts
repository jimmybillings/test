import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Project } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'project-component',
  templateUrl: 'project.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectComponent {
  @Input() project: Project;
  @Output() projectNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public removeProject(): void {
    this.projectNotify.emit({ type: 'REMOVE_PROJECT', payload: this.project });
  }
}
