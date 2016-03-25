import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {AssetDetail} from '../../components/asset-detail/asset-detail.component';

/**
 * Asset page component - renders an asset show page
 */  

@Component({
  selector: 'asset',
  template: '<router-outlet></router-outlet>',
  directives: ROUTER_DIRECTIVES,
  providers: [Asset]
})

@RouteConfig([
  { path: '/:name', component: AssetDetail, name: 'AssetDetail' },
])

export class Asset {
}
