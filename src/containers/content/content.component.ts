import {Component} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ContentService} from './content.service';
/**
 * Asset page component - renders an asset show page
 */  
@Component({
  selector: 'cms',
  templateUrl: 'containers/content/content.html',
  directives: [CORE_DIRECTIVES],
  providers: [ContentService]
})

export class Content {
  
  public content: string;
  
  constructor(
    private _router: Router,
    private routeParams: RouteParams,
    private contentService: ContentService) {
      contentService.get(this.routeParams.get('id')).subscribe(data => this.content = data.content.rendered);
  }
 
}
