import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Collection } from '../shared/interfaces/collection.interface';



import {TranslatePipe} from 'ng2-translate/ng2-translate';
import { WzFormComponent } from '../shared/components/wz-form/wz.form.component';
import {UiConfig} from '../shared/services/ui.config';
import { Error } from '../shared/services/error.service';

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
})

export class CollectionFormComponent implements OnInit {
  public config: Object;
  public originalName: string;
  public errorMessage: string;
  public focusedCollection: Collection;

  @Input('collection') collection: Collection;
  @Output() create = new EventEmitter();
  @Output() cancelled = new EventEmitter();


  constructor(
    public uiConfig: UiConfig,
    public error: Error) {
  }

  set focused(value: Collection) {
    if (value) this.originalName = value.name;
    this.focusedCollection = Object.assign({}, value);
  }

  ngOnInit() {
    this.uiConfig.get('collection').subscribe((config) => this.config = config.config);
  }

  createCollection(collection: Collection): void {
    this.create.emit(collection);
  }
}
