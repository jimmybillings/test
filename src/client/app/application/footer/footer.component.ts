import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
  @Input() currentUser: any;
  @Input() supportedLanguages: any;
  @Output() onChangeLang = new EventEmitter();
  public lang: any;
  public config: any;

  constructor(public store: AppStore) { }

  ngOnInit() {
    this.lang = this.supportedLanguages[0].code;
    this.config = this.store.snapshot(state => state.uiConfig.components.footer.config);
  }
}
