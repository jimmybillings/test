import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouteSegment} from '@angular/router';
import {AssetDetailComponent} from '../shared/components/asset-detail/asset-detail.component';
import {CurrentUser} from '../shared/services/current-user.model';
import {AssetService} from './services/asset.service';
import {Observable} from 'rxjs/Rx';
import { Error } from '../shared/services/error.service';

/**
 * Asset page component - renders an asset show page
 */
@Component({
  selector: 'asset',
  templateUrl: 'app/+asset/asset.html',
  directives: [AssetDetailComponent]
})

export class AssetComponent implements OnInit, OnDestroy {
  public assetDetail: Observable<any>;
  public assetDetailDisplay: Object;
  public subscription: any;

  constructor(
    private routeSegment: RouteSegment,
    public currentUser: CurrentUser,
    public assetService: AssetService,
    public error: Error) {
    this.assetDetail = assetService.asset;
  }

  ngOnInit(): void {
    this.assetService
      .initialize(this.routeSegment.getParam('name'))
      .subscribe((payload) => {
        this.assetService.set(payload);
        this.subscription = this.assetDetail.subscribe(data => this.assetDetailDisplay = data);
      },
      error => this.error.handle(error)
      );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.assetService.reset();
  }
}
