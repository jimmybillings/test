import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES, NgFor, NgIf} from 'angular2/common';
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
  @Output() onCloseSearch = new EventEmitter();
  @Output() searchContext = new EventEmitter();
  public searchTerms: Observable<any>;
  public context: { search: '' };
  private searchForm: ControlGroup;

  constructor(public fb: FormBuilder, public router: Router, private http: Http) { }

  ngOnInit() {
    this.config = this.config.config;
    this.setForm();
    this.searchTerms = this.listenForSearchTerms();
  }

  public closeSearch(event) {
    this.onCloseSearch.emit(event);
  }

  public setForm(value = null) {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });
  }

  public onSubmit(query, searchTerm = false) {
    this.searchTerms = this.listenForSearchTerms();
    query = (searchTerm) ? '"' + query + '"' : query;
    this.searchContext.emit(query);
  }

  public listenForSearchTerms(): Observable<any> {
    return this.searchForm.valueChanges
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

