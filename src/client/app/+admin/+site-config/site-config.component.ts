import { Component, OnInit } from '@angular/core';
import { Router, RouteSegment } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  moduleId: module.id,
  selector: 'site-config',
  templateUrl: 'site-config.html',
  providers: [ConfigService]
})

export class SiteConfigComponent implements OnInit {
  public siteName: string;
  public configType: string;

  constructor(public router: Router,
              public routeSegment: RouteSegment,
              public configService: ConfigService) {}

  ngOnInit() {
    this.configType = this.routeSegment.urlSegments[0].segment.split('-')[0];
    this.siteName = this.routeSegment.getParam('site');
  }
}
