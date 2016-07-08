import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges} from '@angular/core';
import {FormBuilder, Validators, ControlGroup, Control, FORM_DIRECTIVES} from '@angular/common';
import {Http, Response, RequestOptions, URLSearchParams} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'search-box',
  templateUrl: 'search-box.html',
  directives: [FORM_DIRECTIVES],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchBoxComponent implements OnInit, OnChanges {
  @Input() config: any;
  @Input() currentUser: any;
  @Input() apiConfig: any;
  @Input() state: any;
  @Input() UiState: any;
  @Output() searchContext = new EventEmitter();
  public searchTerms: Observable<any>;
  public searchForm: ControlGroup;

  constructor(public fb: FormBuilder, public router: Router, private http: Http) {
    this.setForm();
  }

  ngOnInit() {
    if (!this.searchTerms) this.searchTerms = this.listenForSearchTerms();
  }

  ngOnChanges(changes: any) {
    if (changes.state) this.updateSearchBoxValue(changes.state.currentValue);
  }

  public updateSearchBoxValue(searchParams: any) {
    searchParams = searchParams.split(';');
    searchParams.shift();
    if (searchParams.length === 0) return;
    let obj: any = {};
    searchParams.forEach((pair: any) => {
      pair = pair.split('=');
      obj[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    (<Control>this.searchForm.controls['query']).updateValue(obj['q']);
    this.searchTerms = this.listenForSearchTerms();
  }

  public closeSearch() {
    this.UiState.closeSearch();
  }

  public setForm() {
    this.searchForm = this.fb.group({ query: ['', Validators.required] });
  }

  public onSubmit(query: any, searchTerm = false) {
    query = (searchTerm) ? '"' + query + '"' : query;
    this.searchContext.emit(query);
  }

  public listenForSearchTerms(): Observable<any> {
    return this.searchForm.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap((changes: { query: string }) => this.query(changes.query))
      .map((res: Response) => res.json().termsList);
  }

  private query(query: string): Observable<any> {
    return this.http.get(
      this.apiConfig.baseUrl() + this.url(query),
      this.options(query));
  }

  private url(query: string): string {
    return (this.currentUser.loggedIn())
      ? 'assets-api/v1/search/searchTerms'
      : 'assets-api/v1/search/anonymous/searchTerms';
  }

  private options(query: string): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    search.set('siteName', this.apiConfig.getPortal());
    search.set('text', query);
    search.set('prefix', 'true');
    search.set('maxTerms', '10');
    let headers = (this.currentUser.loggedIn()) ? this.apiConfig.authHeaders() : void null;
    let options = (this.currentUser.loggedIn()) ? { headers, search } : { search };
    return new RequestOptions(options);
  }
}

