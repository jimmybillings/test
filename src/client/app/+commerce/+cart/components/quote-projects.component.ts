import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Projects } from '../../components/projects';

@Component({
  moduleId: module.id,
  selector: 'quote-projects-component',
  templateUrl: 'quote-projects.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuoteProjectsComponent extends Projects {
  @Input() quoteType: 'standard' | 'provisionalOrder' | 'offlineAgreement' = 'standard';
  constructor() {
    super();
  }
}
