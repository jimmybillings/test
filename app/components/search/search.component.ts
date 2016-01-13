import {Component} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Response} from 'angular2/http';

import {
    RouteConfig, 
    ROUTER_DIRECTIVES, 
    ROUTER_PROVIDERS, 
    LocationStrategy, 
    HashLocationStrategy
} from 'angular2/router';

@Component({
  selector: 'search',
  templateUrl: '/app/components/search/search.html',
  directives: [ROUTER_DIRECTIVES],
  viewProviders: [HTTP_PROVIDERS]
})
export class Search {
    public url: string;
    public http: Http;
    constructor(http: Http){
         this.url = 'https://api.wzplatform.com/video/services/search/?keywords=+itemType:clip&page=1&pageSize=50&resultsPageNumber=1&resultPageSize&filter=+family:website&view=deep&filterString=filterString=allSearchable=description:tree description:frog&sortBy=-ingestedDateTimeSort;-supplierTier;-quality&auth=T3Delivery-api:deliver-mAdre4ec:2c3afb058e344237a1f508c3fe39a06d'
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI(this.url));
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }
}

