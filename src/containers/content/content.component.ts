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
  public title: string;
  
  constructor(
    private _router: Router,
    private routeParams: RouteParams,
    private contentService: ContentService) {}
  
  ngOnInit(): void {
    this.contentService.get(this.routeParams.get('page')).subscribe(data => {
      this.content = data[0].content.rendered;
      this.title = data[0].title.rendered;
    });
  }
 
}
