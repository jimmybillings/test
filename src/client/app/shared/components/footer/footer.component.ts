import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {ControlGroup, Control} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

/**
 * site footer component - renders the footer information
 */
@Component({
  moduleId: module.id,
  selector: 'app-footer',
  templateUrl: 'footer.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FooterComponent {
  @Input() currentUser: any;
  @Input() supportedLanguages: any;
  @Output() onChangeLang = new EventEmitter();
  public langForm: ControlGroup;


  constructor() {
    this.langForm = new ControlGroup({
      lang: new Control('en')
    });
  }

  public changeLang(lang: string) {
    this.onChangeLang.emit(lang);
  }
}
