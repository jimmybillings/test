import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ContentService} from './content.service';

/**
 * Asset page component - renders an asset show page
 */
@Component({
  moduleId: module.id,
  selector: 'cms',
  templateUrl: 'content.html',
  providers: [ContentService]
})

export class ContentComponent implements OnInit {

  public content: string;
  public title: string;

  constructor(
    public contentService: ContentService,
    private _router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contentService.get(params['page']).subscribe(data => {
        this.content = data[0].content.rendered;
        this.title = data[0].title.rendered;
      });
    });
  }

}
