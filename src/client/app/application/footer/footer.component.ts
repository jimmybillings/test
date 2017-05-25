import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { UiConfig } from '../../shared/services/ui.config';
import { Subscription } from 'rxjs/Subscription';
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
  public configSubscription: Subscription;

  constructor(public uiConfig: UiConfig) { }

  ngOnInit() {
    this.lang = this.supportedLanguages[0].code;
    this.uiConfig.get('footer').take(1).subscribe((config) => {
      this.config = config.config;
    });
  }

  public selectLang(lang: any) {
    this.onChangeLang.emit(lang.value);
  }
}
