import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import { Router} from '@angular/router';
import { Collection } from '../../shared/interfaces/collection.interface';
import { MdMenuTrigger } from '@angular2-material/menu';
import { Observable } from 'rxjs/Rx';
/**
 * site header component - renders the header information
 */
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
  @Input() state: any;
  @Input() collection: Collection;
  @Input() UiState: any;
  @Input() prefs: any;
  @Input() permission: any;
  @Input() cartSize: any;
  @Output() onLogOut = new EventEmitter();
  @Output() onChangeLang = new EventEmitter();
  @Output() onOpenSidenav = new EventEmitter();
  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;

  constructor(private _router: Router) { }

  public logOut(event: Event) {
    this.onLogOut.emit(event);
    this.trigger.closeMenu();
  }

  public toggleSearch() {
    this.prefs.toggleSearch();
  }

  public toggleCollectionTray() {
    this.prefs.toggleCollectionTray();
  }

  public showNewCollection(event: Event) {
    this.UiState.showNewCollection();
  }

  public formatBadgeNumber(): Observable<string> {
    return this.cartSize.map((size: any) => {
      if (size) {
        return (size > 99) ? '99+' : size.toString();
      }
    });
  }
}
