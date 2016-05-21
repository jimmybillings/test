import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

/**
 * site header component - renders the header information
 */
@Component({
  selector: 'app-nav',
  templateUrl: 'app/shared/components/app-nav/app-nav.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppNavComponent implements OnInit {
  @Input() currentUser: any;
  @Input() config: any;
  @Input() supportedLanguages: any;
  @Input() showFixed: any;
  @Input() state: any;
  @Input() searchBarIsActive: any;
  @Output() onLogOut = new EventEmitter();
  @Output() onChangeLang = new EventEmitter();
  @Output() onOpenBinTray = new EventEmitter();
  @Output() onOpenSearch = new EventEmitter();
  @Output() onOpenSidenav = new EventEmitter();

  public loggedInState: boolean;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.loggedInState = this.currentUser.loggedInState();
  }

  public logOut(event: Event) {
    this.onLogOut.emit(event);
  }

  public openSearch(event: Event) {
    this.onOpenSearch.emit(event);
  }

  public openBinTray(event: Event) {
    this.onOpenBinTray.emit(event);
  }

  public openSidenav(event: Event) {
    this.onOpenSidenav.emit(event);
  }
}
