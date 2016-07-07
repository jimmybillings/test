import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { Collection } from '../../../shared/interfaces/collection.interface';

/**
 * site header component - renders the header information
 */
@Component({
  moduleId: module.id,
  selector: 'app-nav',
  templateUrl: 'app-nav.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppNavComponent {
  @Input() currentUser: any;
  @Input() config: any;
  @Input() supportedLanguages: any;
  @Input() state: any;
  @Input() collection: Collection;
  @Input() UiState: any;
  @Input() permission: any;
  @Output() onLogOut = new EventEmitter();
  @Output() onChangeLang = new EventEmitter();
  @Output() onOpenSidenav = new EventEmitter();

  constructor(private _router: Router) { }

  public logOut(event: Event) {
    this.onLogOut.emit(event);
  }

  public openSearch() {
    this.UiState.openSearch();
  }

  public openBinTray() {
    this.UiState.openBinTray();
  }

  public showNewCollection(event: Event) {
    this.UiState.showNewCollection();
  }
}
