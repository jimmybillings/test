import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CurrentUserService } from '../shared/services/current-user.service';
import { UiConfig } from '../shared/services/ui.config';
import { SearchContext } from '../shared/services/search-context.service';
import { Subscription } from 'rxjs/Subscription';
import { UiState } from '../shared/services/ui.state';
import { FilterService } from '../shared/services/filter.service';
import { UserPreferenceService } from '../shared/services/user-preference.service';
import { Router } from '@angular/router';
import { HomeVideoService } from './services/home.video.service';

import { GalleryViewService } from '../shared/services/gallery-view.service';
import { Gallery, GalleryPath, GalleryPathSegment, GalleryNavigationEvent } from '../shared/interfaces/gallery-view.interface';

declare var jwplayer: any;

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
  public heroVideo: any;
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
    if (this.config && this.config.heroContentType.value === 'video') {
      this.getVideoPlaylist();
      this.isVideo = true;
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
      this.searchContext.new({ gq: JSON.stringify(path), n: 100, i: 1, sortId: this.userPreference.state.sortId });
    }
  }

  private getVideoPlaylist(): void {
    this.homeVideoService.getVideo(this.config.heroContentId.value).take(1).subscribe((video) => {
      this.setUpVideo(video.playlist, 'hero-video');
    });
  }

  private setUpVideo(video: any, elementId: string): Observable<any> {
    return this.heroVideo = jwplayer(elementId).setup({
      autostart: true,
      controls: false,
      playlist: video,
      androidhls: false,
      mute: true,
      repeat: true,
      stretching: 'fill',
      height: '100%',
      width: '100%'
    }) as Observable<any>;


    // return this.heroVideo.on('play', function () {
    //   console.log(`vid is playing and hidden is ${this.isVideoHidden}`)
    //   this.isVideoHidden = false;
    // });
  }

  // public get isPlaying(): Observable<boolean> {
  //   return this.isVideoPlaying;
  //   };
  // }
  // private isVidPlaying(): Observable<boolean> {
  //   this.isVideoPlaying = true;
  //   this.isVideoHidden = false;
  //   console.log(this.isVideoPlaying);
  //   return this.isVideoPlaying;
  // }

  private changeRouteFor(path: GalleryPath): void {
    const route: any[] = ['/gallery-view'];
    if (path && path.length > 0) route.push({ path: JSON.stringify(path) });
    this.router.navigate(route);
  }
}
