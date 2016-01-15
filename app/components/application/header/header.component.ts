import {Component} from 'angular2/core';
// import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material/all';
import {
    RouteConfig, 
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS, 
    LocationStrategy, 
    HashLocationStrategy,
    AsyncRoute
} from 'angular2/router';

@Component({
  selector: 'app-header',
  templateUrl: '/app/components/application/header/header.html',
  directives: [ROUTER_DIRECTIVES]
})

export class Header {    
  
}
