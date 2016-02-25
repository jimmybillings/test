import {Component, Input} from 'angular2/core';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';
/**
 * Home page search component - renders search form passes form values to search component.
 */  
@Component({
  selector: 'search-box',
  templateUrl: 'components/home/search-box/search-box.html',
  directives: [FORM_DIRECTIVES],
  inputs: ['ui']
})

export class SearchBox {
  @Input() ui;
  private searchForm: ControlGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router) {
  }

  ngOnInit(): void {
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
  public onSubmit(query: string): void {
    this.router.navigate(['/Search', { q: query, n: this.ui.pageSize.value }]);
  }
}
