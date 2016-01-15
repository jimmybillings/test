import {Component} from 'angular2/core';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
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
  directives: [ROUTER_DIRECTIVES, NgStyle, CORE_DIRECTIVES],
  viewProviders: [HTTP_PROVIDERS]
})

export class Search {
    public url: string;
    public http: Http;
    public results: Object;
    
    constructor(http: Http){
        this.http = http;
        this.url = 'http://localhost:3000/api/search/index?keywords=+itemType:clip&page=10&pageSize=50&resultsPageNumber=10&resultPageSize=20'
        this.getResults();
    }
    
    getResults() {
        this.http.get(this.url)
            .subscribe((res:Response) => {
               this.results = res.json()['clip-list']['clip']
            });
    }

    clipRendition(rendition) {
        let bestRendition;
        bestRendition = (rendition.url) ? rendition.url :
        rendition.filter(function(rend){
            if (rend.purpose === "Thumbnail" && rend.size === "Large") {
                return rend;
            }
        })[0];
        return bestRendition || '';
    }
}

