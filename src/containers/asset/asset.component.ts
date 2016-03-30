import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
// import { AssetData } from './services/asset.data.service';
import {AssetDetail} from '../../components/asset-detail/asset-detail.component';
import {CurrentUser} from '../../common/models/current-user.model';
import {UiConfig} from '../../common/config/ui.config';
import {Observable} from 'rxjs/Observable';
import {AssetService} from './services/asset.service';


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
  public config: Object;
  public components: Object;
  
  constructor(
    private _router: Router,
    private routeParams: RouteParams,
    public currentUser: CurrentUser,
    public uiConfig: UiConfig, 
    public assetService: AssetService) {
      this.assetDetail = assetService.asset;
  }
  
  ngOnInit() {
    // this.uiConfig.get('asset').subscribe((config) => {
    //   this.components = config.components;
    //   this.config = config.config;
    // }); 
  }
}
