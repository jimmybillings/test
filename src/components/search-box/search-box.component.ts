import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {FormBuilder, Validators, ControlGroup, Control, FORM_DIRECTIVES, NgFor, NgIf} from 'angular2/common';
import {Router} from 'angular2/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
import { RequestOptions, URLSearchParams } from 'angular2/http';

@Component({
  selector: 'search-box',
  templateUrl: 'components/search-box/search-box.html',
  directives: [FORM_DIRECTIVES, NgFor, NgIf],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchBox {
  @Input() config;
  @Input() loggedIn: boolean;
  @Input() apiConfig;
  @Input() state;
  @Output() onCloseSearch = new EventEmitter();
  @Output() searchContext = new EventEmitter();
  public searchTerms: Observable<any>;
  private searchForm: ControlGroup;
  
  constructor(public fb: FormBuilder, public router: Router, private http: Http) { 
    this.setForm();
  }

  ngOnInit() {
    this.config = this.config.config;
    if (!this.searchTerms) this.searchTerms = this.listenForSearchTerms();
  }
  
  ngOnChanges(changes) {
    if (changes.state) this.updateSearchBoxValue(changes.state.currentValue);
  }
  
  public updateSearchBoxValue(searchParams) {
    let params = searchParams.split('?')[1];
    if (!params) return;
    let obj = {};
    params = params.split('&');
    params.forEach((pair) => {
      pair = pair.split('=');
      obj[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    (<Control>this.searchForm.controls['query']).updateValue(obj['q']);
    this.searchTerms = this.listenForSearchTerms();
  }
  
  public closeSearch(event) {
    this.onCloseSearch.emit(event);
  }

  public setForm(value = null) {
    this.searchForm = this.fb.group({query: ['', Validators.required]});
  }

  public onSubmit(query, searchTerm = false) {
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
    return (this.loggedIn)
      ? 'assets-api/v1/search/solrcloud/searchTerms'
      : 'assets-api/v1/search/anonymous/solrcloud/searchTerms';
  }

  private options(query: string): RequestOptions {
    const search: URLSearchParams = new URLSearchParams();
    search.set('siteName', this.apiConfig.getPortal());
    search.set('text', query);
    search.set('prefix', 'true');
    search.set('maxTerms', '10');
    let headers = (this.loggedIn) ? this.apiConfig.authHeaders() : void null;
    let options = (this.loggedIn) ? { headers, search } : { search };
    return new RequestOptions(options);
  }
}

