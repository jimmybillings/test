import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit} from '@angular/core';
// import {ControlGroup, Control} from '@angular/common';
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

export class FooterComponent implements OnInit {
  @Input() currentUser: any;
  @Input() supportedLanguages: any;
  @Output() onChangeLang = new EventEmitter();
  public lang: any;
  // public langForm: ControlGroup;


  constructor() {
    // this.langForm = new ControlGroup({
    //   lang: new Control('en')
    // });
  }

  ngOnInit() {
    this.lang = this.supportedLanguages[0].code;
  }

  public changeLang(e: any) {
    this.onChangeLang.emit(e.target.value);
  }
}
