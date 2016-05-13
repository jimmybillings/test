import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {ControlGroup, Control, NgClass, NgIf} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

/**
 * site footer component - renders the footer information
 */ 
@Component({
  selector: 'app-footer',
  templateUrl: 'components/footer/footer.html',
  directives: [ROUTER_DIRECTIVES, NgClass, NgIf, MATERIAL_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Footer {
  @Input() currentUser;
  @Input() supportedLanguages;
  @Output() onChangeLang = new EventEmitter();
  public langForm: ControlGroup;


  constructor() {
    this.langForm = new ControlGroup({
      lang: new Control('en')
    });
  }

  public changeLang(lang) {
    this.onChangeLang.emit(lang);
  }
}
