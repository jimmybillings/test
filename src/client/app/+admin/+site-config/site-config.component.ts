import { Component, OnInit } from '@angular/core';
import { Router, RouteSegment } from '@angular/router';
import { ConfigService } from '../+config/config.service';

@Component({
  selector: 'site-config',
  templateUrl: 'app/+admin/+site-config/site-config.html',
  providers: [ConfigService]
})

export class SiteConfigComponent implements OnInit {
  public site: string;
  public config: Array<any>;
  public configType: string;

  constructor(public router: Router, public routeSegment: RouteSegment, public configService: ConfigService) {}

  ngOnInit() {
    this.configType = this.routeSegment.urlSegments[0].segment.split('-')[0];
    this.site = this.routeSegment.getParam('site');
    this.configService.getSiteConfig(1).subscribe(data => {
      this.config = Object.keys(data.json());
    });
  }
}
