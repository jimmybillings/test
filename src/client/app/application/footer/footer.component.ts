import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AppStore } from '../../app.store';

/**
 * site footer component - renders the footer information
 */
@Component({
  moduleId: module.id,
  selector: 'app-footer',
  templateUrl: 'footer-cms.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FooterComponent {
  public footer: Observable<any>;
  @Input() config: any;

  constructor(private store: AppStore) {
    this.store.dispatch(factory => factory.cms.loadFooter());
    this.footer = this.store.select(factory => factory.cms.footer);
    // let f = this.footer.filter(f => f !== null).subscribe(f => console.log(f));
  }

  public get privacyPolicyExists(): boolean {
    return this.config &&
      this.config.hasOwnProperty('privacyPolicyId') &&
      this.config.privacyPolicyId.hasOwnProperty('value') &&
      this.config.privacyPolicyId.value !== '';
  }

  public get showContacts(): boolean {
    return this.config &&
      this.config.hasOwnProperty('contacts') &&
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
