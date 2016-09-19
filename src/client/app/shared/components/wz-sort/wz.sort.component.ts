import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-sort-component',
  templateUrl: 'wz.sort.html'
})

export class WzSortComponent implements OnInit {
  @Input() items: Array<any>;
  @Output() sort = new EventEmitter();

  ngOnInit() {
    console.log('wz sort');
  }
}
