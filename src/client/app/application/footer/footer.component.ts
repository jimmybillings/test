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
  public currentSite: string = localStorage.getItem('currentSite') || 'commerce';
  public config: any;
  public configSubscription: Subscription;
  public sites: string[] = [
    'core', 'commerce', 'usopen', 'cnn', 'usta-usopen',
    'bbcws', 'hbo-boxing', 'wpt', 'dvids', 'augusta',
    'laac', 'cfp', 'sony', 'augusta', 'augusta', 'nab', 'amblin'
  ];

  constructor(
    public uiConfig: UiConfig) { }

  ngOnInit() {
    this.lang = this.supportedLanguages[0].code;
    this.configSubscription = this.uiConfig.get('footer').subscribe((config) => {
      this.config = config.config;
    });
  }

  public selectLang(lang: any) {
    this.onChangeLang.emit(lang.value);
  }

  public selectSite(site: any) {
    localStorage.clear();
    localStorage.setItem('currentSite', site.value);
    location.reload();
  }

  public isPocNineTeen() {
    return location.host.indexOf('poc19') > -1 || location.host.indexOf('localhost') > -1;
  }
}
