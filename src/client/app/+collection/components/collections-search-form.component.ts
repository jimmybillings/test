import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'collections-search-form',
  templateUrl: 'collections-search-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionsSearchFormComponent {
  public searchCollections: FormGroup;
  public isCollectionSearchOpen: boolean = false;
  @Output() query = new EventEmitter();

  constructor(
    public fb: FormBuilder) {
    this.setForm();
  }

  public setForm() {
    this.searchCollections = this.fb.group({ query: ['', Validators.required] });
  }

  public openCollectionSearch() {
    this.isCollectionSearchOpen = true;
  }

  public closeCollectionSearch() {
    this.isCollectionSearchOpen = false;
  }

  public onSubmit() {
    this.query.emit(this.searchCollections.value);
  }
}
