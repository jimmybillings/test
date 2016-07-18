import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'site-config',
  templateUrl: 'site-config.html'
})

export class SiteConfigComponent implements OnInit, OnDestroy {
  public siteName: string;
  public routeSubscription: Subscription;

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => this.siteName = params['site']);
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
