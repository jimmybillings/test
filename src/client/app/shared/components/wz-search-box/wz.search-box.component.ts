import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { UiState } from '../../services/ui.state';
import { ApiService } from '../../services/api.service';
import { Api, ApiResponse } from '../../interfaces/api.interface';

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
  @Output() searchContext = new EventEmitter();
  @Output() toggleFilterTree = new EventEmitter();
  public searchTerms: Observable<any>;
  public searchForm: FormGroup;

  constructor(public fb: FormBuilder, public router: Router, private api: ApiService) {
    this.setForm();
  }

  ngOnInit() {
    if (!this.searchTerms) this.searchTerms = this.listenForSearchTerms();
  }

  ngOnChanges(changes: any) {
    if (changes.state) this.updateSearchBoxValue(changes.state.currentValue);
  }

  public toggleFilters() {
    this.toggleFilterTree.emit();
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
      .map(response => response['termsList']);
  }

  private query(query: string): Observable<ApiResponse> {
    return this.api.get(
      Api.Assets,
      this.currentUser.loggedIn() ? 'search/searchTerms' : 'search/anonymous/searchTerms',
      { parameters: { text: query, prefix: 'true', maxTerms: '10' } }
    );
  }
}

