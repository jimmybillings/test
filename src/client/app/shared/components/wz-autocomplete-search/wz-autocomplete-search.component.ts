import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { UiState } from '../../services/ui.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'wz-autocomplete-search',
  templateUrl: 'wz-autocomplete.search.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WzAutocompleteSearchComponent {
  @Input() config: any;
  @Input() currentUser: any;
  @Input() uiState: UiState;
  @Output() searchContext = new EventEmitter();
  @Output() toggleFilterTree = new EventEmitter();
  public searchForm: FormGroup;
  public formOptions = {
    'endPoint': 'search/thesaurusTerms',
    'queryParams': 'maxTerms, 10',
    'suggestionHeading': 'COLLECTION.FORM.TYPE_AHEAD_SUGGESTIONS_HEADING',
    'name': 'name',
    'label': 'COLLECTION.FORM.COLLECTION_NAME_LABEL',
    'type': 'suggestions',
    'value': '',
    'validation': 'REQUIRED'
  };

  constructor(public fb: FormBuilder) {
    this.searchForm = this.fb.group({ query: ['', Validators.required] });
  }

  public toggleFilters() {
    this.toggleFilterTree.emit();
    (<HTMLElement>document.querySelector('button.filter')).click();
  }

  public onSubmit(query: any, searchTerm = false) {
    query = (searchTerm) ? '"' + query + '"' : query;
    this.searchContext.emit(query);
  }
}