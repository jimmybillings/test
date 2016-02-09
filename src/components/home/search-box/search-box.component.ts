import {Component, Output, EventEmitter} from 'angular2/core';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES} from 'angular2/common';

@Component({
  selector: 'search-box',
  templateUrl: 'components/home/search-box/search-box.html',
  directives: [FORM_DIRECTIVES]
})

export class SearchBox {
  @Output() runSearch: EventEmitter<any> = new EventEmitter();

  private searchForm: ControlGroup;

  constructor(fb: FormBuilder) {
    this.searchForm = fb.group({
      query: ['', Validators.required]
    });
  }  
}
