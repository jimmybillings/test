import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'project-info-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h5 md-display-1>
      <span class="project-label md-caption">{{ 'CART.PROJECTS.PROJECT_NAME' | translate }}</span>
      <span class="project-name">{{ name }}</span>
    </h5>
    <span class="project-client md-caption">
      <strong>{{ 'CART.PROJECTS.CLIENT_NAME' | translate }}</strong> 
      {{ clientName }}
    </span>
  `
})
export class ProjectInfoComponent {
  @Input() name: string;
  @Input() clientName: string;
}
