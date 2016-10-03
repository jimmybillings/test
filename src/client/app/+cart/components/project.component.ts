import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { Project } from '../cart.interface';

@Component({
  moduleId: module.id,
  selector: 'project-component',
  styles: [`
    div {
      border: 1px solid black;
      margin-top: 10px;
      padding: 10px;
      height: 50px;
    }

    p {
      float: left;
      padding-right: 20px;
    }

    button {
      float: right;
    }
  `],
  template:  `
    <div>
      <p>Project Name: {{project.name}}</p>
      <p>Client Name: {{project.clientName}}</p>
      <p>Delivery Format and Codec: ?</p>
      <p>{{project.name}} Subtotal: {{project.subtotal}}</p>
      <button (click)="removeProject()">X</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectComponent {
  @Input() project: Project;
  @Output() projectNotify: EventEmitter<Object> = new EventEmitter<Object>();

  public removeProject(): void {
    this.projectNotify.emit({ type: 'REMOVE_PROJECT', payload: this.project });
  }
}
