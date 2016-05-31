import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouteSegment } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { WzListComponent } from '../../shared/components/wz-list/wz.list.component';
import { ValuesPipe } from '../../shared/pipes/values.pipe';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'admin-ui-config',
  templateUrl: 'ui-config.html',
  providers: [ConfigService],
  directives: [WzListComponent],
  pipes: [ValuesPipe]
})

export class UiConfigComponent implements OnInit, OnDestroy {
  public site: string;
  public config: any;
  public currentConfigOptions: any;
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
      this.config = data;
      this.items = Object.keys(data.components);
    });
  }

  public show(item: any): void {
    this.currentConfigOptions = Object.keys(this.config.components[item].config);
  }

  public buildForm(item: any): void {
    console.log(item);
  }
}
