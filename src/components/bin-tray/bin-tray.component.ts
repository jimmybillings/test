import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {NgClass, NgIf, NgFor} from 'angular2/common';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {TranslatePipe} from 'ng2-translate/ng2-translate';




/**
 * Home page search component - renders search form passes form values to search component.
 */  
@Component({
  selector: 'bin-tray',
  templateUrl: 'components/bin-tray/bin-tray.html',
  directives: [ROUTER_DIRECTIVES, NgClass, MATERIAL_DIRECTIVES, NgIf, NgFor],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BinTray {
  @Input() config;
  @Input() showFixed;
  @Output() onCloseBinTray = new EventEmitter();
  // @Output() onChangeLang = new EventEmitter();
  
  
  constructor(
    public router: Router) {
  }

  // ngOnInit(): void {
  //   this.config = this.config.config;
  // }
  
  public closeBinTray(event) {
    this.onCloseBinTray.emit(event);
  }
}

