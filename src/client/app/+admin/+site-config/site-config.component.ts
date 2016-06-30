import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  moduleId: module.id,
  selector: 'site-config',
  templateUrl: 'site-config.html'
})

export class SiteConfigComponent implements OnInit, OnDestroy {
  public siteName: string;
  public configType: string;
  public sub: any;

  constructor(public router: Router,
              public route: ActivatedRoute,
              public configService: ConfigService) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => this.siteName = params['site']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
