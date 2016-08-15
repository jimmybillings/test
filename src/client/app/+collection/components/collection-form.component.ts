import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Collection, Collections } from '../../shared/interfaces/collection.interface';
import { FormFields } from '../../shared/interfaces/forms.interface';
import { Asset } from '../../shared/interfaces/asset.interface';
// import { UiSubComponentsA } from '../../shared/interfaces/admin.interface';
import { WzFormComponent } from '../../shared/components/wz-form/wz.form.component';
import { CollectionsService } from '../services/collections.service';
import { ActiveCollectionService } from '../services/active-collection.service';
import { Observable, Subscription } from 'rxjs/Rx';
/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collection-form',
  templateUrl: 'collection-form.html',
  directives: [
    WzFormComponent
  ]
})

export class CollectionFormComponent implements OnInit {
  @Input() collection: Collection;
  @Input() newCollectionFormIsOpen: boolean;
  @Input() dialog: any;
  @Input() config: any;
  @Input() UiState: any;

  // public originalName: string;
  public assetForNewCollection: Asset;
  public collections: Observable<Collections>;
  public collectionsList: Subscription;
  public suggestions: Array<string> = [];
  public formItems: Array<FormFields> = [];

  private areSuggestionsVisible: boolean = false;
  private selectedSuggestion: String;
  private activeSuggestion: string;
  @ViewChild(WzFormComponent) private wzForm: WzFormComponent;

  constructor(
    public collectionsService: CollectionsService,
    public activeCollection: ActiveCollectionService) {
    this.collections = this.collectionsService.data;
  }

  ngOnInit() {
    this.formItems = this.config.form.items;
  }

  public createCollection(collection: Collection): void {
    collection.tags = (collection.tags) ? collection.tags.split(/\s*,\s*/) : [];
    this.collectionsService.createCollection(collection).take(1).subscribe(collection => {
      this.activeCollection.set(collection.id).take(1).subscribe(() => {
        this.activeCollection.getItems(collection.id, 100).take(1).subscribe();
      });
    });
    this.dialog.close();
    this.cancelCollectionCreation();
  }

  public cancelCollectionCreation(): void {
    this.formItems = this.formItems.map((field: FormFields) => { field.value = ''; return field; });
    this.wzForm.resetForm();
    this.suggestions = [];
    this.activeSuggestion = null;
    this.areSuggestionsVisible = false;
  }

  public closeSuggestionMenu(): void {
    if (this.areSuggestionsVisible) {
      this.areSuggestionsVisible = false;
      this.activeSuggestion = null;
    }
  }

  public inputKeyUp(event: any): void {
    // Ignore TAB, UP, DOWN and ENTER since they are processed by the keydown handler
    if (event.which === 9 || event.keyCode === 9 ||
      event.which === 10 || event.keyCode === 10 ||
      event.which === 13 || event.keyCode === 13 ||
      event.which === 38 || event.keyCode === 38 ||
      event.which === 40 || event.keyCode === 40) {
      return;
    }
    this.areSuggestionsVisible = false;

    if (event.target.id === 'name-input') {
      if (event.target.value.length > 1) {
        this.collections.take(1).subscribe(data => {
          this.suggestions = this.getSuggestions(event.target.value, data);
        });
        this.areSuggestionsVisible = this.isVisible();
      } else {
        this.suggestions = [];
      }
    }
  }
  /**
   * 
   */
  public getSuggestions(term: string, data: Collections): Array<string> {
    return data.items.map((c: Collection) => {
      return c.name;
    }).filter((item: string) => {
      return item.toLowerCase().indexOf(term.toLowerCase()) === 0;
    });
  }

  public isVisible(): boolean {
    return this.suggestions.length > 0;
  }
  /**
   * When you click or hit enter take the active suggestion and make it the input field value.
   */
  public selectSuggestion(suggestion: string) {
    this.selectedSuggestion = suggestion;
    this.formItems = this.formItems.map((field: FormFields) => {
      if (field.name === 'name') field.value = suggestion;
        return field;
    });
    let cFormInput = <HTMLInputElement>document.getElementById('name-input');
    cFormInput.focus();
    this.suggestions = [];
    this.activeSuggestion = null;
    this.areSuggestionsVisible = false;
  }

  /**
   * Sets the active (highlighted) suggestion.
   */
  public setActiveSuggestion(suggestion: string) {
    this.activeSuggestion = suggestion;
    this.formItems = this.formItems.map((field: FormFields) => {
      if (field.name === 'name') field.value = suggestion;
      return field;
    });
  }

  /**
   * Gets the index of the active suggestion within the suggestions list.
   */
  public getActiveSuggestionIndex(): number {
    let activeSuggestionIndex = -1;
    if (this.activeSuggestion !== null) {
      activeSuggestionIndex = this.suggestions.indexOf(this.activeSuggestion);
    }
    return activeSuggestionIndex;
  }

  public inputKeyDown(event: KeyboardEvent): void {
    if (event.which === 9 || event.keyCode === 9) { // TAB
      // Only enter this branch if suggestions are displayed
      if (!this.areSuggestionsVisible) return;
      // Select the first suggestion
      this.selectSuggestion(this.suggestions[0]);
      // Remove all but the first suggestion
      this.suggestions.splice(1);
      // Hide the suggestions
      this.areSuggestionsVisible = false;
      event.preventDefault();

    } else if (event.which === 38 || event.keyCode === 38) { // UP
      // Find the active suggestion in the list
      let activeSuggestionIndex = this.getActiveSuggestionIndex();
      // If not found, then activate the first suggestion
      if (activeSuggestionIndex === -1) { this.setActiveSuggestion(this.suggestions[0]); return; };
      if (activeSuggestionIndex === 0) {
        // Go to the last suggestion
        this.setActiveSuggestion(this.suggestions[this.suggestions.length - 1]);
      } else {
        // Decrement the suggestion index
        this.setActiveSuggestion(this.suggestions[activeSuggestionIndex - 1]);
      }

    } else if (event.which === 40 || event.keyCode === 40) { // DOWN
      // Find the active suggestion in the list
      let activeSuggestionIndex = this.getActiveSuggestionIndex();
      // If not found, then activate the first suggestion
      if (activeSuggestionIndex === -1) {
        this.setActiveSuggestion(this.suggestions[0]);
        return;
      }
      if (activeSuggestionIndex === (this.suggestions.length - 1)) {
        // Go to the first suggestion
        this.setActiveSuggestion(this.suggestions[0]);
      } else {
        // Increment the suggestion index
        this.setActiveSuggestion(this.suggestions[activeSuggestionIndex + 1]);
      }
    } else if ((event.which === 10 || event.which === 13 ||
      event.keyCode === 10 || event.keyCode === 13) &&
      this.areSuggestionsVisible) { // ENTER
      // Select the active suggestion
      this.selectSuggestion(this.activeSuggestion);
      this.suggestions.splice(0);

      event.preventDefault();
    }
  }
}
