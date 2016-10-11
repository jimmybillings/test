import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ContentService} from './content.service';
import { Subscription } from 'rxjs/Rx';
/**
 * Asset page component - renders an asset show page
 */
@Component({
  moduleId: module.id,
  selector: 'cms-component',
  templateUrl: 'content.html'
})

export class ContentComponent implements OnInit, OnDestroy {

  public pageContent: string;
  public title: string;
  private routeSubscription: Subscription;

  constructor(
    public content: ContentService,
    private _router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.content.get(params['page']).take(1).subscribe(data => {
        this.pageContent = data[0].content.rendered;
        this.title = data[0].title.rendered;
      });
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
