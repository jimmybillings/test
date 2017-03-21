import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Projects } from '../../components/projects';

@Component({
  moduleId: module.id,
  selector: 'projects-component',
  templateUrl: 'projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectsComponent extends Projects {
  @Input() readOnly: boolean = false;

  constructor() {
    super();
  }
}
