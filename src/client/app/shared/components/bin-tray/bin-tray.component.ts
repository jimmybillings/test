import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { Collection } from '../../../shared/interfaces/collection.interface';

/**
 * Home page search component - renders search form passes form values to search component.
 */
@Component({
  moduleId: module.id,
  selector: 'bin-tray',
  templateUrl: 'bin-tray.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BinTrayComponent {
  @Input() collection: Collection;
  @Input() showFixed: any;
  @Output() onCloseBinTray = new EventEmitter();

  constructor(
    public router: Router) {
  }

  public closeBinTray(event: Event) {
    this.onCloseBinTray.emit(event);
  }
}

