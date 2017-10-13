import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { UiConfig } from '../../shared/services/ui.config';
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

  constructor(public uiConfig: UiConfig) { }

  ngOnInit() {
    this.uiConfig.get('footer').take(1).subscribe((config) => {
      this.config = config.config;
    });
  }
}
