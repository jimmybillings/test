import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
import {AssetDetail} from '../../components/asset-detail/asset-detail.component';
import {CurrentUser} from '../../common/models/current-user.model';
import {UiConfig} from '../../common/config/ui.config';
import {AssetService} from './services/asset.service';
import {Observable} from 'rxjs/Rx';
import { Error } from '../../common/services/error.service';

/**
 * Asset page component - renders an asset show page
 */
@Component({
  selector: 'asset',
  templateUrl: 'containers/asset/asset.html',
  directives: [NgStyle, CORE_DIRECTIVES, AssetDetail],
  viewProviders: [HTTP_PROVIDERS],
  pipes: [TranslatePipe]
})

export class Asset {
  public assetDetail: Observable<any>;
  public config: UiConfig;
  public subscription: any;
  
  constructor(
    private routeParams: RouteParams,
    public currentUser: CurrentUser,
    public uiConfig: UiConfig,
    public assetService: AssetService,
    public error: Error) {
      this.assetDetail = assetService.asset;
  }

  ngOnInit(): void {
    this.subscription = this.assetDetail.subscribe(data => this.assetDetail = data);
    this.assetService.initialize(this.routeParams.get('name')).subscribe(
      payload => {
        this.assetService.set(payload);
        console.log(payload);
      },
      error => this.error.handle(error)
      
    );
    
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.assetService.reset();
  }
  
  

}
