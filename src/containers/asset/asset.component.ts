import {Component, DynamicComponentLoader, Injector} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
import {AssetDetail} from '../../components/asset-detail/asset-detail.component';
import {CurrentUser, isLoggedIn} from '../../common/models/current-user.model';
import {UiConfig} from '../../common/config/ui.config';
import {AssetService} from './services/asset.service';
import {Player} from '../../components/player/player.component';
import {Observable} from 'rxjs/Observable';

/**
 * Asset page component - renders an asset show page
 */
@Component({
  selector: 'asset',
  templateUrl: 'containers/asset/asset.html',
  directives: [NgStyle, CORE_DIRECTIVES, AssetDetail],
  viewProviders: [HTTP_PROVIDERS],
  providers: [AssetService],
  pipes: [TranslatePipe]
})

export class Asset {
  public assetDetail: Observable<any>;
  public config: UiConfig;
  public subscription: any;

  constructor(
    private _router: Router,
    private routeParams: RouteParams,
    public currentUser: CurrentUser,
    public uiConfig: UiConfig,
    public assetService: AssetService,
    public dcl: DynamicComponentLoader,
    public injector: Injector) {
    this.assetDetail = assetService.asset;
    assetService.set(this.routeParams.get('name'));
  }

  ngOnInit(): void {
    this.subscription = this.assetDetail.subscribe(data => {
      this.assetDetail = data;
      if (data.name) this._loadVideo(data.name);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.assetService.reset();
  }
  
  routerOnActivate(): void {
    if (!isLoggedIn()) this._router.navigate(['/UserManagement/Login']);
  }

  private _loadVideo(video: string): void {
    this.dcl.loadAsRoot(Player, '#player', this.injector).then(component => component.instance.set(video));
  }
}
