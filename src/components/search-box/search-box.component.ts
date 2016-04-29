import {Component, Input, ChangeDetectionStrategy, Output, EventEmitter} from 'angular2/core';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

/**
 * Home page search component - renders search form passes form values to search component.
 */  
@Component({
  selector: 'search-box',
  templateUrl: 'components/search-box/search-box.html',
  directives: [FORM_DIRECTIVES],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchBox {
  @Input() config;
  @Output() searchContext = new EventEmitter();
  private searchForm: ControlGroup;
  
  constructor(
    public fb: FormBuilder,
    public router: Router) {
  }

  ngOnInit(): void {
    this.config = this.config.config;
    this.setForm();
  }

  /**
   * setup the search form input field
   */  
  public setForm(): void {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });
  }
  /**
   * Changes URL to search page and sets search params to query string and page size
   * @param query  Value of search input
  */
  public onSubmit(query): void {
    this.searchContext.emit(query);
  }
}

