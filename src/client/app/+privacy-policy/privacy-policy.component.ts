import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectionStrategy } from '@angular/core';

import { AppStore } from '../app.store';

@Component({
  moduleId: module.id,
  selector: 'privacy-policy-component',
  templateUrl: `./privacy-policy.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    .privacy-policy mat-card { margin: 20px 0; }
    `
  ]
})
export class PrivacyPolicyComponent {
  constructor(private store: AppStore) { }

  public get document(): Observable<any> {
    return this.store.select(state => state.privacyPolicy.document);
  }
}
