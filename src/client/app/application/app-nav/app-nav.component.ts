import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Collection } from '../../shared/interfaces/collection.interface';
import { MatMenuTrigger } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'app-nav',
  templateUrl: 'app-nav.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppNavComponent {
  @Input() currentUser: any;
  @Input() config: any;
  @Input() supportedLanguages: any;
  @Input() collection: Collection;
  @Input() uiState: any;
  @Input() userPreference: any;
  @Input() cartSize: any;
  @Input() userCan: any;
  @Output() onLogOut = new EventEmitter();
  @Output() onChangeLang = new EventEmitter();
  @Output() onOpenSidenav = new EventEmitter();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  public logOut(event: Event) {
    this.onLogOut.emit(event);
    this.trigger.closeMenu();
  }

  public toggleSearch() {
    this.userPreference.toggleSearch();
  }

  public toggleCollectionTray() {
    this.userPreference.toggleCollectionTray();
  }

  public showNewCollection() {
    this.uiState.showNewCollection();
  }

  public formatBadgeNumber(size: any): string {
    return (size > 99) ? '99+' : size.toString();
  }
}
