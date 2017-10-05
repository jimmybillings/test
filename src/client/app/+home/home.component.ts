import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CurrentUserService } from '../shared/services/current-user.service';
import { UiConfig } from '../shared/services/ui.config';
import { SearchContext } from '../shared/services/search-context.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { UiState } from '../shared/services/ui.state';
import { FilterService } from '../shared/services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { Router } from '@angular/router';

import { GalleryViewService } from '../shared/services/gallery-view.service';
import { Gallery, GalleryPath, GalleryPathSegment, GalleryNavigationEvent } from '../shared/interfaces/gallery-view.interface';
import { HomeVideoService } from './services/home.video.service';
import { Common } from '../shared/utilities/common.functions';

@Component({
  moduleId: module.id,
  selector: 'home-component',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent implements OnInit, OnDestroy {
  public config: any;
  public data: Observable<Gallery>;
  public isVideo: boolean = false;
  public playlist: Subject<any> = new Subject();
  private configSubscription: Subscription;

  constructor(
    public currentUser: CurrentUserService,
    public uiState: UiState,
    private uiConfig: UiConfig,
    private searchContext: SearchContext,
    private userPreference: UserPreferenceService,
    private galleryViewService: GalleryViewService,
    private homeVideoService: HomeVideoService,
    private router: Router,
    private filter: FilterService
  ) { }

  ngOnInit() {
    this.configSubscription = this.uiConfig.get('home').subscribe((config) => {
      this.config = config.config;
    });
    if (this.currentUser.loggedIn() && this.config.galleryView) {
      this.data = this.galleryViewService.data;
    }
    if (this.config && this.config.heroContentType && this.config.heroContentType.value === 'video') {
      this.isVideo = true;
      this.getVideoPlaylist();
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
    const path = Common.clone(this.galleryViewService.state.path);
    path.push(event.pathSegment);

    if (event.method === 'nextLevel') {
      this.changeRouteFor(path);
    } else {
      this.searchContext.new({ gq: JSON.stringify(path), n: 100, i: 1, sortId: this.userPreference.state.sortId });
    }
  }

  public getVideoPlaylist(): void {
    this.homeVideoService.getVideo(this.config.heroContentId.value)
      .map(video => video.playlist)
      .subscribe(playlist => this.playlist.next(playlist));
  }

  private changeRouteFor(path: GalleryPath): void {
    const route: any[] = ['/gallery-view'];
    if (path && path.length > 0) route.push({ path: JSON.stringify(path) });
    this.router.navigate(route);
  }
}
