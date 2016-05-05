import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from 'angular2/core';
import {FormBuilder, Validators, ControlGroup, FORM_DIRECTIVES, NgFor, NgIf} from 'angular2/common';
import {Router} from 'angular2/router';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';
/**
 * Home page search component - renders search form passes form values to search component.
 */  
@Component({
  selector: 'search-box',
  templateUrl: 'components/search-box/search-box.html',
  directives: [FORM_DIRECTIVES, NgFor, NgIf],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchBox {
  @Input() config;
  @Output() onCloseSearch = new EventEmitter();
  @Output() searchContext = new EventEmitter();
  public searchTerms: Observable<any>;
  private searchForm: ControlGroup;

  constructor(public fb: FormBuilder, public router: Router, private http: Http) {}

  ngOnInit(): void {
    this.config = this.config.config; 
    this.setForm();
    this.searchTerms = this.listenForSearchTerms();
  }
 
  public setForm(value = null): void {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });
  }
  
  public listenForSearchTerms(): Observable<any> {
    return this.searchForm.valueChanges
      .debounceTime(200)
      .map((changes: {query:{}}) => this.makeUrl(changes.query))
      .switchMap(url => this.http.get(url))
      .map((res: Response) => res.json())
      .map((terms) => terms.termsList); 
  }

  public onSubmit(query): void {
    this.searchContext.emit(query);
  }
    
  public closeSearch(event): void {
    this.onCloseSearch.emit(event);
  }
  
  private makeUrl(query): string {
    return 'https://crxextapi.dev.wzplatform.com/assets-api/v1/search/anonymous/solrcloud/searchTerms?siteName=core&text='+query+'&maxTerms=10&prefix=true';
  }
}

