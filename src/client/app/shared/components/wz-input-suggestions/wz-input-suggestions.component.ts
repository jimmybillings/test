import { Component, Input, ElementRef, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../services/api.service';
import { Api, ApiResponse } from '../../interfaces/api.interface';

@Component({
  moduleId: module.id,
  selector: 'wz-input-suggestions',
  template: `<ng-content></ng-content>
            <div class="suggestions-menu" [ngClass]="{'revealed': areSuggestionsVisible}">
              <div (click)="closeSuggestions()" md-line class="heading">{{ 'COLLECTION.FORM.TYPE_AHEAD_SUGGESTIONS_HEADING' | translate}}</div>
              <md-list>
                <md-list-item *ngFor="let suggestion of suggestions">
                  <button (click)="selectSuggestion(suggestion)" [ngClass]="{'active': activeSuggestion == suggestion}">
                    {{suggestion}}
                  </button>
                </md-list-item>
              </md-list>
            </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzInputSuggestionsComponent implements OnInit {
  @Input() fControl: FormControl;
  @Input() data: Observable<any>;
  @Input() apiConfig: any;
  public suggestions: Array<string> = [];
  private areSuggestionsVisible: boolean = false;
  private selectedSuggestion: String;
  private activeSuggestion: string;
  private shouldCallServer: boolean = true;

  constructor(private element: ElementRef, private apiService: ApiService, private detector: ChangeDetectorRef) { }

  ngOnInit() {
    this.areSuggestionsVisible = false;
    this.fControl.valueChanges
      .switchMap((query: string) => {
        if (query.length > 1 && this.shouldCallServer) {
          return this.query(query);
        } else {
          this.areSuggestionsVisible = false;
          this.shouldCallServer = true;
          this.detector.markForCheck();
          return [];
        }
      })
      .map(response => (response['items'] || []).map((item: any) => item.name))
      .subscribe(suggestions => {
        this.suggestions = suggestions;
        this.areSuggestionsVisible = this.suggestions.length > 0;
        this.detector.markForCheck();
      });
  }

  public closeSuggestions() {
    this.areSuggestionsVisible = false;
  }
  /**
   * When you click or hit enter take the active suggestion and make it the input field value.
   */
  public selectSuggestion(suggestion: string) {
    this.shouldCallServer = false;
    this.selectedSuggestion = suggestion;
    this.fControl.setValue(suggestion);
    this.suggestions = [];
    this.activeSuggestion = null;
    this.areSuggestionsVisible = false;
    this.detector.markForCheck();
  }

  /**
   * Sets the active (highlighted) suggestion.
   */
  public setActiveSuggestion(suggestion: string) {
    this.activeSuggestion = suggestion;
    this.detector.markForCheck();
  }

  /**
   * Gets the index of the active suggestion within the suggestions list.
   */
  public getActiveSuggestionIndex(): number {
    let activeSuggestionIndex = -1;
    if (this.activeSuggestion !== null) {
      activeSuggestionIndex = this.suggestions.indexOf(this.activeSuggestion);
    }
    this.detector.markForCheck();
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
      if (this.activeSuggestion) {
        this.selectSuggestion(this.activeSuggestion);
        this.suggestions.splice(0);
      } else {
        this.areSuggestionsVisible = false;
      }
      event.preventDefault();
    }
  }

  private query(query: string): Observable<ApiResponse> {
    return this.apiService.get2(
      Api.Assets,
      'collectionSummary/search',
      { parameters: { q: query, accessLevel: 'all', i: '0', n: '100' } }
    );
  }
}
