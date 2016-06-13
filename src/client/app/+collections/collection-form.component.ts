import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import { RouteSegment } from '@angular/router';
import { Collection } from '../shared/interfaces/collection.interface';
import { TranslatePipe} from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../shared/components/wz-form/wz.form.component';

/**
 * Directive that renders a list of collections
 */
@Component({
  moduleId: module.id,
  selector: 'collection-form',
  templateUrl: 'collection-form.html',
  directives: [
    WzFormComponent
  ],
  pipes: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CollectionFormComponent implements OnInit {
  public originalName: string;
  public assetId: string;
  public focusedCollection: Collection;
  public showForm: boolean;
  @Input() config: Object;
  @Input() collection: Collection;
  @Output() create = new EventEmitter();
  @Output() cancelled = new EventEmitter();

  constructor(
    public routeSegment: RouteSegment) {
  }

  // set focused(value: Collection) {
  //   if (value) this.originalName = value.name;
  //   this.focusedCollection = Object.assign({}, value);
  // }

  ngOnInit(): void {
    this.showForm = true;
    this.assetId = this.routeSegment.getParam('asset');
  }

  createCollection(collection: Collection): void {
    this.showForm = false;
    setTimeout(() => { this.showForm = true; }, 700);
    collection.tags = collection.tags.split(',');
    this.assetId ? collection.assets = [this.assetId] : collection.assets = [];
    this.create.emit(collection);
    // clear the form so you can make another Collection
    let cForm = <HTMLFormElement>document.querySelector('wz-form form');
    cForm.reset();
  }
}
