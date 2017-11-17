import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { AppStore } from '../../app.store';
/**
 * site footer component - renders the footer information
 */
@Component({
  moduleId: module.id,
  selector: 'app-footer',
  templateUrl: 'footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FooterComponent implements OnInit {
  public config: any;

  constructor(public store: AppStore) { }

  ngOnInit() {
    this.store.selectCloned(state => state.uiConfig)
      .filter(state => state.loaded)
      .do(config => {
        this.config = config.components.footer.config;
      }).take(1).subscribe();
  }

  public get privacyPolicyExists(): Observable<boolean> {
    return this.store.selectCloned(state => state.uiConfig)
      .filter(state => state.loaded)
      .map(state =>
        !!state.components.footer.config.privacyPolicyId &&
        !!state.components.footer.config.privacyPolicyId.value &&
        state.components.footer.config.privacyPolicyId.value !== ''
      );
  }

  public get showContacts(): boolean {
    return this.config.hasOwnProperty('contacts') &&
      this.config.contacts.hasOwnProperty('items') &&
      this.config.contacts.items.length > 0;
  }

  public get contacts(): any {
    return this.config.contacts.items;
  }

  public show(value: string): boolean {
    return value !== undefined;
  }
}
