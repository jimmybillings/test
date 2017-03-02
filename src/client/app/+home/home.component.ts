import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CurrentUserService } from '../shared/services/current-user.service';
import { UiConfig } from '../shared/services/ui.config';
import { SearchContext } from '../shared/services/search-context.service';
import { Subscription } from 'rxjs/Rx';
import { UiState } from '../shared/services/ui.state';
import { FilterService } from '../shared/services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { Router } from '@angular/router';

import { GalleryViewUrlifier } from '../+gallery-view/services/gallery-view-urlifier';
import { GalleryViewService } from '../+gallery-view/services/gallery-view.service';
import { Gallery, GalleryPath, GalleryPathSegment, GalleryNavigationEvent } from '../+gallery-view/gallery-view.interface';

@Component({
  moduleId: module.id,
  selector: 'home-component',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, OnDestroy {
  public config: any;
  public data: Observable<Gallery>;
  private configSubscription: Subscription;

  constructor(
    public currentUser: CurrentUserService,
    public uiState: UiState,
    private uiConfig: UiConfig,
    private searchContext: SearchContext,
    private userPreference: UserPreferenceService,
    private galleryViewService: GalleryViewService,
    private router: Router,
    private filter: FilterService) { }

  ngOnInit() {
    this.configSubscription = this.uiConfig.get('home').subscribe((config) => {
      this.config = config.config;
    });
    if (this.currentUser.loggedIn() && this.config.galleryView) {
      this.data = this.galleryViewService.data;
    }
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

  public newSearchContext(query: any): void {
    let searchContext: any = { q: query, i: 1, n: this.config.pageSize.value, sortId: this.userPreference.state.sortId };
    this.filter.clear();
    this.searchContext.new(searchContext);
  }


  public onNavigate(event: GalleryNavigationEvent): void {
    const path = JSON.parse(JSON.stringify(this.galleryViewService.state.path));
    path.push(event.pathSegment);

    if (event.method === 'nextLevel') {
      this.changeRouteFor(path);
    } else {
      this.searchContext.new({ gq: this.galleryViewService.stringifyPathForSearch(path), n: 100, i: 1 });
    }
  }

  private changeRouteFor(path: GalleryPath): void {
    this.router.navigate(['/gallery-view'].concat(GalleryViewUrlifier.urlify(path)));
  }

}
