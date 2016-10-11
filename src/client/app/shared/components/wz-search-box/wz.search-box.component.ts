import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { UiState } from '../../services/ui.state';
import { ApiConfig } from '../../services/api.config';

@Component({
  moduleId: module.id,
  selector: 'wz-search-box',
  templateUrl: 'wz.search-box.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzSearchBoxComponent implements OnInit, OnChanges {
  @Input() config: any;
  @Input() currentUser: any;
  @Input() state: any;
  @Input() uiState: UiState;
  @Input() prefs: any;
  @Output() searchContext = new EventEmitter();
  public searchTerms: Observable<any>;
  public searchForm: FormGroup;

  constructor(public fb: FormBuilder, public router: Router, private http: Http, public apiConfig: ApiConfig) {
    this.setForm();
  }

  ngOnInit() {
    if (!this.searchTerms) this.searchTerms = this.listenForSearchTerms();
  }

  ngOnChanges(changes: any) {
    if (changes.state) this.updateSearchBoxValue(changes.state.currentValue);
  }

  public openFilters() {
    (<HTMLElement>document.querySelector('button.filter')).click();
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
    (<FormControl>this.searchForm.controls['query']).setValue(obj['q']);
    this.searchTerms = this.listenForSearchTerms();
  }

  public closeSearch() {
    this.prefs.closeSearch();
  }

  public setForm() {
    this.searchForm = this.fb.group({ query: ['', Validators.required] });
  }

  public onSubmit(query: any, searchTerm = false) {
    this.searchTerms = Observable.of([]);
    query = (searchTerm) ? '"' + query + '"' : query;
    this.searchContext.emit(query);
  }

  public listenForSearchTerms(): Observable<any> {
    return this.searchForm.valueChanges
      .debounceTime(500)
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
    let headers = (this.currentUser.loggedIn()) ? this.apiConfig.authHeaders() : this.apiConfig.headers();
    let options = { headers, search, body: '' };
    return new RequestOptions(options);
  }
}

