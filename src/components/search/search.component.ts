import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {HTTP_PROVIDERS, Response} from 'angular2/http';
import {NgStyle, CORE_DIRECTIVES} from 'angular2/common';
import { AssetData } from '../../common/services/asset.data.service';
import { AssetList }  from './asset-list/asset-list.component';
import {Asset} from '../../common/interfaces/asset.interface';

// import 'rxjs/add/operator/map';

@Component({
  selector: 'search',
  templateUrl: 'components/search/search.html',
  directives: [NgStyle, CORE_DIRECTIVES, AssetList],
  viewProviders: [HTTP_PROVIDERS, AssetData]
})

export class Search {
  
  public assets: Asset[];
  public errorMessage: string;
  private _params: Object;

  constructor(
    private _router: Router,
    public routeParams: RouteParams,
    public _assetData: AssetData) {
    this._params = routeParams.params;
  }
  
  ngOnInit(): void {
    this.searchAssets();
  }
  
  public searchAssets(): void {
    // console.log(this._params);
      this._assetData.getAssets(this._params)
        .subscribe(
          assets => this.assets = assets,
          error =>  this.errorMessage = <any>error);
        
    // this._asset.getAssets(this._query).subscribe((res:Response) => {
    //   console.log(res.json());
    // });
  }

   public searchAssets2(): void {
    // this._assetData.getAssets(this._params)
      // .subscribe(
      //   assets => this.assets = assets,
      //   error =>  this.errorMessage = <any>error);
    this._assetData.getAssets(this._params).subscribe((res:Response) => {
      console.log(res.json());
    });
  }
 
 
 
 
 
 
 
 
    // public url: string;
    // public http: Http;
    // public results: Object;

    // constructor(http: Http) {
    //     this.http = http;
    //     this.url = '';
    // }

    // clipRendition(rendition): String {
    //     let bestRendition;
    //     bestRendition = (rendition.url) ? rendition.url :
    //     rendition.filter(function(rend){
    //         if (rend.purpose === 'Thumbnail' && rend.size === 'Large') {
    //             return rend;
    //         }
    //     })[0];
    //     this._getResults();
    //     return bestRendition || '';
    // }
    
    // private _getResults(): void {
    //   this.results = this.http.get(this.url)
    //     .map((res:Response) => {
    //         return res.json()['clip-list']['clip'];
    //     });
    // }
}

