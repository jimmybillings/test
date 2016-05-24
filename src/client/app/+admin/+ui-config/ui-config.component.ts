import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouteSegment } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'ui-config',
  templateUrl: 'app/+admin/+ui-config/ui-config.html',
  providers: [ConfigService]
})

export class UiConfigComponent implements OnInit, OnDestroy {
  public site: string;
  public config: any;
  public items: Array<any>;
  public configType: string;
  public subscription: Subscription;

  constructor(public router: Router, public routeSegment: RouteSegment, public configService: ConfigService) {}

  ngOnInit() {
    this.configType = this.routeSegment.urlSegments[0].segment.split('-')[0];
    this.site = this.routeSegment.getParam('site');
    this.getConfig();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public getConfig(): void {
    this.configService.getUiConfig(this.site).subscribe(data => {
      this.configService.setConfig(data);
      this.subscription = this.configService.configStore.subscribe(data => {
        this.config = data;
        this.items = Object.keys(data.components);
      });
    });
  }
}
