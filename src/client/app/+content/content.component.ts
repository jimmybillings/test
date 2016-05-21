import {Component, OnInit} from '@angular/core';
import {Router, RouteSegment} from '@angular/router';
import {ContentService} from './content.service';

/**
 * Asset page component - renders an asset show page
 */
@Component({
  selector: 'cms',
  templateUrl: 'app/+content/content.html',
  providers: [ContentService]
})

export class ContentComponent implements OnInit {

  public content: string;
  public title: string;

  constructor(
    public contentService: ContentService,
    private _router: Router,
    private routeSegment: RouteSegment
  ) { }

  ngOnInit(): void {
    this.contentService.get(this.routeSegment.getParam('page')).subscribe(data => {
      this.content = data[0].content.rendered;
      this.title = data[0].title.rendered;
    });
  }

}
