import { Component, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'project-info-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h5 mat-display-1>
      <span class="project-label mat-caption">{{ 'CART.PROJECTS.PROJECT_NAME' | translate }}</span>
      <span class="project-name">{{ name }}</span>
      </h5>
      <span class="project-client mat-caption">
      <strong>{{ 'CART.PROJECTS.CLIENT_NAME' | translate }}</strong> 
      {{ clientName }}
      </span>
    <section>
  `
})
export class ProjectInfoComponent {
  @Input() name: string;
  @Input() clientName: string;
  @Input() readOnly: boolean = false;
}
