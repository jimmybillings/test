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

  public get privacyPolicyExists(): boolean {
    if (!this.config) return false;
    return !!this.config.privacyPolicyId && !!this.config.privacyPolicyId.value && this.config.privacyPolicyId.value !== '';
  }
}
